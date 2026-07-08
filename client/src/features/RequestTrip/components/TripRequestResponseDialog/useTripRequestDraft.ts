import { useRequestDraft } from '../../../../common/components/RequestResponseDialog/hooks/useRequestDraft'
import { useUpdateTripRequest } from '../../queries/useUpdateTripRequest'
import { useTripRequestFiles } from '../../queries/useTripRequestFiles'
import type { TripRequest } from '../../types'





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
