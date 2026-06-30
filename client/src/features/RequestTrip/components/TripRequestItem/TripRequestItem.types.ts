import type { TripRequest } from '../../types'

export type TripRequestItemProps = {
  request: TripRequest
  // When true, the dialog opens in admin mode (status/note/file editor).
  admin?: boolean
}
