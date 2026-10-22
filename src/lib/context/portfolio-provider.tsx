import { useState, type ReactNode } from "react";
import { PortfolioContext } from "./portfolio-context";
import { initialWorks } from "@/lib/storage/seeds/portfolioSeed";

export default function PortfolioProvider({ children }: { children: ReactNode }) {
  const [works, setWorks] = useState(initialWorks);
  return (
    <PortfolioContext.Provider value={{ works, setWorks }}>
      {children}
    </PortfolioContext.Provider>
  );
}
