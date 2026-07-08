import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { Notification } from '../../../../common/components/Notification/Notification'
import { Composer } from '../../Announcements.styles'

type AnnouncementComposerProps = {
  onSend: (text: string) => void
  isPosting: boolean
  postError: boolean
  resetPostError: () => void
}





export const AnnouncementComposer = ({
  onSend,
  isPosting,
  postError,
  resetPostError,
}: AnnouncementComposerProps) => {
  const [draft, setDraft] = useState('')

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    setDraft('')
    onSend(text)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <Composer>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder="Write an announcement…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Tooltip title="Post announcement">
          <span>
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!draft.trim() || isPosting}
              aria-label="Post announcement"
            >
              <SendRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Composer>

      <Notification
        notification={
          postError
            ? { severity: 'error', message: 'Failed to post the announcement.' }
            : null
        }
        onClose={resetPostError}
      />
    </>
  )
}
