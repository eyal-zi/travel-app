import { useCallback, useEffect, useRef, useState } from 'react'
import type { GeoLayer } from './geo.types'
import { parseFile } from './parsers'

export interface UseGeoLayers {
  layers: GeoLayer[]
  addFromFiles: (files: File[]) => Promise<number>
  remove: (id: string) => void
  clear: () => void
  reset: (layers: GeoLayer[]) => void
  replace: (layers: GeoLayer[]) => void
}

/**
 * Working geo-layer state shared by the map surfaces. File-parse failures are
 * reported through `onError` (wire it to a `useNotification` notifier) rather
 * than held here, so each caller surfaces them via the shared `Notification`.
 */
export const useGeoLayers = (onError?: (message: string) => void): UseGeoLayers => {
  const [layers, setLayers] = useState<GeoLayer[]>([])
  // Held in a ref so `addFromFiles` stays stable even if the notifier isn't memoised.
  const onErrorRef = useRef(onError)
  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const addFromFiles = useCallback(async (files: File[]): Promise<number> => {
    const results = await Promise.allSettled(
      files.map(async (file): Promise<GeoLayer> => {
        const data = await parseFile(file)
        return { id: crypto.randomUUID(), name: file.name, source: 'file', data }
      }),
    )

    const added = results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
    const failures = results
      .filter((r) => r.status === 'rejected')
      .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)))

    if (added.length) setLayers((prev) => [...prev, ...added])
    if (failures.length) onErrorRef.current?.(failures.join('\n'))
    return added.length
  }, [])

  const remove = useCallback((id: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id))
  }, [])

  const clear = useCallback(() => setLayers([]), [])

  const reset = useCallback((next: GeoLayer[]) => setLayers(next), [])

  // Apply edits made directly on the map (draw/edit/delete). Unlike `reset`,
  // which seeds the committed baseline, this represents user changes that the
  // pending diff should pick up so Save/Cancel surfaces.
  const replace = useCallback((next: GeoLayer[]) => setLayers(next), [])

  return { layers, addFromFiles, remove, clear, reset, replace }
}
