import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#f3f5f9] px-4 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1440px] lg:grid lg:grid-cols-[280px_1fr] lg:gap-6">
        <div className="lg:sticky lg:top-4 lg:self-start">
          <Sidebar />
        </div>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
