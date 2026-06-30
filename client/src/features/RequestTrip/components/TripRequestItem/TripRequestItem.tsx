import { formatDay } from '../../../../common/utils/format'
import { RequestCard } from '../../../../common/components/RequestCard/RequestCard'
import { Field } from '../../../../common/components/RequestCard/RequestCardFields'
import { labelFor } from '../../../../common/components/RequestCard/RequestCard.utils'
import { useOpenRequestId } from '../../../../common/hooks/useOpenRequestId'
import { useTripRequestDraft } from '../TripRequestResponseDialog/useTripRequestDraft'
import { TIMEZONE_OPTIONS, TIME_DIVISION_OPTIONS } from '../../types'
import type { TripRequestItemProps } from './TripRequestItem.types'

export const TripRequestItem = ({ request, admin }: TripRequestItemProps) => {
  const { openId, openRequest, closeRequest } = useOpenRequestId()
  const open = openId === request.id
  const draft = useTripRequestDraft(request, open)

  return (
    <RequestCard
      request={request}
      open={open}
      onOpen={() => openRequest(request.id)}
      onClose={closeRequest}
      draft={draft}
      admin={admin}
    >
      <Field label="Country" value={request.country} />
      <Field label="Landmark" value={request.landmark} />
      <Field
        label="Dates"
        value={`${formatDay(request.startDate)} → ${formatDay(request.endDate)}`}
      />
      <Field
        label="Time division"
        value={labelFor(TIME_DIVISION_OPTIONS, request.timeDivision)}
      />
      <Field label="Timezone" value={labelFor(TIMEZONE_OPTIONS, request.timezone)} />
    </RequestCard>
  )
}
