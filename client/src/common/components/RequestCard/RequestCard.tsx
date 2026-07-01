import { format } from 'date-fns'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'
import NotesRoundedIcon from '@mui/icons-material/NotesRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded'
import { REQUEST_STATUS_META } from '../../requests/requestStatus'
import { RequestResponseDialog } from '../RequestResponseDialog/RequestResponseDialog'
import type { RequestCardProps } from './RequestCard.types'
import {
  Card,
  CardTop,
  Detail,
  DetailGrid,
  Footer,
  FooterMeta,
  GoalTitle,
  Indicators,
  NotesText,
  RequestedRow,
} from './RequestCard.styles'

/**
 * Shared request card: a keyboard-accessible summary card (title, status, detail
 * grid, requester notes, and admin-response indicators) that opens the shared
 * response dialog. Feature-agnostic — the caller owns the open state and draft,
 * and supplies the feature-specific detail fields as `children`. Used by the trip
 * and file request items.
 */
export const RequestCard = ({
  request,
  open,
  onOpen,
  onClose,
  draft,
  admin,
  children,
}: RequestCardProps) => {
  const status = REQUEST_STATUS_META[request.status] ?? REQUEST_STATUS_META.received
  const hasNote = Boolean(request.adminNote)
  const fileCount = request.files.length

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen()
          }
        }}
      >
        <CardTop>
          <GoalTitle variant="subtitle1">{request.tripGoal}</GoalTitle>
          <Chip label={status.label} color={status.color} size="small" />
        </CardTop>

        <DetailGrid>{children}</DetailGrid>

        {request.notes && (
          <Detail>
            <Typography variant="caption" color="text.secondary">
              Notes
            </Typography>
            <NotesText variant="body2">{request.notes}</NotesText>
          </Detail>
        )}

        <Footer>
          <FooterMeta>
            <RequestedRow>
              <ScheduleRoundedIcon />
              <Typography variant="caption">
                Requested {format(new Date(request.createdAt), 'PP p')}
              </Typography>
            </RequestedRow>

            {/* Admins see who submitted the request. */}
            {admin && request.createdByUsername && (
              <RequestedRow>
                <PersonOutlineRoundedIcon />
                <Typography variant="caption">
                  By {request.createdByUsername}
                </Typography>
              </RequestedRow>
            )}

            {/* Requesters see who last handled it and when. */}
            {!admin && request.updatedByUsername && (
              <RequestedRow>
                <UpdateRoundedIcon />
                <Typography variant="caption">
                  Updated by {request.updatedByUsername} ·{' '}
                  {format(new Date(request.updatedAt), 'PP p')}
                </Typography>
              </RequestedRow>
            )}
          </FooterMeta>

          {/* Small indicators that the admin has responded. */}
          {(hasNote || fileCount > 0) && (
            <Indicators>
              {hasNote && (
                <Chip
                  icon={<NotesRoundedIcon />}
                  label="Response"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {fileCount > 0 && (
                <Chip
                  icon={<AttachFileRoundedIcon />}
                  label={fileCount}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Indicators>
          )}
        </Footer>
      </Card>

      <RequestResponseDialog
        open={open}
        onClose={onClose}
        request={request}
        draft={draft}
        admin={admin}
      />
    </>
  )
}
