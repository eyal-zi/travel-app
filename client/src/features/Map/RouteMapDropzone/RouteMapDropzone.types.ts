import type { MapProps } from '../../../common/components/Map/Map.types'
import type { GeoLayer } from '../../../common/geo/geo.types'

export interface RouteMapDropzoneProps
  extends Omit<MapProps, 'layers' | 'editable' | 'onLayersChange'> {
  name?: string
  onSave?: (layers: GeoLayer[]) => void
}
