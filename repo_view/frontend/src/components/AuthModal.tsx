import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";

export type AuthMode = "login" | "signup";

interface AuthModalProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ mode, onModeChange, onClose, onSuccess }: AuthModalProps) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("demo@repoview.dev");
  const [password, setPassword] = useState("Password123!");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({ identifier, password });
      onSuccess();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to authenticate with the provided credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.22)] sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold text-[var(--ink)]">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          {mode === "login"
            ? "Use the demo credentials to enter the repository workspace."
            : "Sign up UI is available. Authentication currently uses the demo login endpoint."}
        </p>

        <div className="mt-4 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${
              mode === "login" ? "bg-white text-[var(--ink)] shadow-sm" : "text-slate-500"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => onModeChange("signup")}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${
              mode === "signup" ? "bg-white text-[var(--ink)] shadow-sm" : "text-slate-500"
            }`}
          >
            Sign up
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={submit}>
          {mode === "signup" ? (
            <div>
              <label className="field-label">Full name</label>
              <input
                className="text-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </div>
          ) : null}

          <div>
            <label className="field-label">Email or username</label>
            <input
              className="text-input"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="demo@repoview.dev"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="field-label">Password</label>
            <input
              className="text-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password123!"
              autoComplete="current-password"
              type="password"
              required
            />
          </div>

          {mode === "signup" ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Signup is in UI preview mode. Demo login credentials are still required.
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={submitting} className="primary-button w-full py-3">
            {submitting
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
              ? "Login"
              : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
