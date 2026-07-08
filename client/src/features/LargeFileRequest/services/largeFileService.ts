


import api from '../../../common/api/axios'
import type { LargeFilePage, LargeFileSearch } from '../types'

export const largeFileService = {
  search: (payload: LargeFileSearch) =>
    api.post<LargeFilePage>('/api/large-files/search', payload),
}
