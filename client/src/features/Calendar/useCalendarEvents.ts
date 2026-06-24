import { useEffect, useState } from 'react'
import type { EventDropArg } from '@fullcalendar/core'
import type { EventResizeDoneArg } from '@fullcalendar/interaction'
import { useNotification } from '../../common/hooks/useNotification'
import {
  defaultFormValues,
  eventToForm,
  formToInput,
  toInclusiveEnd,
  toStored,
} from './Calendar.utils'
import { useEvents } from './queries/useEvents'
import { useEventMutations } from './queries/useEventMutations'
import type { CalendarDialogState, CalendarEvent } from './Calendar.types'
import type { EventFormValues } from './components/EventDialog/EventDialog.types'

const closedDialog = (): CalendarDialogState => ({
  open: false,
  mode: 'create',
  editingId: null,
  values: defaultFormValues(),
})

/**
 * Owns the calendar's editor dialog and bridges its actions to the React Query
 * event cache. The event list, caching, and optimistic updates live in
 * `useEvents`/`useEventMutations`; this hook adds the dialog state machine and
 * surfaces failures through the shared notification.
 */
export const useCalendarEvents = () => {
  const { events, isLoading, isError } = useEvents()
  const { createEvent, updateEvent, removeEvent } = useEventMutations()
  const { notification, notifyError, close } = useNotification()
  const [dialog, setDialog] = useState<CalendarDialogState>(closedDialog)

  // Surface a load failure once. notifyError is stable for the hook's lifetime,
  // so reacting to isError alone can't loop or spam.
  useEffect(() => {
    if (isError) notifyError('Failed to load events.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  const openCreate = (values: EventFormValues = defaultFormValues()) =>
    setDialog({ open: true, mode: 'create', editingId: null, values })

  const openEdit = (event: CalendarEvent) =>
    setDialog({
      open: true,
      mode: 'edit',
      editingId: event.id,
      values: eventToForm(event),
    })

  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }))

  const saveEvent = (values: EventFormValues) => {
    const { mode, editingId } = dialog
    closeDialog()
    const input = formToInput(values)
    if (mode === 'edit' && editingId) {
      updateEvent.mutate(
        { id: editingId, input },
        { onError: () => notifyError('Failed to save the event.') },
      )
    } else {
      createEvent.mutate(input, {
        onError: () => notifyError('Failed to create the event.'),
      })
    }
  }

  const deleteEvent = () => {
    const { editingId } = dialog
    if (!editingId) return
    closeDialog()
    removeEvent.mutate(editingId, {
      onError: () => notifyError('Failed to delete the event.'),
    })
  }

  /** Persists a drag/resize gesture coming from FullCalendar back to the server. */
  const moveEvent = (info: EventDropArg | EventResizeDoneArg) => {
    const { id, start, end, allDay } = info.event
    if (!start) return
    const input = {
      start: toStored(start, allDay),
      end: end ? toStored(allDay ? toInclusiveEnd(end) : end, allDay) : undefined,
      allDay,
    }
    updateEvent.mutate(
      { id, input },
      { onError: () => notifyError('Failed to move the event.') },
    )
  }

  return {
    events,
    loading: isLoading,
    dialog,
    notification,
    closeNotification: close,
    openCreate,
    openEdit,
    closeDialog,
    saveEvent,
    deleteEvent,
    moveEvent,
  }
}
