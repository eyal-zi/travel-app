import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { useTheme } from '@mui/material/styles'
import L from 'leaflet'
import type { GeoLayer } from '../../../geo/geo.types'
import { groupToLayers, loadLayersIntoGroup, tagLayer, type GeoTag } from '../../../geo/editing'

interface DrawControllerProps {
  layers: GeoLayer[]
  onChange?: (layers: GeoLayer[]) => void
}

/**
 * Headless bridge between the declarative `layers` state and Geoman's imperative
 * editing. It owns a single FeatureGroup that holds every editable shape (from
 * file, API or freshly drawn), keeps it in sync with `layers`, and emits the
 * regrouped GeoLayers back out on every draw/edit/delete. Renders nothing; the
 * toolbar that toggles Geoman modes is a sibling (see `MapDrawToolbar`).
 */
export const DrawController = ({ layers, onChange }: DrawControllerProps) => {
  const map = useMap()
  const theme = useTheme()

  const groupRef = useRef<L.FeatureGroup | null>(null)
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // All freshly drawn shapes collect under one stable "Drawn shapes" layer.
  const drawnTagRef = useRef<GeoTag>({
    id: crypto.randomUUID(),
    name: 'Drawn shapes',
    source: 'drawn',
  })
  // The last array we emitted, so the sync effect can ignore our own updates and
  // avoid tearing down Geoman's live edit handles mid-edit.
  const lastEmittedRef = useRef<GeoLayer[] | null>(null)

  const pathStyle = useMemo<L.PathOptions>(
    () => ({ color: theme.palette.primary.main, weight: 2, fillOpacity: 0.15 }),
    [theme.palette.primary.main],
  )

  const emit = useCallback(() => {
    const group = groupRef.current
    if (!group) return
    const next = groupToLayers(group)
    lastEmittedRef.current = next
    onChangeRef.current?.(next)
  }, [])

  // Re-serialise whenever a shape's geometry finishes changing.
  const wireLayer = useCallback(
    (layer: L.Layer) => {
      layer.on('pm:update', emit)
    },
    [emit],
  )

  // One-time setup: the working group, Geoman global options, draw/remove wiring.
  useEffect(() => {
    const group = new L.FeatureGroup()
    group.addTo(map)
    groupRef.current = group

    map.pm.setGlobalOptions({ pathOptions: pathStyle, snappable: true })

    const handleCreate = (e: { layer: L.Layer }) => {
      // Geoman drops the drawn layer straight on the map; fold it into our group
      // and tag it so it serialises into the shared "Drawn shapes" layer.
      tagLayer(e.layer, drawnTagRef.current)
      wireLayer(e.layer)
      group.addLayer(e.layer)
      emit()
    }

    const handleRemove = (e: { layer: L.Layer }) => {
      group.removeLayer(e.layer)
      emit()
    }

    map.on('pm:create', handleCreate)
    map.on('pm:remove', handleRemove)

    return () => {
      map.off('pm:create', handleCreate)
      map.off('pm:remove', handleRemove)
      map.removeLayer(group)
      groupRef.current = null
    }
    // pathStyle is re-applied by the load effect below; setup runs once per map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, emit, wireLayer])

  // Load external changes (new baseline, dropped file, list delete) into the
  // group, skipping the echo of our own edits.
  useEffect(() => {
    const group = groupRef.current
    if (!group) return
    if (layers === lastEmittedRef.current) return
    loadLayersIntoGroup(group, layers, pathStyle)
    group.eachLayer(wireLayer)
  }, [layers, pathStyle, wireLayer])

  return null
}
