export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-white py-12">
      <div className="page-container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1d3a] font-bold text-white">
                RV
              </div>
              <p className="font-display text-3xl font-bold text-[var(--ink)]">RepoView</p>
            </div>
            <p className="mt-4 max-w-[360px] text-lg leading-relaxed text-[var(--muted)]">
              Clear GitHub repository analysis for onboarding, architecture,
              and maintainability decisions.
            </p>
          </div>

          <div>
            <p className="text-lg font-bold text-[var(--ink)]">Workspace</p>
            <div className="mt-4 space-y-2 text-base text-slate-500">
              <p>Home</p>
              <p>View Repo</p>
              <p>History</p>
              <p>Settings</p>
            </div>
          </div>

          <div>
            <p className="text-lg font-bold text-[var(--ink)]">Resources</p>
            <div className="mt-4 space-y-2 text-base text-slate-500">
              <p>Review Guide</p>
              <p>Team Handoff</p>
              <p>Support</p>
            </div>
          </div>

          <div>
            <p className="text-lg font-bold text-[var(--ink)]">Status</p>
            <div className="mt-4 space-y-2 text-base text-slate-500">
              <p>Preview mode</p>
              <p>Public repositories</p>
              <p>API integration in progress</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 text-base text-slate-400">
          © 2026 RepoView. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
