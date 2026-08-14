"use client";

import * as React from "react";
import { Inbox, FileText, FileSpreadsheet, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────── EmptyState ─────────────────────────── */
export function EmptyState({
  title = "No records yet",
  message = "When there are records, they will show here.",
  icon,
  action,
  className,
}: {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-14 text-center",
        className,
      )}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-surface-1 text-content-dim">
        {icon ?? <Inbox size={20} strokeWidth={1.5} />}
      </div>
      <p className="text-sm font-semibold text-content-2">{title}</p>
      <p className="mt-1 max-w-xs text-2xs text-content-faint">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ─────────────────────────── DownloadButtons ─────────────────────────── */
export function DownloadButtons({ className }: { className?: string }) {
  const formats = [
    { label: "PDF", icon: FileText, tone: "var(--danger)" },
    { label: "XLS", icon: FileSpreadsheet, tone: "var(--success)" },
    { label: "CSV", icon: FileDown, tone: "var(--info)" },
  ];
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="text-2xs font-medium text-content-faint">Export</span>
      {formats.map((f) => (
        <button
          key={f.label}
          title={`Download ${f.label}`}
          className="flex h-6 items-center gap-1 rounded-control border border-hairline px-1.5 text-3xs font-bold text-content-muted transition-colors hover:bg-surface-3 hover:text-content"
        >
          <f.icon size={11} style={{ color: f.tone }} />
          {f.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────── Detail rows (receipt / drawer) ─────────────────────────── */
export function DetailRow({
  label,
  value,
  mono = false,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-1.5 border-b border-hairline-faint last:border-none",
        className,
      )}
    >
      <span className="text-2xs text-content-faint">{label}</span>
      <span
        className={cn(
          "text-xs text-content-2 text-right",
          mono && "font-mono tabular text-content",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function DescriptionList({ children }: { children: React.ReactNode }) {
  return <div className="rounded-panel border border-hairline bg-surface-1 px-3 py-1">{children}</div>;
}

/* ─────────────────────────── Toolbar row ─────────────────────────── */
export function Toolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>
  );
}
