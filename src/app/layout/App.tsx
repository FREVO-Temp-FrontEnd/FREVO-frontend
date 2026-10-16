import { Outlet, ScrollRestoration } from "react-router";
import PortfolioProvider from "@/lib/context/portfolio-provider";

export default function App() {
  return (
    <PortfolioProvider>
      <ScrollRestoration />
      <Outlet />
    </PortfolioProvider>
  );
}
