import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "@/app/AppContext";
import { mentorsApi, questionsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import PublicNavbar from "@/shared/components/PublicNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import MentorCard from "@/shared/components/MentorCard";

function toISOFromLocal(local: string | undefined): string | undefined {
  if (!local) return undefined;
  try {
    return new Date(local).toISOString();
  } catch {
    return undefined;
  }
}

export default function Mentors() {
  const { role } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const topic = searchParams.get("topic") ?? "";
  const availableFromParam = searchParams.get("availableFrom") ?? "";
  const availableToParam = searchParams.get("availableTo") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") || 1));

  const availableFrom = useMemo(() => toISOFromLocal(availableFromParam), [availableFromParam]);
  const availableTo = useMemo(() => toISOFromLocal(availableToParam), [availableToParam]);

  const taxonomy = useQuery({
    queryKey: ["taxonomy"],
    queryFn: questionsApi.taxonomy,
  });

  const mentors = useQuery({
    queryKey: ["mentors", topic, availableFrom, availableTo, page],
    queryFn: () =>
      mentorsApi.list({
        topic: topic || undefined,
        availableFrom,
        availableTo,
        page,
        pageSize: 20,
      }),
  });

  const totalPages = mentors.data
    ? Math.max(1, Math.ceil(mentors.data.pageInfo.total / 20))
    : 1;
  const searchCtx = mentors.data?.searchContext;

  function updateFilter(key: string, value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.delete("page");
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-canvas">
      {role === "public" ? <PublicNavbar /> : <AuthNavbar />}
      <main className="mx-auto max-w-[1000px] px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-semibold text-ink">
              Tìm Mentor
            </h1>
            <p className="mt-1 text-sm text-ink-secondary">
              Chỉ hồ sơ đã được Admin duyệt mới xuất hiện.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="text-xs font-semibold text-ink-secondary">
            Chuyên môn
            <select
              value={topic}
              onChange={(e) => updateFilter("topic", e.target.value)}
              className="mt-1 block min-w-56 rounded-lg border border-edge bg-panel px-3 py-2 text-sm font-normal"
            >
              <option value="">Tất cả</option>
              {taxonomy.data?.topics.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-ink-secondary">
            Lịch rảnh từ
            <input
              type="datetime-local"
              value={availableFromParam}
              onChange={(e) => updateFilter("availableFrom", e.target.value)}
              className="mt-1 block rounded-lg border border-edge bg-panel px-3 py-2 text-sm font-normal"
            />
          </label>
          <label className="text-xs font-semibold text-ink-secondary">
            đến
            <input
              type="datetime-local"
              value={availableToParam}
              onChange={(e) => updateFilter("availableTo", e.target.value)}
              className="mt-1 block rounded-lg border border-edge bg-panel px-3 py-2 text-sm font-normal"
            />
          </label>
        </div>

        {mentors.error && (
          <div className="mt-5">
            <ErrorPanel error={mentors.error} onRetry={() => mentors.refetch()} />
          </div>
        )}

        <div className="mt-6 space-y-4">
          {mentors.isLoading && (
            <p className="text-sm text-ink-muted">Đang tải mentor…</p>
          )}
          {mentors.data?.items.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}

          {mentors.data && mentors.data.items.length === 0 && (
            <div className="rounded-xl border border-dashed border-edge p-10 text-center text-sm text-ink-muted">
              {searchCtx?.emptyReason === "NO_MATCHING_MENTOR" ? (
                <>
                  <p className="font-semibold text-ink">
                    Chưa có Mentor đã duyệt phù hợp với chủ đề này.
                  </p>
                  <p className="mt-2">
                    Bạn có thể bỏ/chọn chủ đề khác, tiếp tục tự luyện, hoặc
                    thử lại sau.
                  </p>
                </>
              ) : searchCtx?.emptyReason === "NO_AVAILABLE_SLOT" ? (
                <>
                  <p className="font-semibold text-ink">
                    Có Mentor phù hợp chuyên môn nhưng chưa có lịch rảnh
                    trong khoảng thời gian đã chọn.
                  </p>
                  <p className="mt-2">
                    Bạn có thể mở rộng khoảng thời gian, bỏ bộ lọc lịch
                    rảnh, hoặc xem Mentor phù hợp khác.
                  </p>
                </>
              ) : (
                <p>Chưa có mentor đã duyệt phù hợp bộ lọc.</p>
              )}
            </div>
          )}
        </div>

        {mentors.data && mentors.data.pageInfo.total > 20 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-ink-muted">
              Trang {page} / {totalPages} ({mentors.data.pageInfo.total} kết
              quả)
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() =>
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("page", String(page - 1));
                    return next;
                  })
                }
                className="rounded-md border border-edge bg-panel px-3 py-1.5 text-xs font-medium text-ink disabled:opacity-50"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() =>
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("page", String(page + 1));
                    return next;
                  })
                }
                className="rounded-md border border-edge bg-panel px-3 py-1.5 text-xs font-medium text-ink disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
