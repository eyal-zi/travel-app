import { parse as parseWkt } from 'wellknown'
import type { Feature, FeatureCollection, GeoJsonProperties } from 'geojson'

type Row = Record<string, unknown>


const isGeometryColumn = (key: string) => {
  const normalized = key.trim().toLowerCase()
  return normalized === 'wkt' || normalized === 'geometry'
}

const isEmpty = (value: unknown) => value === null || value === undefined || String(value).trim() === ''






export const featureCollectionFromWktRows = (rows: Row[], fileName: string): FeatureCollection => {
  const headerKeys = rows.length ? Object.keys(rows[0]) : []
  const geometryKey = headerKeys.find(isGeometryColumn)
  if (!geometryKey) {
    throw new Error(`"${fileName}" has no WKT or GEOMETRY column.`)
  }

  const features: Feature[] = []
  for (const row of rows) {
    const cell = row[geometryKey]
    if (isEmpty(cell)) continue

    const geometry = parseWkt(String(cell).trim())
    if (!geometry) continue

    const properties: GeoJsonProperties = {}
    for (const [key, value] of Object.entries(row)) {
      if (key !== geometryKey) properties[key] = value
    }

    features.push({ type: 'Feature', geometry, properties })
  }

  if (!features.length) {
    throw new Error(`"${fileName}" contains no valid WKT geometry.`)
  }

  return { type: 'FeatureCollection', features }
}
