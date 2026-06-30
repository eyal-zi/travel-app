import { formatDay } from '../../../../common/utils/format'
import { RequestCard } from '../../../../common/components/RequestCard/RequestCard'
import {
  Field,
  TagDetail,
} from '../../../../common/components/RequestCard/RequestCardFields'
import { useOpenRequestId } from '../../../../common/hooks/useOpenRequestId'
import { LARGE_FILE_TYPE_OPTIONS } from '../../../../common/constants/fileTypes'
import { useFileRequestDraft } from '../FileRequestResponseDialog/useFileRequestDraft'
import { GEO_OPTIONS } from '../../types'
import type { FileRequestItemProps } from './FileRequestItem.types'

export const FileRequestItem = ({ request, admin }: FileRequestItemProps) => {
  const { openId, openRequest, closeRequest } = useOpenRequestId()
  const open = openId === request.id
  const draft = useFileRequestDraft(request, open)

  const areaCount = request.area.features.length

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
      <Field label="Agency" value={request.agency} />
      <Field
        label="Dates"
        value={`${formatDay(request.startDate)} → ${formatDay(request.endDate)}`}
      />
      <Field
        label="Area"
        value={`${areaCount} feature${areaCount === 1 ? '' : 's'}`}
      />
      <TagDetail
        label="File types"
        values={request.fileTypes}
        options={LARGE_FILE_TYPE_OPTIONS}
      />
      <TagDetail label="Geo" values={request.geo} options={GEO_OPTIONS} />
    </RequestCard>
  )
}
