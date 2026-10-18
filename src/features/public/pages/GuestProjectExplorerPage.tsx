import { useEffect } from "react";
import FreelancerHomePage from "@/features/freelancer/FreelancerHomePage";
import { useAuthSession } from "@/lib/hooks/useAuthSession";

/**
 * PUB-002: Guest Project Discovery Explorer
 * Traceable to FR-008, FR-009, FR-010, Stakeholder Decision 1
 * Provides unauthenticated guests full search, filtering, and read-only inspection
 * with interactive redirection guards for applications.
 */
export default function GuestProjectExplorerPage() {
  const { role, switchRole } = useAuthSession();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Khám phá dự án sáng tạo | FREVO";
    // If not guest or client explicitly browsing, allow exploration
    return () => {
      document.title = prevTitle;
    };
  }, [role, switchRole]);

  return <FreelancerHomePage />;
}
