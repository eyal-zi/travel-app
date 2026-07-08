import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { Geometry } from 'geojson'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import { MapEditor } from '../MapEditor/MapEditor'
import { useGeoLayers } from '../../geo/useGeoLayers'
import { useNotification } from '../../hooks/useNotification'
import type { GeoLayer } from '../../geo/geo.types'
import { OverlayChip } from './GeoFilterMap.styles'

const DEFAULT_PROMPT = 'Drop a KML, GeoJSON, SHP, CSV or Excel file to set the search area'

type GeoFilterMapProps = {
  
  
  onChange: (layers: GeoLayer[]) => void
  
  prompt?: string
  
  
  initialGeometry?: Geometry | null
}




export type GeoFilterMapHandle = {
  addFiles: (files: File[]) => void
}







export const GeoFilterMap = forwardRef<GeoFilterMapHandle, GeoFilterMapProps>(
  ({ onChange, prompt = DEFAULT_PROMPT, initialGeometry }, ref) => {
    const { notification, notifyError, close } = useNotification()
    const { layers, addFromFiles, clear, replace, reset } = useGeoLayers(notifyError)

    
    useImperativeHandle(ref, () => ({ addFiles: addFromFiles }), [addFromFiles])

    
    
    const seeded = useRef(false)
    useEffect(() => {
      if (seeded.current || !initialGeometry) return
      seeded.current = true
      reset([
        {
          id: crypto.randomUUID(),
          name: 'Footprint',
          source: 'api',
          data: {
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', geometry: initialGeometry, properties: {} },
            ],
          },
        },
      ])
    }, [initialGeometry, reset])

    
    useEffect(() => {
      onChange(layers)
    }, [layers, onChange])

    return (
      <MapEditor
        layers={layers}
        onLayersChange={replace}
        onAddFiles={addFromFiles}
        notification={notification}
        onCloseNotification={close}
        dragPrompt={prompt}
      >
        {layers.length > 0 && (
          <OverlayChip
            icon={<LayersRoundedIcon />}
            label={`${layers.length} area${layers.length > 1 ? 's' : ''}`}
            onDelete={clear}
            color="primary"
            size="small"
          />
        )}
      </MapEditor>
    )
  },
)

GeoFilterMap.displayName = 'GeoFilterMap'
