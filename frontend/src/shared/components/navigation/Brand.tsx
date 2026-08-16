import { CaretUp } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export function Brand({ to }: { to: string }) {
  return (
    <Link to={to} className="flex shrink-0 items-center gap-2" aria-label="PrepVI — Trang chủ">
      <span className="flex size-7 items-center justify-center rounded bg-primary text-on-primary">
        <CaretUp aria-hidden size={14} weight="bold" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-ink">PrepVI</span>
    </Link>
  );
}
