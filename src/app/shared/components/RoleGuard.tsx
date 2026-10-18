import { type ReactNode } from "react";
import { Navigate, useLocation, Outlet } from "react-router";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import type { UserRole } from "@/lib/types/marketplace.types";
import ForbiddenPage from "./ForbiddenPage";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children?: ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role, isAuthenticated } = useAuthSession();
  const location = useLocation();

  if (!isAuthenticated && !allowedRoles.includes("guest")) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <ForbiddenPage />;
  }

  return children ? <>{children}</> : <Outlet />;
}
