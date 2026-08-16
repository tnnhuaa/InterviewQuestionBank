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
    <main className="grid min-h-screen place-items-center bg-canvas px-6 py-16">
      <section className="w-full max-w-3xl rounded-2xl border border-edge bg-canvas-subtle p-8 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Trạng thái hệ thống
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          PrepVI API
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-ink-secondary">
          Trang chẩn đoán này kiểm tra kết nối tương đối tới API mà không phụ thuộc
          vào hostname triển khai.
        </p>
        <div className="mt-10">
          <StatusCard {...apiStatus} />
        </div>
      </section>
    </main>
  );
}
