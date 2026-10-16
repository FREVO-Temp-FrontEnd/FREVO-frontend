import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Work } from "./portfolio-types";

export const PortfolioContext = createContext<{ works: Work[]; setWorks: Dispatch<SetStateAction<Work[]>> } | null>(null);
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("PortfolioProvider is required");
  return context;
}
