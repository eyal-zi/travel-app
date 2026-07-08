import type { ElementType } from 'react'
import { styled, alpha } from '@mui/material/styles'
import Box, { type BoxProps } from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import DialogTitle from '@mui/material/DialogTitle'
import Link from '@mui/material/Link'
import ToggleButton from '@mui/material/ToggleButton'
import Typography from '@mui/material/Typography'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'


type StatusColor = 'info' | 'warning' | 'success'

export const StyledDialog = styled(Dialog, {
  shouldForwardProp: (prop) => prop !== 'width',
})<{ width?: number }>(({ theme, width = 480 }) => ({
  
  
  
  '& .MuiBackdrop-root': {
    backgroundColor: alpha(theme.palette.common.black, 0.6),
  },
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: width,
    
    
    maxHeight: 'calc(100% - 64px)',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
    backgroundImage: 'none',
    boxShadow: `0 24px 64px ${alpha(theme.palette.common.black, 0.28)}`,
  },
  
  
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




export const DialogTitleBar = styled(DialogTitle)<{ component?: ElementType }>(
  ({ theme }) => ({
    paddingBottom: theme.spacing(1.5),
  }),
)

export const DialogHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
}))


export const TitleColumn = styled(Box)(({ theme }) => ({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}))

export const DialogGoalTitle = styled(Typography)({
  wordBreak: 'break-word',
  lineHeight: 1.3,
})

export const StatusChip = styled(Chip)({
  alignSelf: 'flex-start',
  fontWeight: 600,
})


export const Section = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))


export const UserSections = styled(Section)(({ theme }) => ({
  gap: theme.spacing(3),
}))

export const AdminSections = styled(Section)(({ theme }) => ({
  gap: theme.spacing(2),
}))



export const SectionDivider = styled(Divider)(({ theme }) => ({
  marginBlock: theme.spacing(-1),
}))


export const SectionLabel = styled(Typography)({
  letterSpacing: 0.6,
  fontWeight: 700,
})


export const StatusToggle = styled(ToggleButton, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor: StatusColor }>(({ theme, statusColor }) => ({
  fontWeight: 600,
  '&.Mui-selected, &.Mui-selected:hover': {
    color: theme.palette[statusColor].contrastText,
    backgroundColor: theme.palette[statusColor].main,
  },
}))


export const FileRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  minWidth: 0,
  '& svg': { fontSize: 16 },
}))


export const ExistingFileIcon = styled(AttachFileRoundedIcon)(({ theme }) => ({
  color: theme.palette.text.secondary,
}))

export const StagedFileIcon = styled(AttachFileRoundedIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
}))


export const FileLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'removed',
})<{ removed?: boolean }>(({ theme, removed }) => ({
  flex: 1,
  wordBreak: 'break-all',
  ...(removed && {
    textDecoration: 'line-through',
    color: theme.palette.text.disabled,
  }),
}))


export const StagedFileName = styled(Typography)({
  flex: 1,
  wordBreak: 'break-all',
})


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


export const ResponseNoteText = styled(Typography)({
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  lineHeight: 1.6,
})



export const ResponseByline = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  color: theme.palette.text.secondary,
  '& svg': { fontSize: 16 },
}))




export const FileCard = styled(Box)<BoxProps<'a'>>(({ theme }) => ({
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


export const FileCardBody = styled(Box)({
  flex: 1,
  minWidth: 0,
})


export const FileName = styled(Typography)({
  fontWeight: 600,
  wordBreak: 'break-all',
})


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
