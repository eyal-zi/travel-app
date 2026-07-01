import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import { formatBytes, formatDay } from '../../../../common/utils/format'
import { LARGE_FILE_TYPE_OPTIONS } from '../../types'
import {
  Card,
  CardTop,
  MetaItem,
  MetaRow,
  TitleBlock,
} from './LargeFileResultItem.styles'
import type { LargeFileResultItemProps } from './LargeFileResultItem.types'

const typeLabel = (value: string) =>
  LARGE_FILE_TYPE_OPTIONS.find((option) => option.value === value)?.label ??
  value.charAt(0).toUpperCase() + value.slice(1)

export const LargeFileResultItem = ({ file }: LargeFileResultItemProps) => (
  <Card>
    <CardTop>
      <TitleBlock>
        <Typography variant="subtitle1" noWrap title={file.name}>
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {file.coverageDate ? formatDay(file.coverageDate) : 'Date not available'}
        </Typography>
      </TitleBlock>
      <Chip
        size="small"
        color="primary"
        variant="outlined"
        label={typeLabel(file.fileType)}
      />
    </CardTop>

    <MetaRow>
      <MetaItem>
        <PlaceRoundedIcon />
        <Typography variant="body2">
          {file.country ?? 'Unknown country'}
        </Typography>
      </MetaItem>
      <MetaItem>
        <MyLocationRoundedIcon />
        <Typography variant="body2">Accuracy {file.accuracy}</Typography>
      </MetaItem>
      <MetaItem>
        <StorageRoundedIcon />
        <Typography variant="body2">{formatBytes(file.sizeBytes)}</Typography>
      </MetaItem>
      <MetaItem>
        <PublicRoundedIcon />
        <Typography variant="body2">{file.geometry.type}</Typography>
      </MetaItem>
    </MetaRow>
  </Card>
)
