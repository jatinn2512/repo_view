import { useAuth } from "../contexts/AuthContext";

const stats = [
  { label: "Reviews this week", value: "12" },
  { label: "Completed sessions", value: "38" },
  { label: "Saved objectives", value: "7" },
];

export function Account() {
  const { user } = useAuth();
  const initials = (user?.name ?? "Demo User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="page-container py-10">
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <article className="surface-panel p-7">
          <p className="eyebrow">Account</p>
          <h1 className="page-title mt-3">Profile and usage summary</h1>
          <p className="mt-3 text-lg text-slate-500">
            Quick snapshot of your identity and current workspace activity.
          </p>

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a1d3a] text-xl font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--ink)]">
                  {user?.name ?? "Demo User"}
                </p>
                <p className="mt-1 text-lg text-slate-500">
                  {user?.email ?? "demo@repoview.dev"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Role</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {user?.role ?? "Administrator"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Plan</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">Preview</p>
              </div>
            </div>
          </div>
        </article>

        <article className="surface-panel p-6">
          <p className="eyebrow">Weekly Activity</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-[var(--ink)]">
            Workspace metrics
          </h2>

          <div className="mt-5 space-y-3">
            {stats.map((item) => (
              <div key={item.label} className="panel-section p-4">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-1 font-display text-3xl font-bold text-[var(--ink)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
