import { styled } from '@mui/material/styles'


export const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: theme.spacing(0.75, 2),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.paper,
  fontSize: theme.typography.overline.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}))



export const GroupItems = styled('ul', {
  shouldForwardProp: (prop) => prop !== 'indented',
})<{ indented?: boolean }>(({ theme, indented }) => ({
  padding: 0,
  ...(indented && { paddingLeft: theme.spacing(2) }),
}))
