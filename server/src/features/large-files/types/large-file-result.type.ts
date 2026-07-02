import type { Geometry } from 'geojson';

// A search hit: the stored metadata plus its footprint as GeoJSON.
export interface LargeFileResult {
  id: string;
  name: string;
  fileType: string;
  accuracy: number;
  country: string | null;
  coverageDate: string | null;
  sizeBytes: number;
  geometry: Geometry;
  createdAt: string;
}
