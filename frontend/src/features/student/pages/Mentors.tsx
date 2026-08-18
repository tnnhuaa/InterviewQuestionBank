import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useApp } from "@/app/AppContext";
import { mentorsApi, questionsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import PublicNavbar from "@/shared/components/PublicNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import MentorCard from "@/shared/components/MentorCard";

export default function Mentors() {
  const { role } = useApp();
  const [topic, setTopic] = useState("");
  const taxonomy = useQuery({ queryKey: ["taxonomy"], queryFn: questionsApi.taxonomy });
  const mentors = useQuery({ queryKey: ["mentors", topic], queryFn: () => mentorsApi.list({ topic, pageSize: 50 }) });
  return <div className="min-h-screen bg-canvas">{role === "public" ? <PublicNavbar /> : <AuthNavbar />}<main className="mx-auto max-w-[1000px] px-6 py-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-[22px] font-semibold text-ink">Tìm Mentor</h1><p className="mt-1 text-sm text-ink-secondary">Chỉ hồ sơ đã được Admin duyệt mới xuất hiện.</p></div><label className="text-xs font-semibold text-ink-secondary">Chuyên môn<select value={topic} onChange={(event) => setTopic(event.target.value)} className="mt-1 block min-w-56 rounded-lg border border-edge bg-panel px-3 py-2 text-sm font-normal"><option value="">Tất cả</option>{taxonomy.data?.topics.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label></div>{mentors.error && <div className="mt-5"><ErrorPanel error={mentors.error} onRetry={() => mentors.refetch()} /></div>}<div className="mt-6 space-y-4">{mentors.isLoading && <p className="text-sm text-ink-muted">Đang tải mentor…</p>}{mentors.data?.items.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)}{mentors.data?.items.length === 0 && <div className="rounded-xl border border-dashed border-edge p-10 text-center text-sm text-ink-muted">Chưa có mentor đã duyệt phù hợp bộ lọc.</div>}</div></main></div>;
}
