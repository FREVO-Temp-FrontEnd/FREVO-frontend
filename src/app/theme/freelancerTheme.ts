import { createTheme } from "@mui/material/styles";
import { theme } from "./theme";

// Keep section boundaries consistent between MUI surfaces and legacy CSS.
const freelancerDivider = "#a8b0a2";

export const freelancerTheme = createTheme(theme, {
  palette: { divider: freelancerDivider },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { "--line": freelancerDivider },
        outlined: { borderColor: freelancerDivider },
      },
    },
  },
});
