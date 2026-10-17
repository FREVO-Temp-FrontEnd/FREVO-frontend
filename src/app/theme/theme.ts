import { createTheme } from "@mui/material/styles";

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
      default: "#f7f8f6",
      paper: "#ffffff",
    },
    text: {
      primary: "#20201f",
      secondary: "#747773",
    },
    divider: "#e4e6e2",
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
