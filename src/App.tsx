import { Navigate, Route, Routes } from "react-router";
import ProjectExplorer from "@/components/project-explorer";
import LoginPage from "@/components/login-page";
import RegisterPage from "@/components/register-page";
import ForgotPasswordPage from "@/components/forgot-password-page";
import ProfilePage from "@/components/profile/profile-page";

import PortfolioDetailPage from "@/components/profile/portfolio-detail-page";
import PortfolioProvider from "@/components/profile/portfolio-provider";

export default function App() {
  return (
    <PortfolioProvider><Routes>
      <Route path="/" element={<ProjectExplorer />} />
      <Route path="/projects/:projectId" element={<ProjectExplorer />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/profile/portfolio/:workId" element={<PortfolioDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></PortfolioProvider>
  );
}
