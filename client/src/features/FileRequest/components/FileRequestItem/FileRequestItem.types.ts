import type { FileRequest } from '../../types'

export type FileRequestItemProps = {
  request: FileRequest
  // When true, the dialog opens in admin mode (status/note/file editor).
  admin?: boolean
}
