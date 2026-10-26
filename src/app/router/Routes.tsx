import PortfolioManagerPage from "@/features/profile/pages/PortfolioManagerPage";
import { ProjectInboxPage } from "@/app/shared/components/inbox/ProjectInboxPage";
import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import FreelancerHomePage from "@/features/freelancer/FreelancerHomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import PortfolioDetailPage from "@/features/profile/pages/PortfolioDetailPage";
import NotFound from "@/features/errors/NotFound";
import TalentPublicProfilePage from "@/features/profile/pages/TalentPublicProfilePage";
import { TalentProfileActions } from "@/features/business/components/TalentProfileActions";
import { BusinessLayout } from "@/features/business/layout/BusinessLayout";
import BusinessPrototype from "@/features/business/BusinessPrototype";
import { OngoingProjectsPage } from "@/features/business/pages/OngoingProjectsPage";
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
import { PaymentRoute } from "./PaymentRoute";

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
            path: "freelancer/messages",
            element: <RoleGuard allowedRoles={["freelancer"]}><div style={{ height: "calc(100dvh - 76px)", minHeight: 0 }}><ProjectInboxPage /></div></RoleGuard>,
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
            path: "freelancer/payments/:projectId",
            element: <RoleGuard allowedRoles={["freelancer"]}><PaymentLedgerPage /></RoleGuard>,
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
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "profile/portfolio",
            element: <RoleGuard allowedRoles={["freelancer"]}><PortfolioManagerPage /></RoleGuard>,
          },
          {
            path: "profile/portfolio/:workId",
            element: <PortfolioDetailPage />,
          },
          {
            path: "notifications",
            element: <NotificationCenterPage />,
          },
          {
            path: "settings",
            element: <RoleGuard allowedRoles={["freelancer", "client", "admin"]}><AccountSettingsPage /></RoleGuard>,
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
        path: "payments/:projectId",
        element: <PaymentRoute />,
      },
      {
        path: "business/talent/:talentId",
        element: <RoleGuard allowedRoles={["client", "admin"]}><BusinessLayout><TalentPublicProfilePage actions={<TalentProfileActions />} /></BusinessLayout></RoleGuard>,
      },
      {
        path: "business/ongoing",
        element: <RoleGuard allowedRoles={["client", "admin"]}><BusinessLayout><OngoingProjectsPage /></BusinessLayout></RoleGuard>,
      },
      {
        path: "business/ongoing/:projectId/progress",
        element: <RoleGuard allowedRoles={["client", "admin"]}><BusinessLayout><WorkspaceOverviewPage /></BusinessLayout></RoleGuard>,
      },
      {
        path: "business/talent/:talentId/portfolio/:workId",
        element: <RoleGuard allowedRoles={["client", "admin"]}><BusinessLayout><PortfolioDetailPage /></BusinessLayout></RoleGuard>,
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
