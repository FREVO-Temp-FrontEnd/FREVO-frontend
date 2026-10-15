import { Navigate, Route, Routes } from "react-router";
import ProjectExplorer from "@/components/project-explorer";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectExplorer />} />
      <Route path="/projects/:projectId" element={<ProjectExplorer />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
