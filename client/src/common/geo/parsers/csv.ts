import * as XLSX from 'xlsx'
import type { FeatureCollection } from 'geojson'
import { featureCollectionFromWktRows } from './wktTable'

// Parses a .csv whose rows carry geometry in a WKT/GEOMETRY column.
export const parseCsv = async (file: File): Promise<FeatureCollection> => {
  const workbook = XLSX.read(await file.text(), { type: 'string' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)
  return featureCollectionFromWktRows(rows, file.name)
}
