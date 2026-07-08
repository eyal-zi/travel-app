







import 'dotenv/config';
import pg from 'pg';
import type { Polygon } from 'geojson';
import { LARGE_FILE_TYPES } from '../src/features/large-files/large-files.schema';

const COUNT = 200;



const OTHER_TYPES = ['geotiff', 'netcdf', 'parquet', 'laz', 'dem'] as const;

const REGIONS = [
  'Alpine',
  'Coastal',
  'Saharan',
  'Amazon',
  'Arctic',
  'Pacific',
  'Andean',
  'Baltic',
  'Sahel',
  'Himalayan',
];
const SUBJECTS = [
  'elevation',
  'land cover',
  'road network',
  'hydrology',
  'imagery',
  'population',
  'soil survey',
  'bathymetry',
];
const COUNTRIES = [
  'France',
  'Brazil',
  'Japan',
  'Kenya',
  'Norway',
  'Canada',
  'Peru',
  'Australia',
  'India',
  'Morocco',
];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));
const pick = <T>(items: readonly T[]): T => items[randInt(0, items.length - 1)];



const randomFootprint = (): Polygon => {
  const half = rand(0.2, 2);
  const lon = rand(-175 + half, 175 - half);
  const lat = rand(-80 + half, 80 - half);
  return {
    type: 'Polygon',
    coordinates: [
      [
        [lon - half, lat - half],
        [lon + half, lat - half],
        [lon + half, lat + half],
        [lon - half, lat + half],
        [lon - half, lat - half],
      ],
    ],
  };
};

const randomFileType = (): string =>
  
  Math.random() < 0.8 ? pick(LARGE_FILE_TYPES) : pick(OTHER_TYPES);



const randomCoverageDate = (): string => {
  const now = Date.now();
  const threeYears = 3 * 365 * 24 * 60 * 60 * 1000;
  return new Date(now - rand(0, threeYears)).toISOString().slice(0, 10);
};

async function main(): Promise<void> {
  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE TABLE "large_files"');

    for (let i = 0; i < COUNT; i += 1) {
      const fileType = randomFileType();
      const name = `${pick(REGIONS)} ${pick(SUBJECTS)} #${i + 1}`;
      const accuracy = randInt(0, 15);
      const country = pick(COUNTRIES);
      const coverageDate = randomCoverageDate();
      const sizeBytes = randInt(5_000_000, 5_000_000_000);
      const footprint = randomFootprint();

      await client.query(
        `INSERT INTO "large_files" ("name", "file_type", "accuracy", "country", "coverage_date", "size_bytes", "geom")
         VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_GeomFromGeoJSON($7), 4326))`,
        [
          name,
          fileType,
          accuracy,
          country,
          coverageDate,
          sizeBytes,
          JSON.stringify(footprint),
        ],
      );
    }

    await client.query('COMMIT');
    console.log(`Seeded ${COUNT} large files.`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

void main();
