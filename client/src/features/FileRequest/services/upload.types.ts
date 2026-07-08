





export type CreatedUpload = { key: string; uploadId: string }

export type SignedPart = { partNumber: number; url: string }

export type UploadedPart = { partNumber: number; etag: string }


export type ListedPart = { partNumber: number; size: number; etag: string }

export type CompletedUpload = {
  key: string
  sizeBytes: number
  contentType?: string
}





export type UploadedFileRef = {
  key: string
  fileName: string
  contentType: string
}

export type UploadOptions = {
  
  onProgress?: (fraction: number) => void
  
  signal?: AbortSignal
}
