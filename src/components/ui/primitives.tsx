"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ─────────────────────────── Button ─────────────────────────── */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-control font-medium whitespace-nowrap transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:opacity-45 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary:
          "metallic text-accent-contrast font-semibold shadow-subtle hover:brightness-[1.06] active:brightness-95",
        accent:
          "bg-accent text-accent-contrast font-semibold hover:bg-accent-hi active:brightness-95",
        outline:
          "border border-hairline-strong text-content-2 hover:bg-surface-3 hover:text-content",
        ghost: "text-content-muted hover:bg-surface-3 hover:text-content",
        subtle: "bg-surface-3 text-content-2 hover:bg-surface-4",
        danger: "bg-danger text-white hover:brightness-110 active:brightness-95",
        "danger-outline":
          "border border-danger/40 text-danger hover:bg-danger-soft",
      },
      size: {
        xs: "h-6 px-2 text-2xs",
        sm: "h-7 px-3 text-xs",
        md: "h-8 px-3.5 text-xs",
        lg: "h-9 px-4 text-sm",
        icon: "h-7 w-7",
        "icon-sm": "h-6 w-6",
      },
    },
    defaultVariants: { variant: "outline", size: "sm" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";

/* ─────────────────────────── Card / SectionCard ─────────────────────────── */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-card border border-hairline bg-surface-2 shadow-card", className)}
      {...props}
    />
  );
}

export function SectionCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card className={cn("p-4", className)} {...props}>
      {children}
    </Card>
  );
}

export function SectionHeader({
  title,
  caption,
  action,
  className,
}: {
  title: React.ReactNode;
  caption?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 mb-3", className)}>
      <div>
        <h3 className="text-md font-semibold text-content">{title}</h3>
        {caption && <p className="text-2xs text-content-faint mt-0.5">{caption}</p>}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}

/* ─────────────────────────── StatCard ─────────────────────────── */
export function StatCard({
  label,
  value,
  sub,
  delta,
  accent = false,
  icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  delta?: { value: number; positiveIsGood?: boolean };
  accent?: boolean;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-3.5 relative overflow-hidden", className)}>
      {accent && (
        <span className="absolute left-0 top-0 h-full w-[2px] metallic" aria-hidden />
      )}
      <div className="flex items-center justify-between">
        <p className="text-2xs uppercase tracking-wide text-content-faint">{label}</p>
        {icon && <span className="text-content-faint">{icon}</span>}
      </div>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <p
          className={cn(
            "text-2xl font-semibold tabular leading-none",
            accent ? "text-accent-hi" : "text-content",
          )}
        >
          {value}
        </p>
        {delta && <KpiDelta value={delta.value} positiveIsGood={delta.positiveIsGood} />}
      </div>
      {sub && <p className="mt-1.5 text-2xs text-content-faint">{sub}</p>}
    </Card>
  );
}

export function KpiDelta({
  value,
  positiveIsGood = true,
}: {
  value: number;
  positiveIsGood?: boolean;
}) {
  const up = value >= 0;
  const good = positiveIsGood ? up : !up;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-2xs font-medium tabular",
        good ? "text-success" : "text-danger",
      )}
    >
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

/* ─────────────────────────── Avatar ─────────────────────────── */
export function Avatar({
  initials,
  color = "var(--brand)",
  size = 26,
  className,
}: {
  initials: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-accent-contrast shrink-0",
        className,
      )}
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  );
}

/* ─────────────────────────── Meter (utilisation / progress) ─────────────────────────── */
export function Meter({
  value,
  tone = "brand",
  className,
}: {
  value: number; // 0-100
  tone?: "brand" | "accent" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const toneVar: Record<string, string> = {
    brand: "var(--brand-soft)",
    accent: "var(--accent)",
    success: "var(--success)",
    warning: "var(--warning)",
    danger: "var(--danger)",
    info: "var(--info)",
  };
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-surface-4 overflow-hidden", className)}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: toneVar[tone] }}
      />
    </div>
  );
}

/* ─────────────────────────── PageHeader ─────────────────────────── */
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-content tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-content-faint mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
}

/* ─────────────────────────── Segmented control ─────────────────────────── */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-control border border-hairline bg-surface-1 p-0.5",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-[6px] px-2.5 py-1 text-2xs font-medium transition-colors",
            value === o.value
              ? "bg-surface-3 text-content shadow-subtle"
              : "text-content-faint hover:text-content-2",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────── Spinner ─────────────────────────── */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-3 w-3 animate-spin rounded-full border-[1.5px] border-content-faint border-t-transparent",
        className,
      )}
    />
  );
}
