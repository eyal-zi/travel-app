// Uploads a (potentially multi-GB) file straight from the browser to S3/MinIO via
// a presigned multipart upload — no bytes pass through our API server, so size is
// bounded by storage, not server memory.
//
// The mechanics (chunking, bounded concurrency, per-part retry/backoff, resuming
// an interrupted upload from the parts S3 already has, and abort) are handled by
// Uppy's AWS S3 plugin. We run it headless: our only job is to wire its callbacks
// to our signing endpoints (uploadService) and adapt between Uppy's part shape
// (`PartNumber`/`ETag`) and ours (`partNumber`/`etag`).
//
// Requires bucket CORS to allow PUT from this origin AND expose the `ETag`
// response header (Uppy reads each part's ETag from its PUT response).

import AwsS3, { type AwsS3Part } from '@uppy/aws-s3'
import Uppy from '@uppy/core'
import { uploadService } from './uploadService'
import type { UploadOptions, UploadedFileRef } from './upload.types'

export const uploadLargeFile = async (
  file: File,
  options: UploadOptions = {},
): Promise<UploadedFileRef> => {
  const { onProgress, signal } = options
  const contentType = file.type || 'application/octet-stream'

  const uppy = new Uppy({ autoProceed: false, allowMultipleUploadBatches: false })

  // The stored object key, assigned by our createMultipartUpload below and needed
  // once the upload completes to record the large file.
  let objectKey: string | undefined

  uppy.use(AwsS3, {
    // Always use multipart so only our multipart endpoints are exercised (small
    // files simply upload as a single part). Chunk size is left to Uppy, which
    // sizes parts to stay within S3's 10,000-part limit for any file.
    shouldUseMultipart: true,

    createMultipartUpload: async (uppyFile) => {
      const { data } = await uploadService.create(uppyFile.name, uppyFile.type)
      objectKey = data.key
      return { key: data.key, uploadId: data.uploadId }
    },

    signPart: async (_uppyFile, { key, uploadId, partNumber }) => {
      const { data } = await uploadService.sign(key, uploadId, [partNumber])
      return { url: data.urls[0].url }
    },

    listParts: async (_uppyFile, { key, uploadId }): Promise<AwsS3Part[]> => {
      if (!uploadId) return []
      const { data } = await uploadService.list(key, uploadId)
      return data.map((part) => ({
        PartNumber: part.partNumber,
        Size: part.size,
        ETag: part.etag,
      }))
    },

    completeMultipartUpload: async (_uppyFile, { key, uploadId, parts }) => {
      await uploadService.complete(
        key,
        uploadId,
        parts.map((part) => ({
          partNumber: part.PartNumber!,
          etag: part.ETag!,
        })),
      )
      return {}
    },

    abortMultipartUpload: async (_uppyFile, { key, uploadId }) => {
      if (!uploadId) return
      await uploadService.abort(key, uploadId)
    },
  })

  // Report overall progress (0–100) as a [0, 1] fraction.
  if (onProgress) {
    uppy.on('progress', (percent) => onProgress(percent / 100))
  }
  // Cancelling aborts in-flight parts and calls abortMultipartUpload.
  signal?.addEventListener('abort', () => uppy.cancelAll(), { once: true })

  try {
    uppy.addFile({ name: file.name, type: contentType, data: file })

    const result = await uppy.upload()
    if (!result || result.failed?.length) {
      throw result?.failed?.[0]?.error ?? new Error('Upload failed')
    }
    if (!objectKey) throw new Error('Upload finished without an object key')

    return { key: objectKey, fileName: file.name, contentType }
  } finally {
    uppy.destroy()
  }
}
