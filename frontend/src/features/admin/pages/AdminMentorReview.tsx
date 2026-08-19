import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminApi } from "@/shared/api/resources";
import type { MentorVerificationDecisionInput } from "@/shared/api/resources";
import { ApiError } from "@/shared/api/client";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import StatusBadge from "@/shared/components/StatusBadge";

export default function AdminMentorReview() {
  const { mentorId: verificationId = "" } = useParams();
  const queryClient = useQueryClient();

  const review = useQuery({
    queryKey: ["admin-mentor-verification", verificationId],
    queryFn: () => adminApi.verification(verificationId),
  });

  const [reason, setReason] = useState("");
  const [confirming, setConfirming] = useState<"APPROVED" | "REJECTED" | null>(
    null,
  );

  const mutation = useMutation({
    mutationFn: (input: MentorVerificationDecisionInput) =>
      adminApi.decideVerification(verificationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-verifications"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-mentor-verification", verificationId],
      });
    },
  });

  const data = review.data;
  const isPending = data?.status === "PENDING";
  const isDecided = data?.status === "APPROVED" || data?.status === "REJECTED";
  const decisionResult = mutation.data;
  const isStaleConflict =
    mutation.error instanceof ApiError && mutation.error.status === 409;

  useEffect(() => {
    if (isStaleConflict) {
      setConfirming(null);
      review.refetch();
    }
  }, [isStaleConflict, review]);

  function handleConfirmDecision(decision: "APPROVED" | "REJECTED") {
    if (!data) return;
    mutation.mutate({ decision, reason, version: data.version });
    setConfirming(null);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />
      <main className="mx-auto max-w-[800px] px-6 py-8">
        {review.error ? (
          <ErrorPanel error={review.error} />
        ) : review.isLoading ? (
          <p className="text-sm text-ink-muted">Đang tải hồ sơ…</p>
        ) : !data ? (
          <p className="text-sm text-ink-muted">Hồ sơ không tồn tại.</p>
        ) : (
          <>
            {mutation.isError && !confirming && (
              <div className="mb-5">
                {isStaleConflict ? (
                  <div role="alert" className="rounded-xl border border-warning/20 bg-warning-soft p-5 text-sm text-ink">
                    <p className="font-semibold">Xung đột phiên bản</p>
                    <p className="mt-1 text-ink-secondary">
                      Hồ sơ đã được Admin khác xử lý hoặc thay đổi. Dữ liệu đã
                      được tự động tải lại với phiên bản mới nhất.
                    </p>
                  </div>
                ) : (
                  <ErrorPanel error={mutation.error} />
                )}
              </div>
            )}

            {mutation.isSuccess && decisionResult ? (
              <section className="rounded-xl border border-edge bg-panel p-6">
                <p className="text-xs font-semibold text-primary">
                  QUYẾT ĐỊNH ĐÃ ĐƯỢC LƯU
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-ink">
                    {data.mentor.displayName}
                  </h1>
                  <StatusBadge status={decisionResult.status.toLowerCase()} />
                </div>
                <dl className="mt-4 grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                  <dt className="text-ink-muted">Lý do</dt>
                  <dd className="text-ink">{decisionResult.reason}</dd>
                  <dt className="text-ink-muted">Thời gian quyết định</dt>
                  <dd className="text-ink">
                    {new Date(decisionResult.decidedAt).toLocaleString("vi-VN")}
                  </dd>
                  <dt className="text-ink-muted">Phiên bản</dt>
                  <dd className="text-ink">v{decisionResult.version}</dd>
                </dl>
                <div className="mt-5 flex gap-2">
                  <Link
                    to="/admin"
                    className="rounded-md border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary"
                  >
                    Quay lại hàng đợi
                  </Link>
                  <Link
                    to={`/admin/audit/all?targetId=${decisionResult.mentorId}`}
                    className="rounded-md border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary"
                  >
                    Audit log
                  </Link>
                </div>
              </section>
            ) : (
              <>
                {/* Section A — Mentor profile preview */}
                <section className="rounded-xl border border-edge bg-panel p-6">
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-semibold text-primary">
                      MENTOR VERIFICATION
                    </p>
                    <StatusBadge status={data.status.toLowerCase()} />
                  </div>
                  <h1 className="mt-2 text-xl font-semibold text-ink">
                    {data.mentor.displayName}
                  </h1>
                  <p className="mt-1 text-sm text-ink-secondary">
                    {data.mentor.headline}
                  </p>
                  <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-ink-secondary">
                    {data.mentor.bio}
                  </p>
                  <div className="mt-4 grid grid-cols-[100px_1fr] gap-y-1 text-sm">
                    <span className="text-ink-muted">Múi giờ</span>
                    <span className="text-ink">{data.mentor.timezone}</span>
                    <span className="text-ink-muted">Chủ đề</span>
                    <span className="text-ink">
                      {data.mentor.topics.map((t) => t.name).join(", ") || "—"}
                    </span>
                    <span className="text-ink-muted">Vị trí</span>
                    <span className="text-ink">
                      {data.mentor.positions.map((p) => p.name).join(", ") ||
                        "—"}
                    </span>
                    <span className="text-ink-muted">Gửi lúc</span>
                    <span className="text-ink">
                      {new Date(data.submittedAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </section>

                {/* Section B — Review checklist */}
                <section className="mt-5 rounded-xl border border-edge bg-panel p-6">
                  <h2 className="text-xs font-semibold text-ink-secondary">
                    CHECKLIST XÉT DUYỆT
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
                    <li className="flex items-start gap-2">
                      <span
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border border-edge"
                        aria-hidden="true"
                      />
                      Hồ sơ có nội dung đủ để xác định chuyên môn
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border border-edge"
                        aria-hidden="true"
                      />
                      Expertise khai báo phù hợp với hồ sơ
                    </li>
                    <li className="flex items-start gap-2">
                      <span
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border border-edge"
                        aria-hidden="true"
                      />
                      Đã kiểm tra bằng chứng xác minh restricted
                    </li>
                  </ul>
                </section>

                {/* Section C — Restricted evidence */}
                <section className="mt-5 rounded-xl border border-edge bg-panel p-6">
                  <h2 className="text-xs font-semibold text-ink-secondary">
                    BẰNG CHỨNG XÁC MINH
                  </h2>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="text-ink">
                      Loại: {data.evidence.mimeType}
                    </span>
                    <span className="text-ink-muted">·</span>
                    <span className="text-ink">
                      Kích thước: {(data.evidence.sizeBytes / 1024).toFixed(1)}{" "}
                      KB
                    </span>
                  </div>
                  <a
                    href={`/api/v1/admin/mentor-verifications/${data.verificationId}/evidence-link`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-primary"
                  >
                    Mở bằng chứng restricted (link 5 phút)
                  </a>
                </section>

                {/* Section D — Prior decision history */}
                <section className="mt-5 rounded-xl border border-edge bg-panel p-6">
                  <h2 className="text-xs font-semibold text-ink-secondary">
                    LỊCH SỬ XÉT DUYỆT TRƯỚC
                  </h2>
                  {data.priorDecisions.length === 0 ? (
                    <p className="mt-3 text-sm text-ink-muted">
                      Chưa có lần xét duyệt trước.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {data.priorDecisions.map((item) => (
                        <div
                          key={item.verificationId}
                          className="rounded-lg border border-edge bg-canvas-subtle p-3"
                        >
                          <div className="flex items-center gap-2">
                            <StatusBadge
                              status={item.status.toLowerCase()}
                              size="sm"
                            />
                            <span className="text-xs text-ink-muted">
                              {new Date(item.submittedAt).toLocaleString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                          {item.decisionReason && (
                            <p className="mt-1 text-sm text-ink-secondary">
                              Lý do: {item.decisionReason}
                            </p>
                          )}
                          {item.decidedBy && (
                            <p className="mt-1 text-xs text-ink-muted">
                              Bởi: {item.decidedBy.displayName}
                              {item.decidedAt &&
                                ` · ${new Date(item.decidedAt).toLocaleString("vi-VN")}`}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Section E — Decision */}
                {isPending && !decisionResult && (
                  <section className="mt-5 rounded-xl border border-edge bg-panel p-6">
                    <label className="block text-xs font-semibold text-ink-secondary">
                      Lý do quyết định
                      <textarea
                        required
                        minLength={3}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        className="mt-1.5 w-full rounded-md border border-edge p-3 text-sm"
                        placeholder="Nhập lý do duyệt hoặc từ chối…"
                      />
                    </label>
                    <div className="mt-4 flex gap-2">
                      <button
                        disabled={reason.length < 3 || mutation.isPending}
                        onClick={() => setConfirming("APPROVED")}
                        className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary disabled:opacity-50"
                      >
                        Duyệt
                      </button>
                      <button
                        disabled={reason.length < 3 || mutation.isPending}
                        onClick={() => setConfirming("REJECTED")}
                        className="rounded-md border border-danger/30 px-4 py-2 text-xs font-medium text-danger disabled:opacity-50"
                      >
                        Từ chối
                      </button>
                    </div>
                  </section>
                )}

                {isDecided && !decisionResult && (
                  <section className="mt-5 rounded-xl border border-edge bg-panel p-6">
                    <p className="text-sm text-ink-muted">
                      Hồ sơ đã được{" "}
                      {data.status === "APPROVED" ? "duyệt" : "từ chối"}. Không
                      thể thay đổi quyết định.
                    </p>
                    <Link
                      to="/admin"
                      className="mt-3 inline-block text-sm font-medium text-primary"
                    >
                      Quay lại hàng đợi
                    </Link>
                  </section>
                )}

                {/* Confirmation dialog */}
                {confirming && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="mx-4 w-full max-w-md rounded-xl border border-edge bg-panel p-6 shadow-lg">
                      <h3 className="text-base font-semibold text-ink">
                        {confirming === "APPROVED"
                          ? "Duyệt xác minh Cố vấn?"
                          : "Từ chối xác minh Cố vấn?"}
                      </h3>
                      <p className="mt-2 text-sm text-ink-secondary">
                        {confirming === "APPROVED"
                          ? "Hồ sơ sẽ chuyển sang APPROVED và có thể trở thành đủ điều kiện cho các chức năng Cố vấn đã duyệt."
                          : "Hồ sơ sẽ chuyển sang REJECTED. Cố vấn sẽ thấy lý do và có thể gửi lại theo luồng US-07."}
                      </p>
                      <p className="mt-3 text-sm text-ink-secondary">
                        <span className="font-medium">Lý do:</span> {reason}
                      </p>
                      {mutation.isError && (
                        <div className="mt-4">
                          {isStaleConflict ? (
                            <p className="text-sm text-ink-secondary">
                              Xung đột phiên bản — đang tải lại dữ liệu…
                            </p>
                          ) : (
                            <ErrorPanel error={mutation.error} />
                          )}
                        </div>
                      )}
                      <div className="mt-5 flex justify-end gap-2">
                        <button
                          onClick={() => setConfirming(null)}
                          className="rounded-md border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary"
                        >
                          Hủy
                        </button>
                        <button
                          disabled={mutation.isPending}
                          onClick={() => handleConfirmDecision(confirming)}
                          className={`rounded-md px-4 py-2 text-xs font-medium text-on-primary disabled:opacity-50 ${
                            confirming === "APPROVED"
                              ? "bg-primary"
                              : "bg-danger"
                          }`}
                        >
                          {mutation.isPending
                            ? "Đang xử lý…"
                            : confirming === "APPROVED"
                              ? "Xác nhận duyệt"
                              : "Xác nhận từ chối"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
