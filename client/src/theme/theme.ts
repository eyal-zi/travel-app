import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import type { PaletteMode, ThemeOptions } from '@mui/material/styles'

const tokens = {
  brand: {
    main: '#0d9488',
    light: '#2dd4bf',
    dark: '#0f766e',
  },
  accent: {
    main: '#f97316',
    light: '#fb923c',
    dark: '#c2410c',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
} as const

const SPACING_UNIT = 8
const BORDER_RADIUS = 12

const getPalette = (mode: PaletteMode): ThemeOptions['palette'] => {
  const isLight = mode === 'light'

  return {
    mode,
    primary: {
      main: isLight ? tokens.brand.main : tokens.brand.light,
      light: tokens.brand.light,
      dark: tokens.brand.dark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: isLight ? tokens.accent.main : tokens.accent.light,
      light: tokens.accent.light,
      dark: tokens.accent.dark,
      contrastText: '#ffffff',
    },
    success: { main: tokens.success },
    warning: { main: tokens.warning },
    error: { main: tokens.error },
    info: { main: tokens.info },
    background: {
      default: isLight ? tokens.neutral[50] : tokens.neutral[950],
      paper: isLight ? '#ffffff' : tokens.neutral[900],
    },
    text: {
      primary: isLight ? tokens.neutral[900] : tokens.neutral[100],
      secondary: isLight ? tokens.neutral[500] : tokens.neutral[400],
      disabled: isLight ? tokens.neutral[400] : tokens.neutral[600],
    },
    divider: isLight ? tokens.neutral[200] : tokens.neutral[800],
  }
}

const typography: ThemeOptions['typography'] = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: { fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' },
  h2: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' },
  h3: { fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' },
  h4: { fontSize: '1.375rem', fontWeight: 600, lineHeight: 1.3 },
  h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
  h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
  subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5 },
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', lineHeight: 1.6 },
  button: { fontSize: '0.9375rem', fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  caption: { fontSize: '0.75rem', lineHeight: 1.5 },
  overline: { fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' },
}

const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: { borderRadius: BORDER_RADIUS, paddingInline: 20, paddingBlock: 10 },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: { backgroundImage: 'none' },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: { borderRadius: BORDER_RADIUS * 1.5 },
    },
  },
  MuiTextField: {
    defaultProps: { variant: 'outlined', size: 'small' },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: { borderRadius: BORDER_RADIUS },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: BORDER_RADIUS / 1.5, fontWeight: 500 },
    },
  },
}

export const createAppTheme = (mode: PaletteMode) =>
  responsiveFontSizes(
    createTheme({
      palette: getPalette(mode),
      typography,
      shape: { borderRadius: BORDER_RADIUS },
      spacing: SPACING_UNIT,
      components,
    }),
  )

export default createAppTheme
