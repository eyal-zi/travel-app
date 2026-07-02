import type { Geometry } from 'geojson';

// The metadata row shape shared by the search query and the create path (geometry
// already parsed to GeoJSON, createdAt still a Date) — mapped to LargeFileResult
// by `toResult`.
export interface LargeFileRow {
  id: string;
  name: string;
  fileType: string;
  accuracy: number;
  country: string | null;
  coverageDate: string | null;
  sizeBytes: number;
  geometry: Geometry;
  createdAt: Date;
}
