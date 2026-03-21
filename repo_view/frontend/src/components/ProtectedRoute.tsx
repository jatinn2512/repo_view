import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AppLoader } from "./AppLoader";

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <AppLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/?auth=login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
