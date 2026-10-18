import { Outlet, ScrollRestoration } from "react-router";
import { ThemeProvider, CssBaseline } from "@mui/material";
import PortfolioProvider from "@/lib/context/portfolio-provider";
import AuthSessionProvider from "@/lib/context/auth-provider";
import { DemoController } from "@/app/shared/components/DemoController";
import { theme } from "@/app/theme/theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthSessionProvider>
        <PortfolioProvider>
          <ScrollRestoration />
          <Outlet />
          <DemoController />
        </PortfolioProvider>
      </AuthSessionProvider>
    </ThemeProvider>
  );
}
