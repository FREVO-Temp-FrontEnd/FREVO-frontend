import { Outlet, ScrollRestoration } from "react-router";
import { ThemeProvider, CssBaseline } from "@mui/material";
import PortfolioProvider from "@/lib/context/portfolio-provider";
import { theme } from "@/app/theme/theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PortfolioProvider>
        <ScrollRestoration />
        <Outlet />
      </PortfolioProvider>
    </ThemeProvider>
  );
}
