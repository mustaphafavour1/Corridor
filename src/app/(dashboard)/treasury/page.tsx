"use client";

import * as React from "react";
import { AlertTriangle, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { scopeFloat, scopeCorridors } from "@/lib/rbac";
import { formatCompact, formatMoney, formatDate, formatDateTime, cn } from "@/lib/utils";
import type { Currency, FloatAccount, LedgerEntry } from "@/lib/types";
import {
  PageHeader,
  SectionCard,
  SectionHeader,
  StatCard,
  Badge,
  StatusPill,
  Meter,
  Button,
  Tabs,
  DownloadButtons,
  EmptyState,
  DataTable,
  type DataTableColumn,
  TotalCount,
  Pagination,
  usePagination,
} from "@/components/ui";

const USD: Record<Currency, number> = {
  USD: 1, GBP: 1.27, EUR: 1.09, NGN: 0.00065, MXN: 0.058, PHP: 0.0171, INR: 0.012, MAD: 0.099,
};

function floatTone(status: FloatAccount["status"]) {
  return status === "Healthy" ? "success" : status === "Low" ? "warning" : "danger";
}

export default function TreasuryPage() {
  const { data, scope, isEmpty, canEdit } = useApp();
  const [tab, setTab] = React.useState<"float" | "exposure" | "ledger">("float");

  const corridors = React.useMemo(() => scopeCorridors(data.corridors, scope), [data.corridors, scope]);
  const floats = React.useMemo(() => scopeFloat(data.floatAccounts, scope, data.corridors), [data.floatAccounts, scope, data.corridors]);

  const scopedCurrencies = new Set<Currency>();
  corridors.forEach((c) => {
    scopedCurrencies.add(c.sendCurrency);
    scopedCurrencies.add(c.receiveCurrency);
  });
  const exposures = scope.isGlobal ? data.exposures : data.exposures.filter((e) => scopedCurrencies.has(e.currency));

  // Nostro/ledger is an HQ-internal book — only shown at global scope.
  const ledger = scope.isGlobal ? data.ledgerEntries : [];

  const totalFloatUsd = floats.reduce((s, f) => s + f.balance * (USD[f.currency] ?? 1), 0);
  const healthyCount = floats.filter((f) => f.status === "Healthy").length;
  const coverage = floats.length ? Math.round((healthyCount / floats.length) * 100) : 0;
  const atRisk = floats.filter((f) => f.status !== "Healthy");
  const avgHedge = exposures.length ? Math.round(exposures.reduce((s, e) => s + e.hedgedPct, 0) / exposures.length) : 0;
  const netExposureUsd = exposures.reduce((s, e) => s + e.usdEquivalent, 0);
  const latestLedgerBalance = ledger.length ? ledger[ledger.length - 1].balance : 0;

  const canRequestTopUp = canEdit("treasury");

  const pgFloat = usePagination(floats, 12);
  const pgLedger = usePagination(ledger, 15);

  const floatColumns: DataTableColumn<FloatAccount>[] = [
    { key: "id", label: "Account", cellClassName: "font-mono text-2xs text-content-2", render: (f) => f.id },
    {
      key: "partner",
      label: "Partner",
      cellClassName: "text-content-muted",
      render: (f) => data.partners.find((p) => p.id === f.partnerId)?.name ?? f.partnerId,
    },
    { key: "corridor", label: "Corridor", cellClassName: "font-mono text-2xs", render: (f) => f.corridorCode },
    { key: "balance", label: "Balance", align: "right", cellClassName: "num", render: (f) => formatMoney(f.balance, f.currency, 0) },
    { key: "target", label: "Target", align: "right", cellClassName: "num text-content-muted", render: (f) => formatMoney(f.targetBalance, f.currency, 0) },
    {
      key: "utilisation",
      label: "Utilisation",
      render: (f) => (
        <div className="flex items-center gap-1.5">
          <Meter value={f.utilisation} tone={floatTone(f.status)} className="w-14" />
          <span className="tabular text-2xs text-content-muted">{f.utilisation}%</span>
        </div>
      ),
    },
    { key: "status", label: "Status", render: (f) => <StatusPill status={f.status} /> },
    { key: "lastTopUp", label: "Last top-up", align: "right", cellClassName: "text-2xs text-content-faint", render: (f) => formatDate(f.lastToppedUp) },
  ];

  const exposureColumns: DataTableColumn<(typeof exposures)[number]>[] = [
    { key: "currency", label: "Currency", cellClassName: "font-mono font-medium text-content-2", render: (e) => e.currency },
    {
      key: "net",
      label: "Net position",
      align: "right",
      cellClassName: (e) => cn("num", e.netPosition < 0 ? "text-danger" : "text-success"),
      render: (e) => e.netPosition.toLocaleString(),
    },
    { key: "usd", label: "USD equivalent", align: "right", cellClassName: "num", render: (e) => formatMoney(e.usdEquivalent, "USD", 0) },
    {
      key: "hedged",
      label: "Hedged",
      render: (e) => (
        <div className="flex items-center gap-1.5">
          <Meter value={e.hedgedPct} tone={e.hedgedPct >= 80 ? "success" : "warning"} className="w-12" />
          <span className="tabular text-2xs text-content-muted">{e.hedgedPct}%</span>
        </div>
      ),
    },
    { key: "limit", label: "Limit (USD)", align: "right", cellClassName: "num text-content-muted", render: (e) => formatCompact(e.limit) },
  ];

  const ledgerColumns: DataTableColumn<LedgerEntry>[] = [
    { key: "date", label: "Date", cellClassName: "text-2xs text-content-muted", render: (l) => formatDateTime(l.date) },
    { key: "account", label: "Account", cellClassName: "strong", render: (l) => l.account },
    { key: "type", label: "Type", render: (l) => <Badge tone="neutral">{l.type}</Badge> },
    {
      key: "direction",
      label: "Direction",
      render: (l) => (
        <span className={cn("inline-flex items-center gap-1 text-2xs", l.direction === "credit" ? "text-success" : "text-content-muted")}>
          {l.direction === "credit" ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {l.direction === "credit" ? "Credit" : "Debit"}
        </span>
      ),
    },
    { key: "amount", label: "Amount", align: "right", cellClassName: "num", render: (l) => formatMoney(l.amount, l.currency) },
    { key: "balance", label: "Running balance", align: "right", cellClassName: "num text-content-muted", render: (l) => formatMoney(l.balance, l.currency, 0) },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Treasury & Liquidity" subtitle="Partner float health, currency exposure and nostro-style ledger balances">
        <DownloadButtons />
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard accent label="Total float" value={isEmpty ? "—" : formatCompact(totalFloatUsd)} sub="USD equivalent" icon={<Wallet size={12} />} />
        <StatCard label="Liquidity coverage" value={isEmpty ? "—" : `${coverage}%`} sub={`${healthyCount}/${floats.length} healthy`} />
        <StatCard label="At-risk accounts" value={isEmpty ? "—" : atRisk.length} sub="low / critical" icon={<AlertTriangle size={12} />} />
        <StatCard label="Avg hedged coverage" value={isEmpty ? "—" : `${avgHedge}%`} sub="by currency" />
        <StatCard label="Net FX exposure" value={isEmpty ? "—" : formatCompact(netExposureUsd)} sub="USD equivalent" />
        <StatCard label="Nostro balance" value={isEmpty || !scope.isGlobal ? "—" : formatCompact(latestLedgerBalance)} sub={scope.isGlobal ? "latest posting" : "HQ only"} />
      </div>

      {!isEmpty && atRisk.length > 0 && (
        <SectionCard>
          <SectionHeader
            title={<span className="flex items-center gap-1.5"><AlertTriangle size={13} className="text-warning" /> Low-liquidity — rebalancing suggested</span>}
            caption="Float below threshold on these corridors. Pre-funding requires maker-checker approval."
          />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
            {atRisk.slice(0, 6).map((f) => {
              const partner = data.partners.find((p) => p.id === f.partnerId);
              const topUp = Math.max(0, f.targetBalance - f.balance);
              return (
                <div key={f.id} className="rounded-panel border border-hairline bg-surface-1 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-content-2">{partner?.name ?? f.partnerId}</span>
                    <StatusPill status={f.status} />
                  </div>
                  <p className="mt-0.5 font-mono text-3xs text-content-faint">{f.corridorCode} · {f.currency}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Meter value={f.utilisation} tone={floatTone(f.status)} className="flex-1" />
                    <span className="tabular text-2xs text-content-muted">{f.utilisation}%</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-3xs text-content-faint">Suggest top-up <span className="font-medium text-content-2 tabular">{formatMoney(topUp, f.currency, 0)}</span></span>
                    {canRequestTopUp && <Button size="xs" variant="subtle">Request</Button>}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      <SectionCard>
        <Tabs
          className="mb-3"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "float", label: "Float & liquidity", count: isEmpty ? 0 : floats.length },
            { value: "exposure", label: "Currency exposure", count: isEmpty ? 0 : exposures.length },
            ...(scope.isGlobal ? [{ value: "ledger" as const, label: "Nostro / ledger", count: isEmpty ? 0 : ledger.length }] : []),
          ]}
        />

        {tab === "float" &&
          (isEmpty || !floats.length ? (
            <EmptyState title="No float accounts" message="Flip the seed toggle to view liquidity." />
          ) : (
            <>
              <TotalCount count={floats.length} noun="float accounts" />
              <div className="w-full overflow-x-auto">
                <DataTable columns={floatColumns} rows={pgFloat.paginated} rowKey={(f) => f.id} />
              </div>
              <Pagination page={pgFloat.page} totalPages={pgFloat.totalPages} perPage={pgFloat.perPage} totalItems={pgFloat.totalItems} onPageChange={pgFloat.setPage} onPerPageChange={pgFloat.setPerPage} />
            </>
          ))}

        {tab === "exposure" &&
          (isEmpty || !exposures.length ? (
            <EmptyState title="No exposure data" message="Flip the seed toggle to view currency exposure." />
          ) : (
            <div className="w-full overflow-x-auto">
              <DataTable columns={exposureColumns} rows={exposures} rowKey={(e) => e.currency} />
            </div>
          ))}

        {tab === "ledger" &&
          scope.isGlobal &&
          (isEmpty || !ledger.length ? (
            <EmptyState title="No ledger activity" message="Flip the seed toggle to view postings." />
          ) : (
            <>
              <TotalCount count={ledger.length} noun="postings" />
              <div className="w-full overflow-x-auto">
                <DataTable columns={ledgerColumns} rows={pgLedger.paginated} rowKey={(l) => l.id} />
              </div>
              <Pagination page={pgLedger.page} totalPages={pgLedger.totalPages} perPage={pgLedger.perPage} totalItems={pgLedger.totalItems} onPageChange={pgLedger.setPage} onPerPageChange={pgLedger.setPerPage} />
            </>
          ))}
      </SectionCard>
    </div>
  );
}
