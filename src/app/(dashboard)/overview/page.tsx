"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, ShieldAlert, Stamp, Check, X } from "lucide-react";
import { useApp } from "@/context/app-provider";
import {
  scopeCorridors,
  scopeTransfers,
  scopeFloat,
} from "@/lib/rbac";
import { volumeSeries, flowSeries, payoutMethodMix } from "@/lib/seed/reference";
import { formatCompact, formatMoney, formatDate, cn } from "@/lib/utils";
import type { Currency, Transfer, Alert, ApprovalRequest } from "@/lib/types";
import {
  PageHeader,
  SectionCard,
  SectionHeader,
  StatCard,
  Button,
  Badge,
  StatusPill,
  EmptyState,
  DateRangeFilter,
  DownloadButtons,
  AreaTrend,
  GroupedBars,
  Donut,
  RankBars,
  CHART,
} from "@/components/ui";

const USD: Record<Currency, number> = {
  USD: 1, GBP: 1.27, EUR: 1.09, NGN: 0.00065, MXN: 0.058, PHP: 0.0171, INR: 0.012, MAD: 0.099,
};
const usdEquiv = (amt: number, ccy: Currency) => amt * (USD[ccy] ?? 1);

export default function OverviewPage() {
  const { data, scope, isEmpty, can, canEdit, decideApproval, activeRole } = useApp();

  const corridors = React.useMemo(() => scopeCorridors(data.corridors, scope), [data.corridors, scope]);
  const transfers = React.useMemo(
    () => scopeTransfers(data.transfers, scope, data.corridors),
    [data.transfers, scope, data.corridors],
  );
  const floats = React.useMemo(
    () => scopeFloat(data.floatAccounts, scope, data.corridors),
    [data.floatAccounts, scope, data.corridors],
  );

  const codes = new Set(corridors.map((c) => c.code));
  const inScope = (code?: string) => !code || scope.isGlobal || codes.has(code);
  const alerts = data.alerts.filter((a) => inScope(a.corridorCode) && (!scope.partnerId || a.partnerId === scope.partnerId));
  const approvals = data.approvalRequests.filter((a) => a.status === "Pending" && inScope(a.corridorCode));

  const totalVolumeUsd = transfers.reduce((s, t) => s + usdEquiv(t.sendAmount, t.sendCurrency), 0);
  const payoutUsd = transfers
    .filter((t) => ["PaidOut", "Settled"].includes(t.status))
    .reduce((s, t) => s + usdEquiv(t.sendAmount, t.sendCurrency), 0);
  const settledCount = transfers.filter((t) => t.status === "Settled").length;
  const healthyFloat = floats.filter((f) => f.status === "Healthy").length;
  const coverage = floats.length ? Math.round((healthyFloat / floats.length) * 100) : 0;
  const openAlerts = alerts.filter((a) => !a.resolved).length;

  const canSeeApprovals = can("approvals") !== "none";
  const canDecide = canEdit("approvals");

  const topCorridors = [...corridors]
    .sort((a, b) => b.monthlyVolume - a.monthlyVolume)
    .slice(0, 6)
    .map((c) => ({ label: c.code, value: c.monthlyVolume, color: CHART.rose }));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Overview"
        subtitle={`Live money-movement across ${corridors.length} corridor${corridors.length === 1 ? "" : "s"} in scope`}
      >
        <DateRangeFilter />
        <DownloadButtons />
      </PageHeader>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard accent label="Total Volume · MTD" value={isEmpty ? "—" : formatCompact(totalVolumeUsd)} sub="USD equivalent" delta={{ value: 8.4 }} />
        <StatCard label="Payouts Disbursed" value={isEmpty ? "—" : formatCompact(payoutUsd)} sub={`${settledCount} settled`} delta={{ value: 6.1 }} />
        <StatCard label="Active Corridors" value={isEmpty ? "—" : corridors.filter((c) => c.status === "Active").length} sub={`${corridors.length} total`} />
        <StatCard label="Transfers" value={isEmpty ? "—" : transfers.length.toLocaleString()} sub="in scope" delta={{ value: 12.3 }} />
        <StatCard label="Pending Approvals" value={isEmpty ? "—" : approvals.length} sub="maker-checker" icon={<Stamp size={13} />} />
        <StatCard label="Liquidity Coverage" value={isEmpty ? "—" : `${coverage}%`} sub={`${healthyFloat}/${floats.length} healthy`} delta={{ value: -3.2, positiveIsGood: true }} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <SectionCard className="xl:col-span-2">
          <SectionHeader
            title="Transfer volume"
            caption="Value moved & transfer count, trailing 12 months"
            action={<Badge tone="success" dot>+8.4% MoM</Badge>}
          />
          {isEmpty ? (
            <EmptyState title="No volume yet" message="Populate seed data to see the volume trend." />
          ) : (
            <AreaTrend data={volumeSeries} dataKey="value" color={CHART.rose} height={210} yFormatter={(v) => `$${v}M`} />
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Payout methods" caption="Share of disbursements" />
          {isEmpty ? (
            <EmptyState title="No payouts yet" />
          ) : (
            <>
              <Donut
                data={payoutMethodMix}
                colors={[CHART.rose, CHART.info, CHART.mint]}
                centerValue="52%"
                centerLabel="Bank"
              />
              <div className="mt-2 space-y-1">
                {payoutMethodMix.map((m, i) => (
                  <div key={m.key} className="flex items-center justify-between text-2xs">
                    <span className="flex items-center gap-1.5 text-content-muted">
                      <span className="h-2 w-2 rounded-full" style={{ background: [CHART.rose, CHART.info, CHART.mint][i] }} />
                      {m.name}
                    </span>
                    <span className="tabular font-medium text-content-2">{m.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <SectionCard className="xl:col-span-2">
          <SectionHeader title="Inflow vs outflow" caption="Funding received against payouts + commissions ($M)" />
          {isEmpty ? (
            <EmptyState title="No flow data" />
          ) : (
            <GroupedBars
              data={flowSeries}
              xKey="date"
              height={210}
              yFormatter={(v) => `$${v}M`}
              series={[
                { key: "inflow", color: CHART.rose, label: "Inflow" },
                { key: "outflow", color: CHART.green, label: "Outflow" },
              ]}
            />
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Top corridors" caption="By monthly volume" action={<TrendingUp size={13} className="text-content-faint" />} />
          {isEmpty || !topCorridors.length ? (
            <EmptyState title="No corridors in scope" />
          ) : (
            <div className="pt-1">
              <RankBars items={topCorridors} valueFormatter={(v) => formatCompact(v)} />
            </div>
          )}
        </SectionCard>
      </div>

      {/* Approvals + Alerts */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {canSeeApprovals && (
          <SectionCard className="xl:col-span-2">
            <SectionHeader
              title="Pending approvals"
              caption={canDecide ? "Dual-control queue — second approver required" : "View only for your role"}
              action={
                <Link href="/approvals" className="flex items-center gap-1 text-2xs font-medium text-accent-hi hover:underline">
                  Open queue <ArrowUpRight size={11} />
                </Link>
              }
            />
            {isEmpty || !approvals.length ? (
              <EmptyState title="Queue clear" message="No pending approvals in scope." icon={<Stamp size={20} strokeWidth={1.5} />} />
            ) : (
              <div className="divide-y divide-hairline-faint">
                {approvals.slice(0, 4).map((a) => (
                  <ApprovalRow key={a.id} approval={a} canDecide={canDecide} onDecide={decideApproval} />
                ))}
              </div>
            )}
          </SectionCard>
        )}

        <SectionCard className={cn(!canSeeApprovals && "xl:col-span-3")}>
          <SectionHeader
            title="Alerts"
            caption={`${openAlerts} unresolved`}
            action={<ShieldAlert size={13} className="text-content-faint" />}
          />
          {isEmpty || !alerts.length ? (
            <EmptyState title="No active alerts" icon={<ShieldAlert size={20} strokeWidth={1.5} />} />
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 5).map((a) => (
                <AlertRow key={a.id} alert={a} />
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Recent transfers */}
      <SectionCard>
        <SectionHeader
          title="Recent transfers"
          caption="Most recent activity in scope"
          action={
            <Link href="/transfers" className="flex items-center gap-1 text-2xs font-medium text-accent-hi hover:underline">
              View all <ArrowUpRight size={11} />
            </Link>
          }
        />
        {isEmpty || !transfers.length ? (
          <EmptyState title="No transfers yet" message="Flip the seed toggle to populate demo activity." />
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Sender</th>
                  <th>Corridor</th>
                  <th className="text-right">Send</th>
                  <th className="text-right">Receive</th>
                  <th>Rail</th>
                  <th>Status</th>
                  <th className="text-right">Created</th>
                </tr>
              </thead>
              <tbody>
                {transfers.slice(0, 7).map((t) => (
                  <tr key={t.id}>
                    <td className="font-mono text-2xs text-content-2">{t.id}</td>
                    <td className="strong">{t.senderName}</td>
                    <td className="font-mono text-2xs">{t.corridorCode}</td>
                    <td className="num text-right">{formatMoney(t.sendAmount, t.sendCurrency)}</td>
                    <td className="num text-right text-content-muted">{formatMoney(t.receiveAmount, t.receiveCurrency, 0)}</td>
                    <td><span className="text-2xs text-content-muted">{t.rail}</span></td>
                    <td><StatusPill status={t.status} /></td>
                    <td className="text-right text-2xs text-content-faint">{formatDate(t.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function ApprovalRow({
  approval,
  canDecide,
  onDecide,
}: {
  approval: ApprovalRequest;
  canDecide: boolean;
  onDecide: (id: string, decision: "Approved" | "Rejected", rationale?: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge tone="accent">{approval.type}</Badge>
          <span className="font-mono text-3xs text-content-faint">{approval.id}</span>
        </div>
        <p className="mt-1 truncate text-xs text-content-2">{approval.summary}</p>
        <p className="mt-0.5 text-3xs text-content-faint">
          Requested by {approval.requestedBy} · {formatDate(approval.requestedOn)}
        </p>
      </div>
      {canDecide ? (
        <div className="flex shrink-0 items-center gap-1.5">
          <Button size="xs" variant="danger-outline" onClick={() => onDecide(approval.id, "Rejected")}>
            <X size={11} /> Reject
          </Button>
          <Button size="xs" variant="accent" onClick={() => onDecide(approval.id, "Approved")}>
            <Check size={11} /> Approve
          </Button>
        </div>
      ) : (
        <Badge tone="warning">Pending</Badge>
      )}
    </div>
  );
}

function AlertRow({ alert }: { alert: Alert }) {
  const tone = alert.severity === "Critical" ? "danger" : alert.severity === "High" ? "warning" : "info";
  return (
    <div className="flex items-start gap-2.5 rounded-panel border border-hairline-faint bg-surface-1 px-2.5 py-2">
      <span className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", tone === "danger" ? "bg-danger" : tone === "warning" ? "bg-warning" : "bg-info")} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium text-content-2">{alert.title}</p>
          <Badge tone={tone as "danger" | "warning" | "info"}>{alert.type}</Badge>
        </div>
        <p className="mt-0.5 line-clamp-2 text-3xs text-content-faint">{alert.detail}</p>
      </div>
    </div>
  );
}
