import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { mentorsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

const slotStatusLabels: Record<string, string> = {
  AVAILABLE: "Còn trống",
  BOOKED: "Đã có lịch hẹn",
  BLOCKED: "Đã khóa",
};

const slotStatusDescriptions: Record<string, string> = {
  BOOKED: "Khung giờ này đã gắn với lịch hẹn nên không thể xóa.",
  BLOCKED: "Khung giờ này đang bị khóa nên không thể xóa.",
};

function formatSlotTimeRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const startTime = start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const endTime = end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return `${startTime}–${endTime}`;
}

function formatGroupDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function toLocalDateTimeInput(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function zonedLocalToDate(parts: ReturnType<typeof zonedParts>, timeZone: string) {
  const desiredUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  let candidate = desiredUtc;

  // Resolve the timezone offset at the target wall-clock time. Repeating once
  // handles offset changes around daylight-saving boundaries.
  for (let iteration = 0; iteration < 2; iteration += 1) {
    const actual = zonedParts(new Date(candidate), timeZone);
    const actualAsUtc = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, actual.second);
    candidate += desiredUtc - actualAsUtc;
  }

  return new Date(candidate);
}

function sameLocalTimeNextWeek(isoDate: string, timeZone: string) {
  const source = zonedParts(new Date(isoDate), timeZone);
  const shifted = new Date(Date.UTC(
    source.year,
    source.month - 1,
    source.day + 7,
    source.hour,
    source.minute,
    source.second,
  ));
  return zonedLocalToDate({
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
  }, timeZone);
}

export default function MentorAvailability() {
  const queryClient = useQueryClient();
  const slots = useQuery({ queryKey: ["availability"], queryFn: mentorsApi.slots });
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [copyingSlotId, setCopyingSlotId] = useState<string | null>(null);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const minDateTime = useMemo(() => {
    const now = new Date();
    now.setSeconds(0, 0);
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 16);
  }, []);
  const slotGroups = useMemo(() => {
    const items = [...(slots.data?.items ?? [])].sort(
      (left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
    );
    return items.reduce<Array<{ key: string; label: string; items: typeof items }>>((groups, slot) => {
      const start = new Date(slot.startsAt);
      const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
      const current = groups.at(-1);
      if (current?.key === key) current.items.push(slot);
      else groups.push({ key, label: formatGroupDate(slot.startsAt), items: [slot] });
      return groups;
    }, []);
  }, [slots.data?.items]);

  const create = useMutation({
    mutationFn: () => mentorsApi.createSlot({
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      timezone,
    }),
    onSuccess: () => {
      setStartsAt("");
      setEndsAt("");
      setValidationError("");
      setSuccessMessage("Đã thêm khung giờ rảnh.");
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });

  const remove = useMutation({
    mutationFn: ({ id, version }: { id: string; version: number }) => mentorsApi.cancelSlot(id, version),
    onSuccess: () => {
      setPendingDeleteId(null);
      setSuccessMessage("Đã xóa khung giờ rảnh.");
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });

  const copyNextWeek = useMutation({
    mutationFn: ({ id, startsAt: sourceStartsAt, endsAt: sourceEndsAt, sourceTimezone }: {
      id: string;
      startsAt: string;
      endsAt: string;
      sourceTimezone: string;
    }) => {
      setCopyingSlotId(id);
      const startsAtNextWeek = sameLocalTimeNextWeek(sourceStartsAt, sourceTimezone);
      const endsAtNextWeek = sameLocalTimeNextWeek(sourceEndsAt, sourceTimezone);
      return mentorsApi.createSlot({
        startsAt: startsAtNextWeek.toISOString(),
        endsAt: endsAtNextWeek.toISOString(),
        timezone: sourceTimezone,
      });
    },
    onSuccess: () => {
      setCopyingSlotId(null);
      setSuccessMessage("Đã sao chép khung giờ sang tuần sau.");
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
    onError: () => setCopyingSlotId(null),
  });

  function applyDuration(minutes: number) {
    const start = new Date(startsAt);
    if (Number.isNaN(start.getTime())) {
      setValidationError("Hãy chọn giờ bắt đầu trước khi chọn thời lượng.");
      return;
    }
    setEndsAt(toLocalDateTimeInput(new Date(start.getTime() + minutes * 60_000)));
    setValidationError("");
    setSuccessMessage("");
  }

  function submitSlot(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const start = new Date(startsAt);
    const end = new Date(endsAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setValidationError("Vui lòng nhập thời gian hợp lệ.");
      return;
    }
    if (start <= new Date()) {
      setValidationError("Chỉ có thể tạo khung giờ trong tương lai.");
      return;
    }
    if (end <= start) {
      setValidationError("Giờ kết thúc phải sau giờ bắt đầu.");
      return;
    }
    setValidationError("");
    setSuccessMessage("");
    create.mutate();
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />
      <main className="mx-auto max-w-[850px] px-6 py-8">
        <h1 className="text-[22px] font-semibold text-ink">Lịch rảnh</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Thiết lập thời gian bạn có thể nhận lịch phỏng vấn. Khung giờ đã qua hoặc bị trùng sẽ không thể thêm.
        </p>

        {(slots.error || create.error || remove.error || copyNextWeek.error) && (
          <div className="mt-5">
            <ErrorPanel error={slots.error || create.error || remove.error || copyNextWeek.error} />
          </div>
        )}
        {successMessage && (
          <p role="status" className="mt-5 rounded-md border border-ok/40 bg-ok-soft px-3 py-2 text-sm text-ink-secondary">
            {successMessage}
          </p>
        )}
        {validationError && (
          <p role="alert" className="mt-5 rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
            {validationError}
          </p>
        )}

        <form
          onSubmit={submitSlot}
          className="mt-6 grid gap-3 rounded-xl border border-edge bg-panel p-5 sm:grid-cols-[1fr_1fr_auto]"
        >
          <label className="text-xs font-semibold text-ink-secondary">
            Bắt đầu
            <input
              required
              type="datetime-local"
              min={minDateTime}
              value={startsAt}
              onChange={(event) => {
                setStartsAt(event.target.value);
                setValidationError("");
                setSuccessMessage("");
              }}
              className="mt-1 block w-full rounded-md border border-edge px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-semibold text-ink-secondary">
            Kết thúc
            <input
              required
              type="datetime-local"
              min={startsAt || minDateTime}
              value={endsAt}
              onChange={(event) => {
                setEndsAt(event.target.value);
                setValidationError("");
                setSuccessMessage("");
              }}
              className="mt-1 block w-full rounded-md border border-edge px-3 py-2 text-sm"
            />
            <span className="mt-2 flex flex-wrap gap-2" aria-label="Chọn nhanh thời lượng">
              {[30, 45, 60, 90].map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  aria-label={`Đặt thời lượng ${minutes} phút`}
                  onClick={() => applyDuration(minutes)}
                  className="min-h-11 rounded-md border border-edge bg-canvas px-3 py-2 text-xs font-medium text-ink-secondary hover:border-edge-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {minutes} phút
                </button>
              ))}
            </span>
          </label>
          <button
            disabled={create.isPending}
            className="self-end rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {create.isPending ? "Đang thêm..." : "Thêm khung giờ"}
          </button>
        </form>

        <p className="mt-2 text-xs text-ink-muted">
          Múi giờ hiện tại: <span className="font-medium text-ink-secondary">{timezone}</span>. Bạn nhập giờ theo thời gian trên thiết bị; hệ thống lưu UTC để tránh lệch lịch khi xem ở múi giờ khác.
        </p>

        <div className="mt-6 space-y-3">
          {slots.isPending && <p className="text-sm text-ink-muted">Đang tải lịch rảnh...</p>}
          {!slots.isPending && slots.data?.items.length === 0 && (
            <p className="rounded-xl border border-dashed border-edge bg-panel p-5 text-sm text-ink-muted">
              Bạn chưa có khung giờ tương lai nào. Hãy thêm một khung giờ ở phía trên.
            </p>
          )}
          {slotGroups.map((group) => (
            <section key={group.key} aria-labelledby={`slot-group-${group.key}`} className="space-y-3">
              <div className="sticky top-0 z-10 border-b border-edge bg-canvas/95 py-2 backdrop-blur">
                <h2 id={`slot-group-${group.key}`} className="text-sm font-semibold capitalize text-ink">
                  {group.label}
                </h2>
                <p className="mt-0.5 text-xs text-ink-muted">{group.items.length} khung giờ</p>
              </div>
              {group.items.map((slot) => {
                const status = slot.status;
                const statusLabel = slotStatusLabels[status] ?? status;
                const statusDescription = slot.pendingBookingCount > 0
                  ? `${slot.pendingBookingCount} yêu cầu đặt lịch đang chờ. Hãy xử lý các yêu cầu này trước khi xóa khung giờ.`
                  : slotStatusDescriptions[status];
                return (
                  <article
                    key={slot.id}
                    aria-label={`${formatSlotTimeRange(slot.startsAt, slot.endsAt)}${statusLabel ? `, ${statusLabel}` : ""}`}
                    className="flex flex-col gap-4 rounded-xl border border-edge bg-panel p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-ink">
                        {formatSlotTimeRange(slot.startsAt, slot.endsAt)}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-ink-muted">{slot.timezone}</span>
                        {statusLabel && (
                          <span className="rounded-full border border-edge px-2 py-1 text-xs font-medium text-ink-secondary">
                            {statusLabel}
                          </span>
                        )}
                        {slot.pendingBookingCount > 0 && (
                          <span className="rounded-full border border-edge px-2 py-1 text-xs font-medium text-ink-secondary">
                            {slot.pendingBookingCount} yêu cầu đang chờ
                          </span>
                        )}
                      </div>
                      {statusDescription && (
                        <p className="mt-2 text-xs leading-5 text-ink-secondary">{statusDescription}</p>
                      )}
                    </div>
                    <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                      <button
                        type="button"
                        disabled={copyNextWeek.isPending}
                        aria-label={`Tạo khung giờ tương tự tuần sau từ ${formatSlotTimeRange(slot.startsAt, slot.endsAt)}`}
                        onClick={() => {
                          setSuccessMessage("");
                          copyNextWeek.mutate({
                            id: slot.id,
                            startsAt: slot.startsAt,
                            endsAt: slot.endsAt,
                            sourceTimezone: slot.timezone,
                          });
                        }}
                        className="min-h-11 w-full rounded-md border border-edge px-3 py-2 text-sm font-medium text-ink-secondary disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
                      >
                        {copyNextWeek.isPending && copyingSlotId === slot.id
                          ? "Đang tạo..."
                          : "Tạo giờ tương tự tuần sau"}
                      </button>
                      {slot.deletable && (
                        pendingDeleteId === slot.id ? (
                          <>
                            <button
                              type="button"
                              disabled={remove.isPending}
                              onClick={() => {
                                setSuccessMessage("");
                                remove.mutate({ id: slot.id, version: Number(slot.version) });
                              }}
                              className="min-h-11 w-full rounded-md bg-danger px-3 py-2 text-sm font-medium text-on-primary disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
                            >
                              {remove.isPending ? "Đang xóa..." : "Xác nhận xóa"}
                            </button>
                            <button
                              type="button"
                              disabled={remove.isPending}
                              onClick={() => setPendingDeleteId(null)}
                              className="min-h-11 w-full rounded-md border border-edge px-3 py-2 text-sm font-medium text-ink-secondary disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
                            >
                              Giữ lại
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            aria-label={`Xóa khung giờ ${formatSlotTimeRange(slot.startsAt, slot.endsAt)}`}
                            onClick={() => {
                              setPendingDeleteId(slot.id);
                              setSuccessMessage("");
                            }}
                            className="min-h-11 w-full rounded-md border border-danger/30 px-3 py-2 text-sm font-medium text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger sm:w-auto"
                          >
                            Xóa
                          </button>
                        )
                      )}
                      {!slot.deletable && (
                        <span
                          role="status"
                          aria-label={statusDescription ?? "Khung giờ này không thể xóa."}
                          className="flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-md border border-edge px-3 py-2 text-sm font-medium text-ink-muted opacity-70 sm:w-auto"
                        >
                          Không thể xóa
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
