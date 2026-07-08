import type { Geometry } from 'geojson';

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
