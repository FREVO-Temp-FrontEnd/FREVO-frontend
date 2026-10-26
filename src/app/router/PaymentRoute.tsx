import { Navigate, useParams } from "react-router";
import RoleGuard from "@/app/shared/components/RoleGuard";
import { BusinessLayout } from "@/features/business/layout/BusinessLayout";
import PaymentLedgerPage from "@/features/payments/pages/PaymentLedgerPage";
import { useAuthSession } from "@/lib/hooks/useAuthSession";

export function PaymentRoute() {
  const { role } = useAuthSession();
  const { projectId } = useParams();

  if (role === "freelancer") {
    return <Navigate to={`/freelancer/payments/${projectId}`} replace />;
  }

  return (
    <RoleGuard allowedRoles={["client", "admin"]}>
      <BusinessLayout><PaymentLedgerPage /></BusinessLayout>
    </RoleGuard>
  );
}
