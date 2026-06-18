import { useCallback, useEffect, useState } from 'react'
import type { EventDropArg } from '@fullcalendar/core'
import type { EventResizeDoneArg } from '@fullcalendar/interaction'
import { defaultFormValues, eventToForm, formToInput, toInclusiveEnd, toStored } from './Calendar.utils'
import { eventService } from './eventService'
import type { CalendarDialogState, CalendarEvent } from './Calendar.types'
import type { EventFormValues } from './components/EventDialog/EventDialog.types'

const closedDialog = (): CalendarDialogState => ({
  open: false,
  mode: 'create',
  editingId: null,
  values: defaultFormValues(),
})

/** Owns the calendar's event list, persisting every change to the server. */
export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [dialog, setDialog] = useState<CalendarDialogState>(closedDialog)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load the full event list once on mount; the calendar renders whatever range
  // it's showing from this set.
  useEffect(() => {
    let active = true
    eventService
      .list()
      .then(({ data }) => {
        if (active) setEvents(data)
      })
      .catch(() => {
        if (active) setError('Failed to load events.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const openCreate = useCallback(
    (values: EventFormValues = defaultFormValues()) =>
      setDialog({ open: true, mode: 'create', editingId: null, values }),
    [],
  )

  const openEdit = useCallback(
    (event: CalendarEvent) =>
      setDialog({ open: true, mode: 'edit', editingId: event.id, values: eventToForm(event) }),
    [],
  )

  const closeDialog = useCallback(() => setDialog((prev) => ({ ...prev, open: false })), [])

  const saveEvent = useCallback(
    async (values: EventFormValues) => {
      const { mode, editingId } = dialog
      closeDialog()
      const input = formToInput(values)
      if (mode === 'edit' && editingId) {
        // Optimistically apply the edit, rolling back if the server rejects it.
        const previous = events
        setEvents((prev) =>
          prev.map((event) => (event.id === editingId ? { ...event, ...input } : event)),
        )
        try {
          await eventService.update(editingId, input)
        } catch {
          setEvents(previous)
          setError('Failed to save the event.')
        }
        return
      }
      // Create needs the server-assigned id, so append the returned record.
      try {
        const { data } = await eventService.create(input)
        setEvents((prev) => [...prev, data])
      } catch {
        setError('Failed to create the event.')
      }
    },
    [dialog, events, closeDialog],
  )

  const deleteEvent = useCallback(async () => {
    const { editingId } = dialog
    if (!editingId) return
    closeDialog()
    const previous = events
    setEvents((prev) => prev.filter((event) => event.id !== editingId))
    try {
      await eventService.remove(editingId)
    } catch {
      setEvents(previous)
      setError('Failed to delete the event.')
    }
  }, [dialog, events, closeDialog])

  /** Persists a drag/resize gesture coming from FullCalendar back to the server. */
  const moveEvent = useCallback(
    async (info: EventDropArg | EventResizeDoneArg) => {
      const { id, start, end, allDay } = info.event
      if (!start) return
      const next = {
        start: toStored(start, allDay),
        end: end ? toStored(allDay ? toInclusiveEnd(end) : end, allDay) : undefined,
        allDay,
      }
      const previous = events
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? { ...event, ...next } : event)),
      )
      try {
        await eventService.update(id, next)
      } catch {
        setEvents(previous)
        setError('Failed to move the event.')
      }
    },
    [events],
  )

  return {
    events,
    dialog,
    loading,
    error,
    setError,
    openCreate,
    openEdit,
    closeDialog,
    saveEvent,
    deleteEvent,
    moveEvent,
  }
}
