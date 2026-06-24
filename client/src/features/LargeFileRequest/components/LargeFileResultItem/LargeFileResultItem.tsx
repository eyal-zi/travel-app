import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import StorageRoundedIcon from '@mui/icons-material/StorageRounded'
import { formatBytes, formatDay } from '../../../../common/utils/format'
import { LARGE_FILE_TYPE_OPTIONS, type LargeFileResult } from '../../types'
import {
  Card,
  CardTop,
  MetaItem,
  MetaRow,
  TitleBlock,
} from './LargeFileResultItem.styles'

const typeLabel = (value: string) =>
  LARGE_FILE_TYPE_OPTIONS.find((option) => option.value === value)?.label ??
  value.charAt(0).toUpperCase() + value.slice(1)

type LargeFileResultItemProps = {
  file: LargeFileResult
}

export const LargeFileResultItem = ({ file }: LargeFileResultItemProps) => (
  <Card>
    <CardTop>
      <TitleBlock>
        <Typography variant="subtitle1" noWrap title={file.name}>
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDay(file.createdAt)}
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
