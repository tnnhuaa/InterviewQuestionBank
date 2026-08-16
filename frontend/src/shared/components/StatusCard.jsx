const statusStyles = {
  checking: "bg-notice",
  online: "bg-ok",
  offline: "bg-danger",
};

const statusLabels = {
  checking: "Checking API",
  online: "API online",
  offline: "API offline",
};

export function StatusCard({ state, message }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-edge bg-panel p-5">
      <span
        aria-hidden="true"
        className={`mt-1.5 size-3 shrink-0 rounded-full ${statusStyles[state]}`}
      />
      <div>
        <p className="font-medium text-ink">{statusLabels[state]}</p>
        <p
          className="mt-1 text-sm text-ink-muted"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </div>
    </div>
  );
}
