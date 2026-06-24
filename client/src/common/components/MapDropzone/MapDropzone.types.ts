import type { GeoLayer } from '../../geo/geo.types'
import type { MapProps } from '../Map/Map.types'

export interface MapDropzoneProps extends Omit<MapProps, 'layers'> {
  // The persisted layers to display and edit against. Editing diffs against
  // this baseline; changing it (e.g. loading a different record) replaces the
  // working layers.
  committedLayers?: GeoLayer[]
  // Whether the committed layers are currently being loaded by the parent.
  loading?: boolean
  // Persist the working layers. Rejecting surfaces a save-failed message.
  onSave: (layers: GeoLayer[]) => Promise<void>
}
