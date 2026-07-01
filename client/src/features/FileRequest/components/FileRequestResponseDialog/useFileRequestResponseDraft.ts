import { useState } from 'react'
import type { FeatureCollection } from 'geojson'
import { useNotification } from '../../../../common/hooks/useNotification'
import { serializeDate } from '../../../../common/utils/date'
import { OTHER_FILE_TYPE } from '../../../../common/constants/fileTypes'
import type { RequestStatus } from '../../../../common/requests/requestStatus'
import type { GeoLayer } from '../../../../common/geo/geo.types'
import { useRespondFileRequest } from '../../queries/useRespondFileRequest'
import type { FileRequest } from '../../types'
import type { FileRequestResponseDraft } from './FileRequestResponseDialog.types'

const DEFAULT_ACCURACY = 7

/**
 * Owns the admin response draft for a file request: the workflow status/note and
 * the large-file form (name, type, accuracy, country, coverage date, footprint
 * layers and the uploaded file). Reseeds whenever the dialog (re)opens, then
 * `submit()` posts everything as multipart FormData via the respond mutation and
 * reports the outcome through the shared notification.
 */
export const useFileRequestResponseDraft = (
  request: FileRequest,
  open: boolean,
): FileRequestResponseDraft => {
  const { respondAsync } = useRespondFileRequest()
  const { notification, notifyError, notifySuccess, close } = useNotification()

  const [statusDraft, setStatusDraft] = useState<RequestStatus>(request.status)
  const [note, setNote] = useState(request.adminNote ?? '')
  const [name, setName] = useState('')
  const [typeValue, setTypeValue] = useState('')
  const [otherType, setOtherType] = useState('')
  const [accuracy, setAccuracy] = useState(DEFAULT_ACCURACY)
  const [country, setCountry] = useState('')
  const [coverageDate, setCoverageDate] = useState<Date | null>(null)
  const [areaLayers, setAreaLayers] = useState<GeoLayer[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  // Reseed each time the dialog transitions to open so it starts fresh and drops
  // abandoned edits. Adjusting state during render is the React-recommended
  // alternative to an effect here (see useRequestDraft).
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setStatusDraft(request.status)
      setNote(request.adminNote ?? '')
      setName('')
      setTypeValue('')
      setOtherType('')
      setAccuracy(DEFAULT_ACCURACY)
      setCountry('')
      setCoverageDate(null)
      setAreaLayers([])
      setFile(null)
    }
  }

  const fileType = typeValue === OTHER_FILE_TYPE ? otherType.trim() : typeValue
  // Merge every drawn layer's features into one footprint FeatureCollection.
  const features = areaLayers.flatMap((layer) => layer.data.features)
  const canSave =
    !saving &&
    Boolean(name.trim()) &&
    Boolean(fileType) &&
    Boolean(file) &&
    features.length > 0

  const submit = async (): Promise<boolean> => {
    if (!canSave || !file) return false
    setSaving(true)
    try {
      const area: FeatureCollection = { type: 'FeatureCollection', features }
      const form = new FormData()
      form.append('file', file)
      form.append('name', name.trim())
      form.append('fileType', fileType)
      form.append('accuracy', String(accuracy))
      const trimmedCountry = country.trim()
      if (trimmedCountry) form.append('country', trimmedCountry)
      const date = serializeDate(coverageDate)
      if (date) form.append('coverageDate', date)
      form.append('area', JSON.stringify(area))
      form.append('status', statusDraft)
      form.append('adminNote', note)

      await respondAsync({ id: request.id, form })
      notifySuccess('Response sent.')
      return true
    } catch {
      notifyError('Could not send your response. Please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    statusDraft,
    note,
    name,
    typeValue,
    otherType,
    accuracy,
    country,
    coverageDate,
    file,
    saving,
    canSave,
    setStatus: setStatusDraft,
    setNote,
    setName,
    setTypeValue,
    setOtherType,
    setAccuracy,
    setCountry,
    setCoverageDate,
    setAreaLayers,
    setFile,
    submit,
    notification,
    closeNotification: close,
  }
}
