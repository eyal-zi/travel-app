import { styled, alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)',
    backgroundColor: alpha(theme.palette.common.black, 0.5),
  },
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: 480,
    // Bound the frame to the viewport and lay its sections out as a column so the
    // title/actions stay put and only the content scrolls.
    maxHeight: 'calc(100% - 64px)',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
    backgroundImage: 'none',
    boxShadow: `0 24px 64px ${alpha(theme.palette.common.black, 0.28)}`,
  },
  // The single scroll region. Min-height:0 lets it shrink inside the flex column
  // (otherwise it would push the frame taller and create the second scrollbar).
  '& .MuiDialogContent-root': {
    minHeight: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.palette.text.disabled} transparent`,
    '&::-webkit-scrollbar': { width: 8 },
    '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.text.disabled,
      borderRadius: 8,
    },
  },
}))

export const DialogHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
}))

// Vertical stack of the dialog's sections (status, note, files).
export const Section = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

// A single attached file: name link + (admin-only) remove button.
export const FileRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  minWidth: 0,
}))

// Soft, rounded card that frames the admin's written response in the user view.
export const NoteCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  paddingLeft: theme.spacing(2.5),
  borderRadius: 14,
  backgroundColor: alpha(theme.palette.primary.main, 0.06),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    insetBlock: theme.spacing(1.5),
    left: 0,
    width: 3,
    borderRadius: 3,
    backgroundColor: theme.palette.primary.main,
  },
}))

// Clickable file tile (rendered as an anchor) with a hover lift.
export const FileCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.25, 1.5),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
  transition: theme.transitions.create(['border-color', 'box-shadow', 'transform']),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
    transform: 'translateY(-1px)',
  },
}))

// Rounded icon badge sitting at the left of a file tile.
export const FileIconBadge = styled(Box)(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  width: 38,
  height: 38,
  borderRadius: 10,
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  '& svg': { fontSize: 20 },
}))

// Muted, centered placeholder for empty note/attachment sections.
export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(2.5),
  borderRadius: 14,
  border: `1px dashed ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  textAlign: 'center',
  '& svg': { fontSize: 26, opacity: 0.6 },
}))
