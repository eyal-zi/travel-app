import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {
  DialogHeader,
  ImageFrame,
  StyledDialog,
  WeatherImage,
} from './WeatherModal.styles'

type WeatherModalProps = {
  open: boolean
  /** Cache-busting seed so each open loads a fresh random image. */
  seed: number
  onClose: () => void
}

export const WeatherModal = ({ open, seed, onClose }: WeatherModalProps) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle component="div">
        <DialogHeader>
          <Typography variant="h5">Weather</Typography>
          <IconButton onClick={onClose} edge="end" aria-label="Close">
            <CloseRoundedIcon />
          </IconButton>
        </DialogHeader>
      </DialogTitle>

      <DialogContent>
        <ImageFrame>
          {!loaded && <CircularProgress />}
          <WeatherImage
            src={`https://picsum.photos/1200/720?random=${seed}`}
            alt="Weather preview"
            onLoad={() => setLoaded(true)}
            style={loaded ? undefined : { display: 'none' }}
          />
        </ImageFrame>
      </DialogContent>
    </StyledDialog>
  )
}
