"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type Tone = "success" | "warning" | "danger" | "info" | "violet" | "accent" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "bg-success-soft text-success border-success/25",
  warning: "bg-warning-soft text-warning border-warning/25",
  danger: "bg-danger-soft text-danger border-danger/25",
  info: "bg-info-soft text-info border-info/25",
  violet: "bg-violet-soft text-violet border-violet/25",
  accent: "bg-accent-soft text-accent-hi border-accent/25",
  neutral: "bg-surface-3 text-content-muted border-hairline",
};

const dotColor: Record<Tone, string> = {
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  info: "var(--info)",
  violet: "var(--violet)",
  accent: "var(--accent)",
  neutral: "var(--text-faint)",
};

export function Badge({
  tone = "neutral",
  dot = false,
  children,
  className,
}: {
  tone?: Tone;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("badge", toneClass[tone], className)}>
      {dot && (
        <span
          className="h-1 w-1 rounded-full"
          style={{ background: dotColor[tone] }}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

// Domain status → tone. Central so status colour stays consistent + meaningful.
const STATUS_TONE: Record<string, Tone> = {
  // generic
  Active: "success",
  Inactive: "neutral",
  Suspended: "danger",
  Blocked: "danger",
  Flagged: "warning",
  Paused: "warning",
  Onboarding: "info",
  // verification / kyc
  Verified: "success",
  Pending: "warning",
  Rejected: "danger",
  Expired: "danger",
  // transfer lifecycle
  Initiated: "neutral",
  Screened: "info",
  Funded: "info",
  Routed: "violet",
  PaidOut: "accent",
  Settled: "success",
  OnHold: "warning",
  Reversed: "violet",
  Failed: "danger",
  // liquidity
  Healthy: "success",
  Low: "warning",
  Critical: "danger",
  // settlement / recon
  Matched: "success",
  Break: "danger",
  Investigating: "warning",
  Resolved: "success",
  // cases
  Open: "info",
  "In Review": "warning",
  Escalated: "danger",
  Cleared: "success",
  Filed: "violet",
  // approvals
  Approved: "success",
  // screening
  "True Positive": "danger",
  "False Positive": "success",
  // reports / webhooks / keys
  Ready: "success",
  Generating: "info",
  Scheduled: "neutral",
  Failing: "danger",
  Disabled: "neutral",
  Revoked: "neutral",
  Production: "accent",
  Sandbox: "info",
};

const LABEL_OVERRIDE: Record<string, string> = {
  PaidOut: "Paid Out",
  OnHold: "On Hold",
};

export function StatusPill({
  status,
  dot = true,
  className,
}: {
  status: string;
  dot?: boolean;
  className?: string;
}) {
  const tone = STATUS_TONE[status] ?? "neutral";
  return (
    <Badge tone={tone} dot={dot} className={className}>
      {LABEL_OVERRIDE[status] ?? status}
    </Badge>
  );
}

export function statusTone(status: string): Tone {
  return STATUS_TONE[status] ?? "neutral";
}
