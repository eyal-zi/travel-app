import type { ReactNode } from 'react'
import type { SelectOption } from '../../types'
import type {
  RequestDraft,
  RequestSummary,
} from '../RequestResponseDialog/RequestResponseDialog.types'

// The request shape the card needs: the dialog summary plus the requester's
// notes and creation time shown on the card itself. Both trip and file requests
// satisfy it.
export type RequestCardSummary = RequestSummary & {
  notes?: string
  createdAt: string
}

export type RequestCardProps = {
  request: RequestCardSummary
  // Whether this card's response dialog is open (owned by the feature item so it
  // can seed the draft from the same flag).
  open: boolean
  onOpen: () => void
  onClose: () => void
  draft: RequestDraft
  // When true, the dialog opens in admin mode (status/note/file editor).
  admin?: boolean
  // The feature-specific detail fields rendered inside the card's grid.
  children: ReactNode
}

// A labelled single-value detail field.
export type FieldProps = {
  label: string
  value: string
}

// A labelled list of tag chips, resolving each value to its option label.
export type TagDetailProps = {
  label: string
  values: string[]
  options: SelectOption[]
}
