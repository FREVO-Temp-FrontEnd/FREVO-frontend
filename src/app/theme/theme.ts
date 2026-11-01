import { createTheme } from "@mui/material/styles";

// Keep page, panel and inset surfaces distinct across MUI and legacy CSS.
const surfaces = {
  canvas: "#f0f2f5",
  paper: "#ffffff",
  inset: "#f8fafc",
  border: "#d0d5dd",
  muted: "#667085",
  shadow: "0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)",
};

export const theme = createTheme({
  palette: {
    primary: {
      main: "#f4490b",
      dark: "#bd3d14",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#20201f",
      contrastText: "#ffffff",
    },
    background: {
      default: surfaces.canvas,
      paper: surfaces.paper,
    },
    text: {
      primary: "#20201f",
      secondary: surfaces.muted,
    },
    divider: surfaces.border,
  },
  typography: {
    fontFamily: '"Space Grotesk", Arial, sans-serif',
    h1: {
      fontFamily: "Archivo, Arial, sans-serif",
      fontWeight: 900,
    },
    h2: {
      fontFamily: "Archivo, Arial, sans-serif",
      fontWeight: 800,
    },
    h3: {
      fontFamily: "Archivo, Arial, sans-serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "Archivo, Arial, sans-serif",
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      fontFamily: '"Space Grotesk", Arial, sans-serif',
    },
  },
  shape: {
    borderRadius: 13,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--surface-canvas": surfaces.canvas,
          "--surface-paper": surfaces.paper,
          "--surface-inset": surfaces.inset,
          "--surface-border": surfaces.border,
          "--surface-muted": surfaces.muted,
          "--surface-shadow": surfaces.shadow,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: surfaces.border,
          boxShadow: surfaces.shadow,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${surfaces.border}`,
          boxShadow: surfaces.shadow,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: surfaces.inset },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#777a75",
          "&.Mui-checked": {
            color: "#f4490b",
          },
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: surfaces.paper, color: '#20201f',
          border: `1px solid ${surfaces.border}`, borderLeft: '4px solid #f4490b',
          borderRadius: 13, boxShadow: '0 6px 24px rgba(32,32,31,0.12)',
          padding: '8px 16px', maxWidth: 'min(480px, calc(100vw - 32px))',
          overflowWrap: 'anywhere',
        },
        message: { fontSize: 14, lineHeight: 1.6, padding: '6px 0' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 13, fontSize: 14, lineHeight: 1.6 },
        message: { minWidth: 0, overflowWrap: 'anywhere' },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { padding: '20px 24px', fontFamily: 'Archivo, Arial, sans-serif', fontWeight: 700, lineHeight: 1.4 } },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: '20px 24px', overflowWrap: 'anywhere' } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: '16px 24px', gap: 8, flexWrap: 'wrap' } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
        },
      },
    },
  },
});
