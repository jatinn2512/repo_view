import { useState } from "react";

interface SettingsState {
  persistSession: boolean;
  compactMode: boolean;
  includeRiskSummary: boolean;
  defaultBranch: string;
  reviewDepth: "light" | "balanced" | "deep";
}

const defaults: SettingsState = {
  persistSession: true,
  compactMode: false,
  includeRiskSummary: true,
  defaultBranch: "main",
  reviewDepth: "balanced",
};

export function Settings() {
  const [state, setState] = useState<SettingsState>(defaults);
  const [message, setMessage] = useState("");

  return (
    <div className="page-container py-10">
      <section className="space-y-6">
        <article className="surface-panel p-7">
          <p className="eyebrow">Settings</p>
          <h1 className="page-title mt-3">Workspace configuration</h1>
          <p className="mt-3 text-lg text-slate-500">
            Configure how repository reviews are prepared and displayed.
          </p>
        </article>

        <article className="surface-panel p-7">
          <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
            Review preferences
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Default branch</label>
              <input
                className="text-input"
                value={state.defaultBranch}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    defaultBranch: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="field-label">Review depth</label>
              <select
                className="text-input"
                value={state.reviewDepth}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    reviewDepth: event.target.value as SettingsState["reviewDepth"],
                  }))
                }
              >
                <option value="light">Light</option>
                <option value="balanced">Balanced</option>
                <option value="deep">Deep</option>
              </select>
            </div>
          </div>
        </article>

        <article className="surface-panel p-7">
          <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
            Session behavior
          </h2>
          <div className="mt-5 space-y-3">
            {[
              {
                key: "persistSession" as const,
                title: "Persist login state",
                detail: "Keep the session active between browser refreshes.",
              },
              {
                key: "compactMode" as const,
                title: "Compact UI mode",
                detail: "Use tighter card spacing to fit more review content.",
              },
              {
                key: "includeRiskSummary" as const,
                title: "Include risk summary by default",
                detail: "Add risk-oriented notes in generated review snapshots.",
              },
            ].map((item) => (
              <label key={item.key} className="panel-section flex items-start gap-4 p-4">
                <input
                  type="checkbox"
                  checked={state[item.key]}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      [item.key]: event.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <p className="text-base font-semibold text-[var(--ink)]">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="primary-button"
              onClick={() => setMessage("Settings saved for this browser session.")}
            >
              Save settings
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setState(defaults);
                setMessage("Defaults restored.");
              }}
            >
              Restore defaults
            </button>
          </div>
          {message ? <p className="mt-4 text-sm text-slate-500">{message}</p> : null}
        </article>

        <article className="surface-panel p-7">
          <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
            Local data controls
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            This action clears browser-local review history and preferences. It
            does not delete any remote repository data.
          </p>
          <button type="button" className="mt-4 secondary-button border-rose-200 text-rose-600">
            Clear local workspace data
          </button>
        </article>
      </section>
    </div>
  );
}
