type AuthMode = "login" | "signup";

interface PublicNavbarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenAuth: (mode: AuthMode) => void;
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.625rem] w-[1.625rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.625rem] w-[1.625rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3a9 9 0 1 0 9 9 7 7 0 1 1-9-9Z" />
    </svg>
  );
}

export function PublicNavbar({ theme, onToggleTheme, onOpenAuth }: PublicNavbarProps) {
  return (
    <header className="fixed left-0 right-0 top-3 z-40">
      <div className="page-container">
        <div className="grid h-[98px] grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-full border border-slate-200/70 bg-white/55 px-4 shadow-[0_10px_30px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:px-6">
        <div className="justify-self-start">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/75 px-5 py-2.5 text-[1.125rem] font-semibold text-slate-700 transition hover:bg-white"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>

        <div className="justify-self-center">
          <p className="font-display text-[1.95rem] font-bold tracking-tight text-[var(--ink)] sm:text-[2.35rem]">
            RepoView
          </p>
        </div>

        <div className="justify-self-end">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onOpenAuth("signup")}
              className="secondary-button rounded-full px-6 py-[0.7rem] text-[1.125rem]"
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth("login")}
              className="primary-button rounded-full px-6 py-[0.7rem] text-[1.125rem]"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
}
