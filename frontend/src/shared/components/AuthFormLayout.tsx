import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Brand } from "./navigation/Brand";

export default function AuthFormLayout({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas sm:flex-row">
      <aside className="flex min-h-[180px] flex-col justify-between bg-warm p-8 sm:min-h-screen sm:w-[42%] sm:p-12">
        <Brand to="/homepage" />
        <div className="my-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Practice with purpose.</p>
          <p className="max-w-sm text-xl font-semibold leading-relaxed text-ink">Chuẩn bị có cấu trúc, luyện tập đúng trọng tâm và nhận feedback có thể hành động.</p>
        </div>
        <Link to="/homepage" className="text-xs text-ink-muted hover:text-ink">Về trang chủ</Link>
      </aside>
      <main className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px]">
          <h1 className="text-[28px] font-semibold leading-9 text-ink">{title}</h1>
          <p className="mb-8 mt-2 text-sm text-ink-secondary">{description}</p>
          {children}
        </div>
      </main>
    </div>
  );
}
