import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import FreelancerHomePage from "@/features/freelancer/FreelancerHomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import PortfolioDetailPage from "@/features/profile/pages/PortfolioDetailPage";
import NotFound from "@/features/errors/NotFound";
import BusinessPrototype from "@/features/business/BusinessPrototype";
import ProjectDetailPage from "@/features/projects/details/ProjectDetailPage";
import RoleGuard from "@/app/shared/components/RoleGuard";
import ForbiddenPage from "@/app/shared/components/ForbiddenPage";
import GuestProjectExplorerPage from "@/features/public/pages/GuestProjectExplorerPage";

import InvitationsHubPage from "@/features/freelancer/pages/InvitationsHubPage";
import MyApplicationsPage from "@/features/freelancer/pages/MyApplicationsPage";
import ProjectChatPage from "@/features/projects/chat/ProjectChatPage";
import ProjectAgreementPage from "@/features/projects/agreements/ProjectAgreementPage";
import WorkspaceOverviewPage from "@/features/workspace/pages/WorkspaceOverviewPage";
import PaymentLedgerPage from "@/features/payments/pages/PaymentLedgerPage";
import ProjectReviewPage from "@/features/reviews/pages/ProjectReviewPage";
import TeamProfilePage from "@/features/team/pages/TeamProfilePage";
import NotificationCenterPage from "@/features/notifications/pages/NotificationCenterPage";
import AccountSettingsPage from "@/features/settings/pages/AccountSettingsPage";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";

import FreelancerLayout from "@/features/freelancer/layout/FreelancerLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <FreelancerLayout />,
        children: [
          {
            path: "",
            element: <FreelancerHomePage />,
          },
          {
            path: "explore",
            element: <GuestProjectExplorerPage />,
          },
          {
            path: "projects",
            element: <FreelancerHomePage />,
          },
          {
            path: "projects/:projectId",
            element: <FreelancerHomePage />,
          },
          {
            path: "projects/:projectId/details",
            element: <ProjectDetailPage />,
          },
          {
            path: "projects/:projectId/chat",
            element: <ProjectChatPage />,
          },
          {
            path: "projects/:projectId/agreement",
            element: <ProjectAgreementPage />,
          },
          {
            path: "freelancer/invitations",
            element: <InvitationsHubPage />,
          },
          {
            path: "freelancer/applications",
            element: <MyApplicationsPage />,
          },
          {
            path: "workspace/:projectId",
            element: <WorkspaceOverviewPage />,
          },
          {
            path: "payments/:projectId",
            element: <PaymentLedgerPage />,
          },
          {
            path: "reviews/:projectId",
            element: <ProjectReviewPage />,
          },
          {
            path: "team/profile",
            element: <TeamProfilePage />,
          },
          {
            path: "notifications",
            element: <NotificationCenterPage />,
          },
          {
            path: "settings",
            element: <AccountSettingsPage />,
          },
        ],
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "business/*",
        element: (
          <RoleGuard allowedRoles={["client", "admin"]}>
            <BusinessPrototype />
          </RoleGuard>
        ),
      },
      {
        path: "admin",
        element: (
          <RoleGuard allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </RoleGuard>
        ),
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "profile/portfolio/:workId",
        element: <PortfolioDetailPage />,
      },
      {
        path: "forbidden",
        element: <ForbiddenPage />,
      },
      {
        path: "not-found",
        element: <NotFound />,
      },
      {
        path: "*",
        element: <Navigate replace to="/not-found" />,
      },
    ],
  },
]);
