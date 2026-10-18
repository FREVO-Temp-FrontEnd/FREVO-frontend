import { createContext, useContext } from "react";
import type { ActingIdentity, UserRole, UserSession } from "@/lib/types/marketplace.types";

export interface AuthSessionContextType {
  user: UserSession | null;
  role: UserRole;
  actingIdentity: ActingIdentity;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchActingIdentity: (identity: ActingIdentity) => void;
  updateUser: (userUpdates: Partial<UserSession>) => void;
}

export const AuthSessionContext = createContext<AuthSessionContextType | null>(null);

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within an AuthSessionProvider");
  }
  return context;
}
