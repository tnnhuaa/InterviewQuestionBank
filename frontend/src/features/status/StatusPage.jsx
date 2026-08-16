import { useEffect, useState } from "react";
import { getHealth } from "../../shared/api/health.js";
import { StatusCard } from "../../shared/components/StatusCard.jsx";

const initialState = { state: "checking", message: "Contacting the API…" };

export function StatusPage() {
  const [apiStatus, setApiStatus] = useState(initialState);

  useEffect(() => {
    const controller = new AbortController();

    getHealth({ signal: controller.signal })
      .then((health) => {
        setApiStatus({
          state: health.status === "ok" ? "online" : "offline",
          message: health.service,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setApiStatus({
            state: "offline",
            message: "The API is currently unreachable.",
          });
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-6 py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.14),transparent_35%)]" />
      <section className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Foundation ready
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Interview Question Bank
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          A focused place to build interview confidence, one thoughtful question
          at a time.
        </p>
        <div className="mt-10">
          <StatusCard {...apiStatus} />
        </div>
      </section>
    </main>
  );
}
