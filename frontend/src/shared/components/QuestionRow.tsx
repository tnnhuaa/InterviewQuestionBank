import { BookmarkSimple, CaretRight } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/app/AppContext";
import { questionsApi, type Question } from "@/shared/api/resources";

const difficulty = {
  EASY: { label: "Dễ", className: "text-ok" },
  MEDIUM: { label: "Trung bình", className: "text-notice-ink" },
  HARD: { label: "Khó", className: "text-danger" },
};

export default function QuestionRow({ question, showStatus = true }: { question: Question; showStatus?: boolean }) {
  const navigate = useNavigate();
  const { role } = useApp();
  const [bookmarked, setBookmarked] = useState(question.bookmarked);
  const mutation = useMutation({
    mutationFn: (next: boolean) => questionsApi.progress(question.id, { bookmarked: next, status: question.practiceStatus }),
    onMutate: (next) => { const previous = bookmarked; setBookmarked(next); return { previous }; },
    onError: (_error, _next, context) => setBookmarked(context?.previous ?? question.bookmarked),
  });
  const config = difficulty[question.difficulty];
  return <article className="group flex items-start gap-4 rounded-lg px-4 py-4 hover:bg-primary-soft/40">
    <button type="button" className="min-w-0 flex-1 text-left" onClick={() => navigate(`/questions/${question.slug || question.id}`)}>
      {question.source?.name && <p className="mb-1 text-[11px] text-ink-muted">Nguồn: {question.source.name}</p>}
      <h2 className="mb-2 text-sm font-medium leading-[22px] text-ink">{question.title}</h2>
      <div className="flex flex-wrap items-center gap-1.5">{question.topics.map((topic) => <span key={topic} className="rounded-full border border-edge bg-canvas-subtle px-2 py-0.5 text-[11px] text-ink-secondary">{topic}</span>)}<span className={`text-[11px] font-medium ${config.className}`}>· {config.label}</span>{showStatus && question.practiceStatus !== "NOT_STARTED" && <span className="rounded-full bg-ok-soft px-2 py-0.5 text-[11px] text-ok">{question.practiceStatus}</span>}</div>
    </button>
    <div className="flex shrink-0 items-center gap-2">
      {role !== "public" && <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate(!bookmarked)} aria-label={bookmarked ? "Bỏ đánh dấu" : "Đánh dấu"} className={bookmarked ? "rounded p-1.5 text-primary" : "rounded p-1.5 text-ink-muted"}><BookmarkSimple aria-hidden size={16} weight={bookmarked ? "fill" : "regular"} /></button>}
      <CaretRight aria-hidden size={16} className="text-ink-muted" />
    </div>
  </article>;
}
