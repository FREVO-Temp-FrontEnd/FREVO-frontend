import { useEffect, useState, type ReactNode } from "react";
import type { ActingIdentity, UserRole, UserSession } from "@/lib/types/marketplace.types";
import { mockStorage } from "@/lib/storage/mockStorage";
import { AuthSessionContext, type AuthSessionContextType } from "./auth-context";

export default function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession>(() => mockStorage.getActiveUser());

  useEffect(() => {
    // Subscribe to mock storage pub/sub updates
    const unsubscribe = mockStorage.subscribe(() => {
      setUser(mockStorage.getActiveUser());
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, targetRole?: UserRole) => {
    const isTeam = email.includes("team") || email.includes("pixelcraft");
    const determinedRole: UserRole =
      targetRole ||
      (email.includes("client") || email.includes("nang") || email.includes("business")
        ? "client"
        : email.includes("admin")
        ? "admin"
        : "freelancer");

    const loggedInUser: UserSession = {
      id: `user-${Date.now()}`,
      email,
      name:
        determinedRole === "client"
          ? "Nắng Studio (Doanh nghiệp)"
          : determinedRole === "admin"
          ? "Quản trị viên FREVO"
          : isTeam
          ? "Pixel Craft Studio (Đại diện Team)"
          : "Minh Anh (Freelancer)",
      role: determinedRole,
      companyName: determinedRole === "client" ? "Nắng Studio" : undefined,
      actingIdentity: isTeam
        ? {
            type: "team",
            teamId: "team-001",
            teamName: "Pixel Craft Studio",
            roleInTeam: "representative",
          }
        : { type: "individual" },
      verified: true,
    };

    mockStorage.setActiveUser(loggedInUser);
  };

  const logout = () => {
    const guestUser: UserSession = {
      id: "guest-user",
      email: "",
      name: "Khách vãng lai",
      role: "guest",
      actingIdentity: { type: "individual" },
    };
    mockStorage.setActiveUser(guestUser);
  };

  const switchRole = (newRole: UserRole) => {
    mockStorage.switchRole(newRole);
  };

  const switchActingIdentity = (identity: ActingIdentity) => {
    const updated = {
      ...user,
      actingIdentity: identity,
    };
    mockStorage.setActiveUser(updated);
  };

  const updateUser = (userUpdates: Partial<UserSession>) => {
    const updated = {
      ...user,
      ...userUpdates,
    };
    mockStorage.setActiveUser(updated);
  };

  const value: AuthSessionContextType = {
    user,
    role: user.role,
    actingIdentity: user.actingIdentity || { type: "individual" },
    isAuthenticated: user.role !== "guest",
    login,
    logout,
    switchRole,
    switchActingIdentity,
    updateUser,
  };

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}
