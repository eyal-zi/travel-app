export type UploadedTagProps = {
  // The date the shown file was actually uploaded for (may be a closest-
  // preceding fallback). When null/empty, the tag renders nothing.
  date: string | null
  // Stacking order of the pill within its positioned parent. Defaults to 1;
  // raise it (e.g. above Leaflet's map panes/controls) when overlaying a map.
  zIndex?: number
}
