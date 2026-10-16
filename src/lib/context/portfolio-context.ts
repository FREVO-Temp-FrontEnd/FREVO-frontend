import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { Work } from "@/lib/types/portfolio.types";

export interface PortfolioContextType {
  works: Work[];
  setWorks: Dispatch<SetStateAction<Work[]>>;
}

export const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("PortfolioProvider is required");
  }
  return context;
}
