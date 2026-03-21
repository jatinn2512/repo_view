interface AppLoaderProps {
  label?: string;
}

export function AppLoader({
  label = "Preparing your dashboard workspace...",
}: AppLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="surface-panel w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-50">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-accent-100 border-t-accent-500" />
        </div>
        <p className="eyebrow mb-3">Repo View</p>
        <h1 className="font-display text-2xl font-bold text-slate-950">
          Loading application state
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">{label}</p>
      </div>
    </div>
  );
}

