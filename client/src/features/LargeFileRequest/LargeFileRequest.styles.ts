import { styled } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const PageRoot = styled(Box)(({ theme }) => ({
  // Locked to the viewport so the columns can size themselves against the
  // remaining height rather than overflowing the page.
  height: "100svh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // Slim vertical padding so the columns (and the map) get more height.
  padding: theme.spacing(2, 2),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5, 1.5),
  },
}));

export const Shell = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 1680,
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const PageHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const HeaderText = styled(Box)({
  minWidth: 0,
});

// Two columns: filters/map on the left, results on the right. On md down they
// stack and the whole split scrolls as one column.
export const Split = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: "flex",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    overflowY: "auto",
  },
}));

const panelBase = (theme: Theme) => ({
  width: "100%",
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
});

const scrollbar = (theme: Theme) => ({
  scrollbarWidth: "thin" as const,
  scrollbarColor: `${theme.palette.text.disabled} transparent`,
  "&::-webkit-scrollbar": { width: 8 },
  "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.text.disabled,
    borderRadius: 8,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: theme.palette.text.secondary,
  },
});

// The filters form: file-type select, accuracy slider, country/date fields, the
// map and the Search action. Never scrolls — the map flexes to absorb the
// leftover height and compacts on short viewports so the whole form always fits
// the column at every screen size.
export const FormCard = styled("form")(({ theme }) => ({
  ...panelBase(theme),
  // Give the filters/map column extra width over the results so the map has
  // more room to breathe.
  flex: 2,
  minWidth: 0,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  padding: theme.spacing(2.5),
  [theme.breakpoints.down("md")]: {
    flex: "none",
  },
}));

// A labelled form block (label/helper above the control).
export const Field = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

// The search-area field grows to absorb spare height so the map can flex.
export const MapField = styled(Field)({
  flex: 1,
  minHeight: 0,
});

// Frames the embedded map with rounded, clipped corners. On the desktop column
// it both grows into spare height and shrinks below its preferred size so the
// form always fits without scrolling: `flex: 1 1 240px` sets a comfortable
// target height, while `minHeight: 0` lets it compact further on short laptop
// screens. On md down the column scrolls as one, so the map takes a fixed height.
export const MapFrame = styled(Box)(({ theme }) => ({
  position: "relative",
  flex: "1 1 240px",
  minHeight: 0,
  borderRadius: 12,
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down("md")]: {
    flex: "none",
    minHeight: "clamp(260px, 48svh, 400px)",
  },
}));

// The form's action row. It never shrinks, so the map (which does) always yields
// height first and the Search action stays visible at the bottom of the card.
export const Actions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1.5),
  flexShrink: 0,
}));

// Right-hand results column wrapping the scrollable results panel.
export const ResultsColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("md")]: {
    flex: "none",
    minHeight: "60svh",
  },
}));

// Bounded, scrollable column of result cards.
export const ListPanel = styled(Box)(({ theme }) => ({
  ...panelBase(theme),
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  padding: theme.spacing(2.5),
  ...scrollbar(theme),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
  },
}));

export const StatusRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: theme.spacing(4, 3),
  color: theme.palette.text.secondary,
}));

// Zero-height sentinel observed for infinite scroll.
export const Sentinel = styled(Box)({
  height: 1,
  flexShrink: 0,
});
