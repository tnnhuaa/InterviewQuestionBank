import { BookmarkSimple } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useApp } from "@/app/AppContext";
import { questionsApi, type PracticeStatus } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import PublicNavbar from "@/shared/components/PublicNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

const statuses: Array<{ value: PracticeStatus; label: string }> = [{ value: "NOT_STARTED", label: "Chưa luyện" }, { value: "PRACTICING", label: "Đang luyện" }, { value: "COMPLETED", label: "Đã hoàn thành" }, { value: "REVISIT", label: "Cần xem lại" }];
export default function QuestionDetail() {
  const { questionId = "" } = useParams();
  const { role } = useApp();
  const queryClient = useQueryClient();
  const question = useQuery({ queryKey: ["question", questionId], queryFn: () => questionsApi.get(questionId), enabled: Boolean(questionId) });
  const progress = useMutation({ mutationFn: (input: { bookmarked: boolean; status: PracticeStatus }) => questionsApi.progress(question.data!.id, input), onSuccess: (_data, input) => queryClient.setQueryData(["question", questionId], { ...question.data!, ...input, practiceStatus: input.status }) });
  if (question.isLoading) return <div className="grid min-h-screen place-items-center bg-canvas text-sm text-ink-muted">Đang tải câu hỏi…</div>;
  return <div className="min-h-screen bg-canvas">{role === "public" ? <PublicNavbar /> : <AuthNavbar />}<main className="mx-auto max-w-[900px] px-6 py-8">{question.error || !question.data ? <ErrorPanel error={question.error} onRetry={() => question.refetch()} /> : <>
    <Link to="/questions" className="text-xs text-primary hover:underline">← Question Bank</Link>
    <div className="mt-6 flex flex-wrap gap-2">{question.data.topics.map((topic) => <span key={topic} className="rounded-full border border-edge bg-panel px-2.5 py-1 text-xs text-ink-secondary">{topic}</span>)}</div>
    <h1 className="mt-4 text-2xl font-semibold leading-9 text-ink">{question.data.title}</h1>
    {role !== "public" && <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-edge bg-panel p-3">{statuses.map((item) => <button key={item.value} disabled={progress.isPending} onClick={() => progress.mutate({ bookmarked: question.data!.bookmarked, status: item.value })} className={question.data!.practiceStatus === item.value ? "rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-on-primary" : "rounded-md px-3 py-1.5 text-xs text-ink-secondary hover:bg-canvas-subtle"}>{item.label}</button>)}<button aria-label={question.data.bookmarked ? "Bỏ đánh dấu" : "Đánh dấu"} onClick={() => progress.mutate({ bookmarked: !question.data!.bookmarked, status: question.data!.practiceStatus })} className="ml-auto rounded-md border border-edge p-2 text-primary"><BookmarkSimple aria-hidden size={17} weight={question.data.bookmarked ? "fill" : "regular"} /></button></div>}
    {progress.error && <div className="mt-4"><ErrorPanel error={progress.error} /></div>}
    <article className="mt-6 rounded-xl border border-edge bg-panel p-6"><p className="whitespace-pre-wrap text-sm leading-7 text-ink-secondary">{question.data.content}</p><h2 className="mt-8 text-sm font-semibold text-ink">Tiêu chí câu trả lời</h2><ul className="mt-3 space-y-2">{question.data.answerCriteria.map((criterion) => <li key={criterion} className="flex gap-2 text-sm text-ink-secondary"><span className="text-ok">✓</span>{criterion}</li>)}</ul></article>
    <div className="mt-5 rounded-lg bg-canvas-subtle p-4 text-xs text-ink-muted">Nguồn: {question.data.source?.name || "Không công khai"}{question.data.source?.url && <> · <a className="text-primary hover:underline" href={question.data.source.url} rel="noreferrer" target="_blank">Mở tài liệu nguồn</a></>}</div>
  </>}</main></div>;
}
