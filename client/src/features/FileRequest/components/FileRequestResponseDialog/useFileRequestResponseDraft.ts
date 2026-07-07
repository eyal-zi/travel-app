import { useCallback, useState } from 'react'
import type { FeatureCollection } from 'geojson'
import { useNotification } from '../../../../common/hooks/useNotification'
import { serializeDate } from '../../../../common/utils/date'
import {
  inferFileTypeValue,
  splitFileName,
} from '../../../../common/constants/fileTypes'
import type { RequestStatus } from '../../../../common/requests/requestStatus'
import type { GeoLayer } from '../../../../common/geo/geo.types'
import { useRespondFileRequest } from '../../queries/useRespondFileRequest'
import { uploadLargeFile } from '../../services/multipartUpload'
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
  const [fileType, setFileType] = useState('')
  const [accuracy, setAccuracy] = useState(DEFAULT_ACCURACY)
  const [country, setCountry] = useState('')
  const [coverageDate, setCoverageDate] = useState<Date | null>(null)
  const [areaLayers, setAreaLayers] = useState<GeoLayer[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  // Direct-to-S3 upload progress in [0, 1] while a large file is uploading, else
  // null (idle, or the quick metadata-only respond step afterwards).
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

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
      setFileType('')
      setAccuracy(DEFAULT_ACCURACY)
      setCountry('')
      setCoverageDate(null)
      setAreaLayers([])
      setFile(null)
    }
  }

  // Picking a file drives the metadata: fill the name from the file's base name
  // and the type from its extension (unknown extensions become a custom value).
  const setFileAndAutofill = useCallback((next: File) => {
    setFile(next)
    const { base, extension } = splitFileName(next.name)
    setName(base)
    setFileType(inferFileTypeValue(extension))
  }, [])

  // Merge every drawn layer's features into one footprint FeatureCollection.
  const features = areaLayers.flatMap((layer) => layer.data.features)
  const canSave =
    !saving &&
    Boolean(name.trim()) &&
    Boolean(fileType.trim()) &&
    Boolean(file) &&
    features.length > 0

  const submit = async (): Promise<boolean> => {
    if (!canSave || !file) return false
    setSaving(true)
    try {
      // Upload the (possibly multi-GB) file straight to S3 first, then send the
      // metadata referencing the resulting object — no file bytes touch the API.
      setUploadProgress(0)
      const uploaded = await uploadLargeFile(file, {
        onProgress: setUploadProgress,
      })
      setUploadProgress(null)

      const area: FeatureCollection = { type: 'FeatureCollection', features }
      const trimmedCountry = country.trim()
      const date = serializeDate(coverageDate)

      await respondAsync({
        id: request.id,
        payload: {
          name: name.trim(),
          fileType: fileType.trim(),
          accuracy,
          ...(trimmedCountry && { country: trimmedCountry }),
          ...(date && { coverageDate: date }),
          area,
          status: statusDraft,
          adminNote: note,
          fileKey: uploaded.key,
          fileName: uploaded.fileName,
        },
      })
      notifySuccess('Response sent.')
      return true
    } catch {
      notifyError('Could not send your response. Please try again.')
      return false
    } finally {
      setUploadProgress(null)
      setSaving(false)
    }
  }

  return {
    statusDraft,
    note,
    name,
    fileType,
    accuracy,
    country,
    coverageDate,
    file,
    saving,
    uploadProgress,
    canSave,
    setStatus: setStatusDraft,
    setNote,
    setName,
    setFileType,
    setAccuracy,
    setCountry,
    setCoverageDate,
    setAreaLayers,
    setFile: setFileAndAutofill,
    submit,
    notification,
    closeNotification: close,
  }
}
