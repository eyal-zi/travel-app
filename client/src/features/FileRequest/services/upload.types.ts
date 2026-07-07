// Types for the presigned multipart upload flow: the request/response shapes
// exchanged with /api/uploads/multipart, and the public contract of the
// browser-side orchestrator (see uploadService.ts and multipartUpload.ts).

// --- API shapes --------------------------------------------------------------

export type CreatedUpload = { key: string; uploadId: string }

export type SignedPart = { partNumber: number; url: string }

export type UploadedPart = { partNumber: number; etag: string }

// A part already stored for an open upload, used to resume without re-sending it.
export type ListedPart = { partNumber: number; size: number; etag: string }

export type CompletedUpload = {
  key: string
  sizeBytes: number
  contentType?: string
}

// --- Orchestrator contract ---------------------------------------------------

// A finished upload: the stored object key plus the metadata the respond call
// needs to record the large file.
export type UploadedFileRef = {
  key: string
  fileName: string
  contentType: string
}

export type UploadOptions = {
  // Called with overall progress in [0, 1] as the upload proceeds.
  onProgress?: (fraction: number) => void
  // Abort the upload (parts in flight are cancelled and the upload is aborted).
  signal?: AbortSignal
}
