import { useState } from "react";

interface HistoryItem {
  id: string;
  repo: string;
  objective: string;
  status: string;
  time: string;
  findings: string[];
}

const items: HistoryItem[] = [
  {
    id: "1",
    repo: "openai/openai-python",
    objective: "README quality and setup friction",
    status: "Completed",
    time: "Today, 10:42 AM",
    findings: [
      "Setup path is clear but dependency versions need clearer pinning notes.",
      "Examples are strong for basic flow but sparse for advanced usage.",
      "Contributor checklist can be tightened for first-time PRs.",
    ],
  },
  {
    id: "2",
    repo: "vercel/next.js",
    objective: "Release migration notes and breaking-change exposure",
    status: "In progress",
    time: "Today, 8:15 AM",
    findings: [
      "Migration guidance is robust but scattered across multiple docs.",
      "Release notes are strong but action mapping can be more explicit.",
      "Feature deprecations should have one consolidated checklist.",
    ],
  },
  {
    id: "3",
    repo: "facebook/react",
    objective: "Architecture overview for onboarding engineers",
    status: "Completed",
    time: "Yesterday, 5:28 PM",
    findings: [
      "Core package boundaries are clear at high level.",
      "Contributor onramp requires additional context for build internals.",
      "Testing layout is stable but mental model documentation can improve.",
    ],
  },
];

export function History() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="page-container py-10">
      <section className="surface-panel p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Review History</p>
            <h1 className="page-title mt-3">Repository review sessions</h1>
            <p className="mt-3 text-lg text-slate-500">
              Expand a session to inspect objective and findings summary.
            </p>
          </div>
          <span className="status-chip">{items.length} records</span>
        </div>

        <div className="mt-8 space-y-3">
          {items.map((item) => {
            const expanded = expandedId === item.id;
            return (
              <article key={item.id} className="panel-section overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : item.id)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                >
                  <div>
                    <p className="text-xl font-semibold text-[var(--ink)]">{item.repo}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.objective}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="status-chip">{item.status}</span>
                    <span className="text-xl text-slate-400">{expanded ? "−" : "+"}</span>
                  </div>
                </button>

                {expanded ? (
                  <div className="border-t border-slate-100 px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Findings
                    </p>
                    <div className="mt-2 space-y-2">
                      {item.findings.map((finding) => (
                        <p key={finding} className="text-sm leading-relaxed text-slate-600">
                          {finding}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
