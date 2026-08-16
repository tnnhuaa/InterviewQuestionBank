export default function RouteHydrateFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-6 text-center">
      <div>
        <div className="mx-auto size-8 animate-pulse rounded-lg bg-primary" aria-hidden />
        <p className="mt-3 text-sm text-ink-muted">Đang tải PrepVI…</p>
      </div>
    </main>
  );
}
