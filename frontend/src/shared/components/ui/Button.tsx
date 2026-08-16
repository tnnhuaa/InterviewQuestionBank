import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { SpinnerGap } from "@phosphor-icons/react";
import { cn } from "@/shared/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover border-primary",
  secondary: "bg-panel text-ink-secondary hover:text-primary hover:border-primary border-edge",
  ghost: "bg-transparent text-ink-secondary hover:bg-primary-soft hover:text-primary border-transparent",
  danger: "bg-danger text-on-primary hover:bg-danger-strong border-danger",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-8 px-3 text-xs rounded-md",
  md: "min-h-10 px-4 text-sm rounded-lg",
  lg: "min-h-12 px-6 text-sm rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, icon, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <SpinnerGap aria-hidden size={18} className="animate-spin" /> : icon}
      {children}
    </button>
  );
});
