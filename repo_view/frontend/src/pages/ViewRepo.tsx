import { useState, type FormEvent } from "react";

interface ReviewResult {
  repo: string;
  objective: string;
  checklist: Array<{ area: string; status: string }>;
}

function normalizeRepo(value: string): string {
  const cleaned = value.trim().replace(/^https?:\/\/github\.com\//i, "");
  const parts = cleaned.split("/").filter(Boolean);
  if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  return "openai/openai-python";
}

const presets = [
  "README quality and setup friction",
  "Architecture boundaries and module ownership",
  "Testing depth and contributor readiness",
  "Release and migration risk assessment",
];

const samples = [
  "openai/openai-python",
  "facebook/react",
  "vercel/next.js",
  "tailwindlabs/tailwindcss",
];

export function ViewRepo() {
  const [repoInput, setRepoInput] = useState("openai/openai-python");
  const [objective, setObjective] = useState(
    "README quality and setup friction"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = normalizeRepo(repoInput);
    setLoading(true);

    window.setTimeout(() => {
      setResult({
        repo: normalized,
        objective,
        checklist: [
          { area: "Repository structure", status: "Clear" },
          { area: "Onboarding path", status: "Needs detail" },
          { area: "Testing guidance", status: "Partial" },
          { area: "Contribution flow", status: "Moderate" },
          { area: "Documentation consistency", status: "Action required" },
        ],
      });
      setLoading(false);
    }, 420);
  };

  return (
    <div className="page-container py-10">
      <section className="surface-panel p-7">
        <p className="eyebrow">Repository Analyzer</p>
        <h1 className="page-title mt-3">Review any public GitHub repository</h1>
        <p className="mt-3 max-w-[700px] text-lg leading-relaxed text-slate-500">
          Define one clear objective and generate a structured review summary
          for faster engineering and product decisions.
        </p>

        <form className="mt-7 space-y-4" onSubmit={submit}>
          <div>
            <label className="field-label">Repository path</label>
            <input
              className="text-input"
              value={repoInput}
              onChange={(event) => setRepoInput(event.target.value)}
              placeholder="owner/repository or full GitHub URL"
            />
          </div>

          <div>
            <label className="field-label">Review objective</label>
            <textarea
              className="text-input min-h-[110px] resize-none"
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Quick objective presets
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="secondary-button px-3 py-2 text-xs"
                  onClick={() => setObjective(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Sample repositories
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {samples.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="secondary-button px-3 py-2 text-xs"
                  onClick={() => setRepoInput(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="primary-button px-7 py-3 text-base" disabled={loading}>
            {loading ? "Analyzing..." : "Run Review"}
          </button>
        </form>
      </section>

      <section className="mt-6 surface-panel overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-500">
          {result ? `github.com/${result.repo}` : "Waiting for repository input"}
        </div>

        <div className="p-6">
          {!result ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
              Submit a repository and objective to generate the review snapshot.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Active target
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold text-[var(--ink)]">
                    {result.repo}
                  </p>
                  <p className="mt-2 max-w-[760px] text-sm leading-relaxed text-slate-500">
                    Objective: {result.objective}
                  </p>
                </div>
                <span className="status-chip">Preview summary</span>
              </div>

              <div className="mt-5 rounded-xl bg-slate-100 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Parsed review request
                </p>
                <div className="mt-2 space-y-1 font-mono text-sm text-blue-600">
                  <p>repo = "{result.repo}"</p>
                  <p>objective = "{result.objective.slice(0, 92)}{result.objective.length > 92 ? "..." : ""}"</p>
                  <p>mode = "preview"</p>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Review area</th>
                      <th className="px-4 py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.checklist.map((row) => (
                      <tr key={row.area} className="border-t border-slate-100">
                        <td className="px-4 py-2.5 text-slate-700">{row.area}</td>
                        <td className="px-4 py-2.5 text-slate-700">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
