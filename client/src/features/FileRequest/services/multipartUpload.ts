












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

  
  
  let objectKey: string | undefined

  uppy.use(AwsS3, {
    
    
    
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

  
  if (onProgress) {
    uppy.on('progress', (percent) => onProgress(percent / 100))
  }
  
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
