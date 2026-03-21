import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AppShell } from "../layouts/AppShell";
import { Account } from "../pages/Account";
import { History } from "../pages/History";
import { Home } from "../pages/Home";
import { Settings } from "../pages/Settings";
import { ViewRepo } from "../pages/ViewRepo";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Navigate to="/?auth=login" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/repos" element={<ViewRepo />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
