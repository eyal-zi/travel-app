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








export const DrawController = ({ layers, onChange }: DrawControllerProps) => {
  const map = useMap()
  const theme = useTheme()

  const groupRef = useRef<L.FeatureGroup | null>(null)
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  
  const drawnTagRef = useRef<GeoTag>({
    id: crypto.randomUUID(),
    name: 'Drawn shapes',
    source: 'drawn',
  })
  
  
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

  
  const wireLayer = useCallback(
    (layer: L.Layer) => {
      layer.on('pm:update', emit)
    },
    [emit],
  )

  
  useEffect(() => {
    const group = new L.FeatureGroup()
    group.addTo(map)
    groupRef.current = group

    map.pm.setGlobalOptions({ pathOptions: pathStyle, snappable: true })

    const handleCreate = (e: { layer: L.Layer }) => {
      
      
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
    
    
  }, [map, emit, wireLayer])

  
  
  useEffect(() => {
    const group = groupRef.current
    if (!group) return
    if (layers === lastEmittedRef.current) return
    loadLayersIntoGroup(group, layers, pathStyle)
    group.eachLayer(wireLayer)
  }, [layers, pathStyle, wireLayer])

  return null
}
