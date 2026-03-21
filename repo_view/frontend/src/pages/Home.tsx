import { useEffect, useState } from "react";
import {
  Navigate,
  type Location,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { AuthModal, type AuthMode } from "../components/AuthModal";
import { DemoRepoCard } from "../components/DemoRepoCard";
import { PublicNavbar } from "../components/PublicNavbar";
import { SiteFooter } from "../components/SiteFooter";
import { useAuth } from "../contexts/AuthContext";

const capabilityCards = [
  {
    title: "Repository mapping",
    detail: "Understand top-level structure and where major concerns live.",
  },
  {
    title: "Onboarding quality",
    detail: "See setup friction and missing guidance for new contributors.",
  },
  {
    title: "Risk visibility",
    detail: "Spot weak documentation, testing gaps, and maintainability risk.",
  },
  {
    title: "Team handoff",
    detail: "Share concise findings for engineering, product, and design teams.",
  },
];

const steps = [
  {
    id: "01",
    title: "Select repository",
    detail: "Paste owner/repository or a full GitHub URL.",
  },
  {
    id: "02",
    title: "Set review objective",
    detail: "Define architecture, onboarding, risk, or release focus.",
  },
  {
    id: "03",
    title: "Read actionable summary",
    detail: "Review clean findings with suggested next steps.",
  },
];

const sampleTargets = [
  "facebook/react",
  "vercel/next.js",
  "tailwindlabs/tailwindcss",
  "openai/openai-python",
  "fastapi/fastapi",
  "microsoft/TypeScript",
];

const faqItems = [
  {
    q: "Does this support private repositories?",
    a: "This current build is focused on public repositories for stable demo behavior.",
  },
  {
    q: "Will this push changes to my repository?",
    a: "No. The workflow is analysis-only and does not create commits or pull requests.",
  },
  {
    q: "Can I define my own review focus?",
    a: "Yes. You can set architecture, onboarding, risk, release, or custom objectives.",
  },
  {
    q: "Is live GitHub API integration active?",
    a: "The UI is production-styled and preview-safe while backend integration continues.",
  },
];

interface RedirectState {
  from?: Location;
}

function GitHubWatermark() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-48 w-48 text-slate-700/20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.95-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.43 7.43 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function Home() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = window.localStorage.getItem("repo-view-theme");
    return stored === "dark" ? "dark" : "light";
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [destination] = useState(() => {
    const state = location.state as RedirectState | null;
    if (!state?.from?.pathname || state.from.pathname === "/") {
      return "/repos";
    }
    return state.from.pathname;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("repo-view-theme", theme);
  }, [theme]);

  useEffect(() => {
    const requestedAuth = searchParams.get("auth");
    if (requestedAuth === "login" || requestedAuth === "signup") {
      setAuthMode(requestedAuth);
      setModalOpen(true);
    }
  }, [searchParams]);

  if (isAuthenticated) {
    return <Navigate to="/repos" replace />;
  }

  return (
    <div>
      <PublicNavbar
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "light" ? "dark" : "light"))
        }
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setModalOpen(true);
          setSearchParams({ auth: mode }, { replace: true });
        }}
      />

      {modalOpen ? (
        <AuthModal
          mode={authMode}
          onModeChange={(mode) => {
            setAuthMode(mode);
            setSearchParams({ auth: mode }, { replace: true });
          }}
          onClose={() => {
            setModalOpen(false);
            setSearchParams({}, { replace: true });
          }}
          onSuccess={() => {
            setModalOpen(false);
            setSearchParams({}, { replace: true });
            navigate(destination, { replace: true });
          }}
        />
      ) : null}

      <section className="border-b border-[var(--line)] bg-[#f3f5f9] pt-[138px]">
        <div className="page-container grid gap-10 py-12 lg:grid-cols-[1fr_520px] lg:items-center lg:py-16">
          <div className="relative">
            <div className="pointer-events-none absolute -right-10 top-1 hidden lg:block">
              <GitHubWatermark />
            </div>

            <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700">
              GitHub Repository Review Workspace
            </span>

            <h1 className="mt-6 max-w-[680px] text-[2.6rem] font-bold leading-[1.06] tracking-tight text-[var(--ink)] sm:text-[3.1rem] lg:text-[4rem]">
              Review Public Repositories
              <br />
              <span className="text-[var(--accent)]">with clarity and speed</span>
            </h1>

            <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
              Analyze repository structure, onboarding paths, and maintenance
              risk from one clean interface built for focused decisions.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                className="primary-button px-7 py-3.5 text-base"
                onClick={() => {
                  setAuthMode("login");
                  setModalOpen(true);
                  setSearchParams({ auth: "login" }, { replace: true });
                }}
              >
                Login to Continue
              </button>
              <button
                type="button"
                className="secondary-button px-7 py-3.5 text-base"
                onClick={() => {
                  setAuthMode("signup");
                  setModalOpen(true);
                  setSearchParams({ auth: "signup" }, { replace: true });
                }}
              >
                Sign up
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-500 sm:text-base">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Public repositories
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Structured summaries
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Session history
              </span>
            </div>
          </div>

          <DemoRepoCard />
        </div>
      </section>

      <section id="capabilities" className="border-b border-[var(--line)] bg-[#f3f5f9] py-16 md:py-20">
        <div className="page-container">
          <p className="eyebrow text-center">Capabilities</p>
          <h2 className="section-title mt-4 text-center">
            Clean, trustworthy repo reviews
            <br />
            for fast team alignment.
          </h2>
          <p className="section-copy mx-auto mt-5 max-w-[900px] text-center">
            Improve handoffs and reduce onboarding confusion by reviewing one
            repository with one clear objective at a time.
          </p>

          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {capabilityCards.map((item) => (
              <article key={item.title} className="panel-section p-7">
                <div className="h-8 w-8 rounded-lg bg-blue-100" />
                <h3 className="mt-4 font-display text-3xl font-bold text-[var(--ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-[var(--muted)]">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-b border-[var(--line)] bg-white py-16 md:py-20">
        <div className="page-container">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {steps.map((item) => (
              <article key={item.id} className="panel-section p-8">
                <p className="text-xl font-bold text-[var(--accent)]">{item.id}</p>
                <h3 className="mt-4 font-display text-4xl font-bold text-[var(--ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-[var(--muted)]">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="examples" className="border-b border-[var(--line)] bg-[#f3f5f9] py-16 md:py-20">
        <div className="page-container">
          <h2 className="section-title text-center">Popular Targets</h2>
          <p className="section-copy mt-4 text-center">
            Start with familiar repositories and define one review objective.
          </p>

          <div className="mx-auto mt-10 flex max-w-[1050px] flex-wrap justify-center gap-4">
            {sampleTargets.map((item) => (
              <span
                key={item}
                className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-xl font-semibold text-[var(--ink)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f3f5f9] py-16 md:py-20">
        <div className="page-container max-w-[980px]">
          <h2 className="section-title text-center">FAQ</h2>

          <div className="mt-10 space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <article key={item.q} className="panel-section overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left sm:px-7 sm:py-6"
                  >
                    <span className="text-xl font-semibold text-[var(--ink)] sm:text-3xl">
                      {item.q}
                    </span>
                    <span className="text-3xl font-light text-slate-400">
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-slate-100 px-6 py-5 text-base leading-relaxed text-[var(--muted)] sm:px-7 sm:text-lg">
                      {item.a}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
