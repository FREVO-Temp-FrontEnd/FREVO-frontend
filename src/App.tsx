import { Navigate, Route, Routes } from "react-router";
import ProjectExplorer from "@/components/project-explorer";
import LoginPage from "@/components/login-page";
import RegisterPage from "@/components/register-page";
import ForgotPasswordPage from "@/components/forgot-password-page";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectExplorer />} />
      <Route path="/projects/:projectId" element={<ProjectExplorer />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
