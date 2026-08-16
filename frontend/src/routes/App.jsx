import { Route, Routes } from "react-router-dom";
import { StatusPage } from "../features/status/StatusPage.jsx";

function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <a
          className="mt-6 inline-block text-cyan-300 hover:text-cyan-200"
          href="/"
        >
          Return to status
        </a>
      </div>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<StatusPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
