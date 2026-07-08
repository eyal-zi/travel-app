import { fromBlob } from 'geotiff'
import proj4 from 'proj4'
import { toProj4, convertCoordinates } from 'geotiff-geokeys-to-proj4'
import type { FeatureCollection, Position } from 'geojson'






export const parseGeoTiff = async (file: File): Promise<FeatureCollection> => {
  const tiff = await fromBlob(file)
  const image = await tiff.getImage()

  const geoKeys = image.getGeoKeys()
  if (!geoKeys) {
    throw new Error(`"${file.name}" is not a geo-referenced TIFF.`)
  }

  
  
  const projection = toProj4(geoKeys as Parameters<typeof toProj4>[0])
  if (!projection.proj4) {
    throw new Error(`"${file.name}" uses an unsupported coordinate system.`)
  }

  
  const [minX, minY, maxX, maxY] = image.getBoundingBox()
  const toWgs84 = proj4(projection.proj4, 'WGS84')

  const project = ([x, y]: Position): Position => {
    const { x: convX, y: convY } = convertCoordinates(
      x,
      y,
      0,
      projection.coordinatesConversionParameters,
    )
    const [lng, lat] = toWgs84.forward([convX, convY])
    return [lng, lat]
  }

  
  const ring: Position[] = [
    project([minX, minY]),
    project([maxX, minY]),
    project([maxX, maxY]),
    project([minX, maxY]),
  ]
  ring.push(ring[0])

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: file.name },
        geometry: { type: 'Polygon', coordinates: [ring] },
      },
    ],
  }
}
