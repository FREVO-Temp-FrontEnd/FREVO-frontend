import { createTheme } from "@mui/material/styles";
import { theme } from "./theme";

// Use the same neutral boundaries for both workspaces.
export const freelancerTheme = createTheme(theme, {
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { "--line": theme.palette.divider },
        outlined: { borderColor: "var(--surface-border)" },
      },
    },
  },
});
