import { MagnifyingGlass } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useApp } from "@/app/AppContext";
import AuthNavbar from "@/shared/components/AuthNavbar";
import PublicNavbar from "@/shared/components/PublicNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import QuestionRow from "@/shared/components/QuestionRow";
import { questionsApi } from "@/shared/api/resources";

export default function Questions() {
  const { role } = useApp();
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const taxonomy = useQuery({ queryKey: ["taxonomy"], queryFn: questionsApi.taxonomy });
  const questions = useQuery({ queryKey: ["questions", search, topic, difficulty], queryFn: () => questionsApi.list({ search, topic, difficulty, pageSize: 50 }) });
  return <div className="min-h-screen bg-canvas">{role === "public" ? <PublicNavbar /> : <AuthNavbar />}
    <main className="mx-auto max-w-[1100px] px-6 py-8">
      <h1 className="text-[22px] font-semibold text-ink">Question Bank</h1><p className="mt-1 text-sm text-ink-secondary">Danh sách chỉ gồm câu hỏi đã công bố và có taxonomy/provenance hợp lệ.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_200px_160px]">
        <label className="relative"><MagnifyingGlass aria-hidden size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" /><span className="sr-only">Tìm câu hỏi</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm câu hỏi hoặc kỹ năng…" className="w-full rounded-lg border border-edge bg-panel py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary" /></label>
        <select aria-label="Chủ đề" value={topic} onChange={(event) => setTopic(event.target.value)} className="rounded-lg border border-edge bg-panel px-3 py-2.5 text-sm"><option value="">Mọi chủ đề</option>{taxonomy.data?.topics.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select>
        <select aria-label="Độ khó" value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="rounded-lg border border-edge bg-panel px-3 py-2.5 text-sm"><option value="">Mọi độ khó</option><option value="EASY">Dễ</option><option value="MEDIUM">Trung bình</option><option value="HARD">Khó</option></select>
      </div>
      <section className="mt-5 overflow-hidden rounded-xl border border-edge bg-panel divide-y divide-edge">
        {questions.isLoading && <p className="p-8 text-center text-sm text-ink-muted">Đang tải câu hỏi…</p>}
        {questions.error && <div className="p-4"><ErrorPanel error={questions.error} onRetry={() => questions.refetch()} /></div>}
        {questions.data?.items.map((question) => <QuestionRow key={question.id} question={question} showStatus={role !== "public"} />)}
        {questions.data?.items.length === 0 && <div className="p-12 text-center"><p className="text-sm font-medium text-ink">Không tìm thấy câu hỏi</p><p className="mt-1 text-xs text-ink-muted">Thử xóa bộ lọc hoặc dùng từ khóa khác.</p></div>}
      </section>
    </main>
  </div>;
}
