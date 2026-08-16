const statusStyles = {
  checking: "bg-amber-300",
  online: "bg-emerald-300",
  offline: "bg-rose-300",
};

const statusLabels = {
  checking: "Checking API",
  online: "API online",
  offline: "API offline",
};

export function StatusCard({ state, message }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <span
        aria-hidden="true"
        className={`mt-1.5 size-3 shrink-0 rounded-full ${statusStyles[state]}`}
      />
      <div>
        <p className="font-medium text-white">{statusLabels[state]}</p>
        <p
          className="mt-1 text-sm text-slate-400"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </div>
    </div>
  );
}
