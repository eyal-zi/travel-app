import { useCallback, useState } from 'react'
import type { GeoLayer } from './geo.types'
import { parseFile } from './parsers'

export interface UseGeoLayers {
  /** The layers currently drawn on the map. */
  layers: GeoLayer[]
  /**
   * Parse and add dropped/selected files; sets `error` on any failure.
   * Resolves with the number of layers actually added (0 if all failed).
   */
  addFromFiles: (files: File[]) => Promise<number>
  /** Remove a single layer by id. */
  remove: (id: string) => void
  /** Remove every layer. */
  clear: () => void
  /** Replace the whole collection (e.g. to revert to a saved snapshot). */
  reset: (layers: GeoLayer[]) => void
  /** Last add failure message, or `null`. Set `null` to dismiss. */
  error: string | null
  setError: (error: string | null) => void
}

/**
 * Owns the collection of {@link GeoLayer}s shown on the map, decoupled from any
 * particular source. Today files feed it via {@link addFromFiles}; a future
 * `addFromApi` would slot in beside it without touching the drop-zone or the
 * map. Mirrors the action-bundle shape of other hooks in `common/`.
 */
export const useGeoLayers = (): UseGeoLayers => {
  const [layers, setLayers] = useState<GeoLayer[]>([])
  const [error, setError] = useState<string | null>(null)

  const addFromFiles = useCallback(async (files: File[]): Promise<number> => {
    // Parse all files in parallel; keep successes, collect failure messages so
    // one bad file doesn't discard the others.
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
    setError(failures.length ? failures.join('\n') : null)
    return added.length
  }, [])

  const remove = useCallback((id: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id))
  }, [])

  const clear = useCallback(() => setLayers([]), [])

  const reset = useCallback((next: GeoLayer[]) => setLayers(next), [])

  return { layers, addFromFiles, remove, clear, reset, error, setError }
}
