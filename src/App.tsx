import { Navigate, Route, Routes } from "react-router";
import ProjectExplorer from "@/components/project-explorer";
import LoginPage from "@/components/login-page";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectExplorer />} />
      <Route path="/projects/:projectId" element={<ProjectExplorer />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
