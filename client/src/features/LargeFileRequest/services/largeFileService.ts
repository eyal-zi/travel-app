// Large files: a newest-first, cursor-paginated search. POST (not GET) because
// the body carries a GeoJSON search area and filter arrays.

import api from '../../../common/api/axios'
import type { LargeFilePage, LargeFileSearch } from '../types'

export const largeFileService = {
  search: (payload: LargeFileSearch) =>
    api.post<LargeFilePage>('/api/large-files/search', payload),
}
