import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import StatusBadge from "@/shared/components/StatusBadge";

export default function Admin() {
  const cases = useQuery({
    queryKey: ["operation-cases", "active"],
    queryFn: () => adminApi.cases({ status: "OPEN", pageSize: 100 }),
  });
  const verifications = useQuery({
    queryKey: ["mentor-verifications"],
    queryFn: adminApi.verifications,
  });
  const reports = useQuery({
    queryKey: ["operation-reports", "active"],
    queryFn: () => adminApi.reports({ status: "OPEN", pageSize: 50 }),
  });

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />
      <main className="mx-auto max-w-[1100px] px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold text-ink">
              Operations Queue
            </h1>
            <p className="mt-1 text-sm text-ink-secondary">
              Mọi hành động được allowlist theo case type, bắt buộc
              reason/version và ghi audit.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/questions"
              className="rounded-md border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary"
            >
              Question moderation
            </Link>
            <Link
              to="/admin/taxonomy"
              className="rounded-md border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary"
            >
              Taxonomy
            </Link>
            <Link
              to="/admin/questions/import"
              className="rounded-md border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary"
            >
              Bulk import
            </Link>
            <Link
              to="/admin/audit/all"
              className="rounded-md border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary"
            >
              Audit log
            </Link>
          </div>
        </div>

        {(cases.error || verifications.error || reports.error) && (
          <div className="mt-5">
            <ErrorPanel
              error={cases.error || verifications.error || reports.error}
            />
          </div>
        )}

        <section className="mt-6">
          <h2 className="text-sm font-semibold text-ink">
            Mentor verification
          </h2>
          <div className="mt-3 space-y-2">
            {verifications.isLoading && (
              <p className="text-sm text-ink-muted">
                Đang tải hàng đợi xác minh…
              </p>
            )}
            {verifications.data?.items.length === 0 && (
              <p className="rounded-lg border border-dashed border-edge p-8 text-center text-sm text-ink-muted">
                Không có hồ sơ Cố vấn đang chờ xác minh.
              </p>
            )}
            {verifications.data?.items.map((item) => (
              <Link
                key={item.verificationId}
                to={`/admin/mentors/${item.verificationId}/review`}
                className="flex justify-between gap-4 rounded-lg border border-edge bg-panel p-4"
              >
                <span>
                  <span className="block text-sm font-medium text-ink">
                    {item.displayName}
                  </span>
                  <span className="mt-1 block text-xs text-ink-muted">
                    {item.headline}
                  </span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-muted">
                    {new Date(item.submittedAt).toLocaleString("vi-VN")}
                  </span>
                  <StatusBadge status="pending" size="sm" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-ink">
            Recovery và dispute
          </h2>
          <div className="mt-3 space-y-2">
            {cases.data?.items.map((item) => (
              <Link
                key={item.id}
                to={`/admin/cases/${item.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-edge bg-panel p-4"
              >
                <span>
                  <span className="block text-xs font-semibold text-primary">
                    {item.type}
                  </span>
                  <span className="mt-1 block text-sm text-ink">
                    {item.summary}
                  </span>
                </span>
                <span className="text-xs text-ink-muted">v{item.version}</span>
              </Link>
            ))}
            {cases.data?.items.length === 0 && (
              <p className="rounded-lg border border-dashed border-edge p-8 text-center text-sm text-ink-muted">
                Không có case mở.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-ink">
            Participant reports
          </h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-edge bg-panel">
            <div className="divide-y divide-edge">
              {reports.data?.items.map((report) => (
                <article
                  key={report.id}
                  className="grid gap-2 p-4 sm:grid-cols-[160px_1fr_auto]"
                >
                  <span className="text-xs font-semibold text-primary">
                    {report.reasonCode}
                  </span>
                  <span>
                    <span className="block text-sm text-ink">
                      {report.description}
                    </span>
                    <span className="mt-1 block text-xs text-ink-muted">
                      {report.targetType} / {report.targetId.slice(0, 8)} ·{" "}
                      {new Date(report.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </span>
                  <span className="text-xs font-medium text-notice-ink">
                    {report.status} · v{report.version}
                  </span>
                </article>
              ))}
              {reports.data?.items.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink-muted">
                  Không có report đang mở.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
