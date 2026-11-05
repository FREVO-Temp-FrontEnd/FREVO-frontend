import { Navigate, useParams } from "react-router";

export function NavigateToOngoingProgress() {
  const { projectId } = useParams();
  return <Navigate to={`/business/ongoing/${projectId}/progress`} replace />;
}
