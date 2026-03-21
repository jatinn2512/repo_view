import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type IconComponent = ComponentType<{ className?: string }>;

interface NavItem {
  to: string;
  label: string;
  icon: IconComponent;
  end?: boolean;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
    </svg>
  );
}

function RepoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H11l2 2h4.5A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
    </svg>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 2.64-6.36" />
      <path d="M3 4.5v5h5" />
      <path d="M12 7.5v5l3 1.5" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 0 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 0 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 0 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a2 2 0 0 1 0 4h-.2a1 1 0 0 0-.9.6Z" />
    </svg>
  );
}

function AccountIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

// ─── Nav link ─────────────────────────────────────────────────────────────────

function SidebarLink({ to, label, icon: Icon, end }: NavItem) {
  return (
    <NavLink to={to} end={end} className="block">
      {({ isActive }) => (
        <span
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
            isActive
              ? "bg-ink text-white shadow-glow"
              : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-soft"
          }`}
        >
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            <Icon className="h-4 w-4" />
          </span>
          {label}
        </span>
      )}
    </NavLink>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const primaryNav: NavItem[] = [
  { to: "/repos",   label: "Home",      icon: HomeIcon,     end: true },
  { to: "/history", label: "History",   icon: HistoryIcon },
  { to: "/settings",label: "Settings",  icon: SettingsIcon },
  { to: "/account", label: "Account",   icon: AccountIcon },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  // Derive initials from the user's display name.
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "RV";

  return (
    <aside className="surface-panel flex min-h-full flex-col gap-5 p-4 lg:sticky lg:top-5 lg:p-5">

      {/* Wordmark */}
      <div className="flex items-center gap-3 px-1 pt-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-ink text-sm font-black text-white">
          RV
        </div>
        <div>
          <p className="font-display text-base font-bold leading-none text-ink">Repo View</p>
          <p className="mt-0.5 text-xs text-slate-400">Public repo workspace</p>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        <p className="mb-2 px-3 text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>
        {primaryNav.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </nav>

      {/* Profile section */}
      <div className="border-t border-slate-100 pt-4 space-y-1">
        <p className="mb-2 px-3 text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-slate-400">
          Account
        </p>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-150 hover:bg-rose-50 hover:text-rose-700"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <LogoutIcon className="h-4 w-4" />
          </span>
          Sign out
        </button>
      </div>

      {/* User pill */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {user?.name ?? "Demo User"}
            </p>
            <p className="truncate text-xs text-slate-400">
              {user?.email ?? "demo@repoview.dev"}
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}
