import { alpha, keyframes, styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'



const riseInBottom = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
`

const riseInTop = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
`



export const Bar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'zIndex' && prop !== 'placement',
})<{ zIndex: number; placement: 'top' | 'bottom' }>(({ theme, zIndex, placement }) => ({
  position: 'absolute',
  ...(placement === 'top' ? { top: theme.spacing(2.5) } : { bottom: theme.spacing(2.5) }),
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex,
  maxWidth: `calc(100% - ${theme.spacing(4)})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.75),
  borderRadius: 999,


  backgroundColor: alpha(theme.palette.background.paper, 0.94),
  border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
  boxShadow: `0 8px 28px ${alpha(theme.palette.common.black, 0.24)}`,
  animation: `${placement === 'top' ? riseInTop : riseInBottom} 220ms cubic-bezier(0.22, 1, 0.36, 1)`,
}))



export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 999,
  paddingLeft: theme.spacing(2.25),
  paddingRight: theme.spacing(2.25),
  fontWeight: 600,
  boxShadow: 'none',
  transition: theme.transitions.create(['box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}))



export const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: 999,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.text.primary, 0.06),
  },
}))
