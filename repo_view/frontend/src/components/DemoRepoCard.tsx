import { useEffect, useMemo, useState } from "react";

interface DemoState {
  query: string;
  headers: string[];
  rows: string[][];
  snapshot: string[];
}

const states: DemoState[] = [
  {
    query: "Review the onboarding quality of facebook/react",
    headers: ["Area", "Status"],
    rows: [
      ["Repo structure", "Clear"],
      ["Readme setup", "Strong"],
      ["Contributing guide", "Partial"],
      ["Issue templates", "Missing"],
    ],
    snapshot: [
      'target = "facebook/react"',
      'focus = "onboarding quality"',
      'risk = "medium"',
      'priority = "docs consistency"',
    ],
  },
  {
    query: "Find architecture hotspots in vercel/next.js",
    headers: ["Area", "Status"],
    rows: [
      ["Module boundaries", "Stable"],
      ["Build pipeline", "Complex"],
      ["Test mapping", "Partial"],
      ["Upgrade notes", "Strong"],
    ],
    snapshot: [
      'target = "vercel/next.js"',
      'focus = "architecture hotspots"',
      'risk = "medium-high"',
      'priority = "test coverage map"',
    ],
  },
  {
    query: "Summarize plugin extension flow in tailwindlabs/tailwindcss",
    headers: ["Area", "Status"],
    rows: [
      ["Config docs", "Clear"],
      ["Plugin API", "Strong"],
      ["Migration path", "Needs examples"],
      ["Contributor ramp-up", "Moderate"],
    ],
    snapshot: [
      'target = "tailwindlabs/tailwindcss"',
      'focus = "plugin extension flow"',
      'risk = "low"',
      'priority = "migration examples"',
    ],
  },
];

export function DemoRepoCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [typed, setTyped] = useState("");

  const active = useMemo(() => states[activeIndex], [activeIndex]);

  useEffect(() => {
    setTyped("");
    let index = 0;
    const typingInterval = window.setInterval(() => {
      index += 1;
      setTyped(active.query.slice(0, index));
      if (index >= active.query.length) {
        window.clearInterval(typingInterval);
      }
    }, 18);

    const rotateTimer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % states.length);
    }, 3400);

    return () => {
      window.clearInterval(typingInterval);
      window.clearTimeout(rotateTimer);
    };
  }, [active]);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_22px_56px_rgba(16,24,40,0.12)] sm:p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="text-sm text-slate-400">Connected · github.com</span>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="grow text-sm text-slate-600 sm:text-base">{typed || active.query}</p>
        <button
          type="button"
          className="rounded-lg bg-[#1a1d3a] px-3 py-1.5 text-sm font-semibold text-white"
        >
          Analyze
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        {["Onboarding", "Architecture", "Risk Scan"].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-500"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-slate-100 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Summary Snapshot
        </p>
        <div className="mt-2 space-y-1 font-mono text-sm text-blue-600">
          {active.snapshot.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {active.headers.map((header) => (
                <th key={header} className="px-4 py-2.5 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {active.rows.map((row) => (
              <tr key={row.join("-")} className="border-t border-slate-100">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-2.5 text-slate-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
