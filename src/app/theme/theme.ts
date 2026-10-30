import { createTheme } from "@mui/material/styles";

// Keep page, panel and inset surfaces distinct across MUI and legacy CSS.
const surfaces = {
  canvas: "#f2f4f7",
  paper: "#ffffff",
  inset: "#f8f9fb",
  border: "#dfe3e8",
  muted: "#667085",
  shadow: "0 1px 2px rgba(32,32,31,0.025)",
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
    divider: "#e7eaee",
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
