import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import ProjectDashboard from "@/features/projects/dashboard/ProjectDashboard";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import PortfolioDetailPage from "@/features/profile/pages/PortfolioDetailPage";
import NotFound from "@/features/errors/NotFound";
import BusinessPrototype from "@/features/business/BusinessPrototype";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <ProjectDashboard />,
      },
      {
        path: "projects/:projectId",
        element: <ProjectDashboard />,
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
        element: <BusinessPrototype />,
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
