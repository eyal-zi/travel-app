import { useCallback, useState } from 'react'
import { parseISO } from 'date-fns'
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
  
  
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  
  
  
  
  
  
  
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      const largeFile = request.largeFile
      setStatusDraft(request.status)
      setNote(request.adminNote ?? '')
      setName(largeFile?.name ?? '')
      setFileType(largeFile?.fileType ?? '')
      setAccuracy(largeFile?.accuracy ?? DEFAULT_ACCURACY)
      setCountry(largeFile?.country ?? '')
      setCoverageDate(
        largeFile?.coverageDate ? parseISO(largeFile.coverageDate) : null,
      )
      setAreaLayers([])
      setFile(null)
    }
  }

  
  
  const setFileAndAutofill = useCallback((next: File) => {
    setFile(next)
    const { base, extension } = splitFileName(next.name)
    setName(base)
    setFileType(inferFileTypeValue(extension))
  }, [])

  
  
  const clearFile = useCallback(() => setFile(null), [])

  
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
    clearFile,
    submit,
    notification,
    closeNotification: close,
  }
}
