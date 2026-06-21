import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { useAnnouncements } from './quries/useAnnouncements'
import { AnnouncementItem } from './components/AnnouncementItem/AnnouncementItem'
import {
  Composer,
  Header,
  List,
  Root,
  Sentinel,
  StatusRow,
} from './Announcements.styles'

export const Announcements = () => {
  const {
    items,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    add,
    isPosting,
    postError,
    resetPostError,
  } = useAnnouncements()
  const [draft, setDraft] = useState('')

  // Fetch the next (older) page when the bottom sentinel nears the viewport.
  const { ref: sentinelRef, inView } = useInView({ rootMargin: '200px' })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    setDraft('')
    add(text)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Enter sends; Shift+Enter inserts a newline.
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <Root>
      <Header>
        <CampaignRoundedIcon />
        <Typography variant="h6">Announcements</Typography>
      </Header>

      <List>
        {items.map((announcement) => (
          <AnnouncementItem key={announcement.id} announcement={announcement} />
        ))}

        {isLoading && (
          <StatusRow>
            <CircularProgress size={22} />
          </StatusRow>
        )}

        {isError && !isLoading && (
          <StatusRow sx={{ flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">Failed to load announcements.</Typography>
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          </StatusRow>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <StatusRow>
            <Typography variant="body2">No announcements yet.</Typography>
          </StatusRow>
        )}

        {isFetchingNextPage && (
          <StatusRow>
            <CircularProgress size={20} />
          </StatusRow>
        )}

        {hasNextPage && <Sentinel ref={sentinelRef} />}
      </List>

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
        <Alert
          severity="error"
          variant="filled"
          onClose={() => resetPostError()}
        >
          Failed to post the announcement.
        </Alert>
      </Snackbar>
    </Root>
  )
}
