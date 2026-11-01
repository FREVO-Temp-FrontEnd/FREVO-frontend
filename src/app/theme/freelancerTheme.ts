import { createTheme } from "@mui/material/styles";
import { theme } from "./theme";

// Preserve the freelancer workspace's original palette independently of business surfaces.
const freelancerDivider = "#a8b0a2";

export const freelancerTheme = createTheme(theme, {
  palette: {
    background: { default: "#f7f8f6", paper: "#ffffff" },
    text: { primary: "#20201f", secondary: "#747773" },
    divider: freelancerDivider,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { "--line": freelancerDivider },
        outlined: { borderColor: freelancerDivider, boxShadow: "none" },
      },
    },
  },
});
