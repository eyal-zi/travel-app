import { styled } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const PageRoot = styled(Box)(({ theme }) => ({
  
  
  height: "100svh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  
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





export const FormCard = styled("form")(({ theme }) => ({
  ...panelBase(theme),
  
  
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


export const Field = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));


export const MapField = styled(Field)({
  flex: 1,
  minHeight: 0,
});






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



export const Actions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(1.5),
  flexShrink: 0,
}));


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


export const Sentinel = styled(Box)({
  height: 1,
  flexShrink: 0,
});
