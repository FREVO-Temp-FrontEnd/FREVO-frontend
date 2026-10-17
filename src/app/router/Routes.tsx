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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
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
