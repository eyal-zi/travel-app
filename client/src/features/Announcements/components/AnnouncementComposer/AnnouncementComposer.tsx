import { useState } from 'react'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { Composer } from '../../Announcements.styles'

type AnnouncementComposerProps = {
  onSend: (text: string) => void
  isPosting: boolean
  postError: boolean
  resetPostError: () => void
}

/**
 * Input row for posting a new announcement. Owns its own draft state; the parent
 * supplies the submit handler and post status.
 */
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
    // Enter sends; Shift+Enter inserts a newline.
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

      <Snackbar
        open={postError}
        autoHideDuration={6000}
        onClose={() => resetPostError()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => resetPostError()}>
          Failed to post the announcement.
        </Alert>
      </Snackbar>
    </>
  )
}
