import type { Geometry } from 'geojson';

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
