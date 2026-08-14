"use client";

import * as React from "react";
import { Check, X, Stamp, Clock } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { scopeCorridors } from "@/lib/rbac";
import { formatMoney, formatDateTime, formatCompact } from "@/lib/utils";
import type { ApprovalRequest, ApprovalStatus, Currency } from "@/lib/types";
import {
  PageHeader,
  SectionCard,
  StatCard,
  Badge,
  Tabs,
  Button,
  EmptyState,
} from "@/components/ui";

const USD: Record<Currency, number> = {
  USD: 1, GBP: 1.27, EUR: 1.09, NGN: 0.00065, MXN: 0.058, PHP: 0.0171, INR: 0.012, MAD: 0.099,
};

export default function ApprovalsPage() {
  const { data, scope, isEmpty, canEdit, decideApproval } = useApp();
  const [tab, setTab] = React.useState<ApprovalStatus>("Pending");
  const [rationaleFor, setRationaleFor] = React.useState<string | null>(null);
  const [rationale, setRationale] = React.useState("");

  const corridors = React.useMemo(() => scopeCorridors(data.corridors, scope), [data.corridors, scope]);
  const codes = new Set(corridors.map((c) => c.code));
  const inScope = (code?: string) => !code || scope.isGlobal || codes.has(code);

  const approvals = data.approvalRequests.filter((a) => inScope(a.corridorCode));
  const pending = approvals.filter((a) => a.status === "Pending");
  const approved = approvals.filter((a) => a.status === "Approved");
  const rejected = approvals.filter((a) => a.status === "Rejected");
  const shown = tab === "Pending" ? pending : tab === "Approved" ? approved : rejected;

  const canDecide = canEdit("approvals");
  const pendingValueUsd = pending.reduce((s, a) => s + (a.amount ?? 0) * (USD[a.currency ?? "USD"] ?? 1), 0);
  const highValueCount = pending.filter((a) => a.type === "High-Value Transfer").length;
  const oldestPendingHrs = pending.length
    ? Math.round(
        Math.max(...pending.map((a) => (Date.now() - new Date(a.requestedOn).getTime()) / 3_600_000)),
      )
    : 0;

  function confirmReject(id: string) {
    decideApproval(id, "Rejected", rationale.trim() || undefined);
    setRationaleFor(null);
    setRationale("");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Approvals" subtitle="Maker-checker queue — high-value transfers, liquidity changes and config edits require a second approver" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard accent label="Pending" value={isEmpty ? "—" : pending.length} sub="awaiting decision" icon={<Clock size={12} />} />
        <StatCard label="Value pending" value={isEmpty ? "—" : formatCompact(pendingValueUsd)} sub="USD equivalent" />
        <StatCard label="High-value transfers" value={isEmpty ? "—" : highValueCount} sub="in pending" />
        <StatCard label="Oldest pending" value={isEmpty || !pending.length ? "—" : `${oldestPendingHrs}h`} sub="time in queue" />
        <StatCard label="Approved" value={isEmpty ? "—" : approved.length} sub="this period" />
        <StatCard label="Rejected" value={isEmpty ? "—" : rejected.length} sub="this period" />
      </div>

      <SectionCard>
        <Tabs
          className="mb-3"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "Pending", label: "Pending", count: isEmpty ? 0 : pending.length },
            { value: "Approved", label: "Approved", count: isEmpty ? 0 : approved.length },
            { value: "Rejected", label: "Rejected", count: isEmpty ? 0 : rejected.length },
          ]}
        />

        {isEmpty || !shown.length ? (
          <EmptyState
            title={tab === "Pending" ? "Queue clear" : `No ${tab.toLowerCase()} items`}
            message={tab === "Pending" ? "No pending approvals in scope." : "Decisions will show here once made."}
            icon={<Stamp size={20} strokeWidth={1.5} />}
          />
        ) : (
          <div className="space-y-2">
            {shown.map((a) => (
              <ApprovalCard
                key={a.id}
                approval={a}
                canDecide={canDecide}
                askingRationale={rationaleFor === a.id}
                rationale={rationale}
                onRationaleChange={setRationale}
                onApprove={() => decideApproval(a.id, "Approved")}
                onAskReject={() => {
                  setRationaleFor(a.id);
                  setRationale("");
                }}
                onCancelReject={() => setRationaleFor(null)}
                onConfirmReject={() => confirmReject(a.id)}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function ApprovalCard({
  approval: a,
  canDecide,
  askingRationale,
  rationale,
  onRationaleChange,
  onApprove,
  onAskReject,
  onCancelReject,
  onConfirmReject,
}: {
  approval: ApprovalRequest;
  canDecide: boolean;
  askingRationale: boolean;
  rationale: string;
  onRationaleChange: (v: string) => void;
  onApprove: () => void;
  onAskReject: () => void;
  onCancelReject: () => void;
  onConfirmReject: () => void;
}) {
  const resolved = a.status !== "Pending";
  return (
    <div className="rounded-panel border border-hairline-faint bg-surface-1 px-3 py-2.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{a.type}</Badge>
            <span className="font-mono text-3xs text-content-faint">{a.id}</span>
            {a.corridorCode && <span className="font-mono text-3xs text-content-faint">{a.corridorCode}</span>}
          </div>
          <p className="mt-1 text-xs text-content-2">{a.summary}</p>
          <p className="mt-0.5 text-3xs text-content-faint">
            Requested by {a.requestedBy} · {formatDateTime(a.requestedOn)}
            {a.amount && a.currency && <> · <span className="tabular text-content-muted">{formatMoney(a.amount, a.currency)}</span></>}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {!resolved && canDecide && !askingRationale && (
            <>
              <Button size="xs" variant="danger-outline" onClick={onAskReject}>
                <X size={11} /> Reject
              </Button>
              <Button size="xs" variant="accent" onClick={onApprove}>
                <Check size={11} /> Approve
              </Button>
            </>
          )}
          {!resolved && !canDecide && <Badge tone="warning">Pending</Badge>}
          {resolved && (
            <Badge tone={a.status === "Approved" ? "success" : "danger"}>{a.status}</Badge>
          )}
        </div>
      </div>

      {!resolved && askingRationale && (
        <div className="mt-2.5 flex items-center gap-2 border-t border-hairline-faint pt-2.5">
          <input
            autoFocus
            value={rationale}
            onChange={(e) => onRationaleChange(e.target.value)}
            placeholder="Reason for rejection (optional)"
            className="h-8 flex-1 rounded-control border border-hairline bg-surface-2 px-2.5 text-[11px] text-content placeholder:text-content-dim focus:border-danger/40 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
          <Button size="xs" variant="ghost" onClick={onCancelReject}>Cancel</Button>
          <Button size="xs" variant="danger" onClick={onConfirmReject}>Confirm reject</Button>
        </div>
      )}

      {resolved && (a.approver || a.rationale) && (
        <div className="mt-2 border-t border-hairline-faint pt-2 text-3xs text-content-faint">
          {a.approver && (
            <>
              {a.status} by <span className="text-content-2 font-medium">{a.approver}</span>
              {a.decidedOn && <> · {formatDateTime(a.decidedOn)}</>}
            </>
          )}
          {a.rationale && <p className="mt-1 text-content-muted italic">"{a.rationale}"</p>}
        </div>
      )}
    </div>
  );
}
