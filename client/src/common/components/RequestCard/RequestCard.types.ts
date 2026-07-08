import type { ReactNode } from 'react'
import type { SelectOption } from '../../types'
import type {
  RequestDraft,
  RequestSummary,
} from '../RequestResponseDialog/RequestResponseDialog.types'




export type RequestCardSummary = RequestSummary & {
  notes?: string
  createdAt: string
}

export type RequestCardProps = {
  request: RequestCardSummary
  
  
  open: boolean
  onOpen: () => void
  onClose: () => void
  
  
  draft?: RequestDraft
  
  admin?: boolean
  
  children: ReactNode
  
  
  renderDialog?: () => ReactNode
  
  
  fulfilled?: boolean
}


export type FieldProps = {
  label: string
  value: string
}


export type TagDetailProps = {
  label: string
  values: string[]
  options: SelectOption[]
}
