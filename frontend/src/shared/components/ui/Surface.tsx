import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "subtle" | "success" | "notice" | "danger";
}

const tones = {
  default: "bg-panel border-edge",
  subtle: "bg-canvas-subtle border-edge",
  success: "bg-ok-soft border-ok/30",
  notice: "bg-notice-soft border-notice/35",
  danger: "bg-danger-soft border-danger/25",
};

export function Surface({ tone = "default", className, ...props }: SurfaceProps) {
  return <div className={cn("rounded-xl border", tones[tone], className)} {...props} />;
}
