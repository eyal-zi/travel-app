import { useRequestDraft } from '../../../../common/components/RequestResponseDialog/hooks/useRequestDraft'
import { useUpdateTripRequest } from '../../queries/useUpdateTripRequest'
import { useTripRequestFiles } from '../../queries/useTripRequestFiles'
import type { TripRequest } from '../../types'

/**
 * Wires the trip-request mutations into the shared `useRequestDraft`, which owns
 * the admin editor's batched status/note/file draft.
 */
export const useTripRequestDraft = (request: TripRequest, open: boolean) => {
  const { updateRequestAsync } = useUpdateTripRequest()
  const { addFileAsync, removeFileAsync } = useTripRequestFiles()

  return useRequestDraft({
    request,
    open,
    updateRequestAsync,
    addFileAsync,
    removeFileAsync,
  })
}
