"use client";

import * as React from "react";
import { GitCompareArrows, AlertCircle } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { scopeCorridors } from "@/lib/rbac";
import { formatCompact, formatMoney, formatDate, cn } from "@/lib/utils";
import type { Currency, ReconciliationItem, Settlement } from "@/lib/types";
import {
  PageHeader,
  SectionCard,
  StatCard,
  Tabs,
  Select,
  Toolbar,
  DownloadButtons,
  EmptyState,
  DataTable,
  type DataTableColumn,
  TotalCount,
  StatusPill,
  Pagination,
  usePagination,
} from "@/components/ui";

const USD: Record<Currency, number> = {
  USD: 1, GBP: 1.27, EUR: 1.09, NGN: 0.00065, MXN: 0.058, PHP: 0.0171, INR: 0.012, MAD: 0.099,
};

export default function ReconciliationPage() {
  const { data, scope, isEmpty } = useApp();
  const [tab, setTab] = React.useState<"breaks" | "settlements">("breaks");
  const [statusFilter, setStatusFilter] = React.useState("All statuses");

  const corridors = React.useMemo(() => scopeCorridors(data.corridors, scope), [data.corridors, scope]);
  const codes = new Set(corridors.map((c) => c.code));
  const inScope = (code?: string, partnerId?: string) =>
    (!code || scope.isGlobal || codes.has(code)) && (!scope.partnerId || partnerId === scope.partnerId);

  const items = data.reconciliationItems.filter((r) => inScope(r.corridorCode, r.partnerId));
  const settlements = data.settlements.filter((s) => inScope(s.corridorCode, s.partnerId));

  const filteredItems = React.useMemo(() => {
    if (statusFilter === "All statuses") return items;
    return items.filter((r) => r.status === statusFilter);
  }, [items, statusFilter]);

  const matched = items.filter((r) => r.status === "Matched").length;
  const breaks = items.filter((r) => r.status === "Break").length;
  const investigating = items.filter((r) => r.status === "Investigating").length;
  const matchRate = items.length ? Math.round((matched / items.length) * 100) : 0;
  const totalVarianceUsd = items.reduce((s, r) => s + Math.abs(r.variance) * (USD[r.currency] ?? 1), 0);
  const pendingSettlements = settlements.filter((s) => s.status === "Pending").length;

  const pgItems = usePagination(filteredItems, 12);
  const pgSettlements = usePagination(settlements, 12);
  React.useEffect(() => pgItems.resetPage(), [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const itemColumns: DataTableColumn<ReconciliationItem>[] = [
    { key: "id", label: "Item", cellClassName: "font-mono text-2xs text-content-2", render: (r) => r.id },
    {
      key: "partner",
      label: "Partner",
      cellClassName: "text-content-muted",
      render: (r) => data.partners.find((p) => p.id === r.partnerId)?.name ?? r.partnerId,
    },
    { key: "corridor", label: "Corridor", cellClassName: "font-mono text-2xs", render: (r) => r.corridorCode },
    { key: "transfer", label: "Transfer", cellClassName: "font-mono text-2xs text-content-faint", render: (r) => r.transferId ?? "—" },
    { key: "ours", label: "Our amount", align: "right", cellClassName: "num", render: (r) => formatMoney(r.ourAmount, r.currency, 0) },
    { key: "theirs", label: "Partner amount", align: "right", cellClassName: "num text-content-muted", render: (r) => formatMoney(r.partnerAmount, r.currency, 0) },
    {
      key: "variance",
      label: "Variance",
      align: "right",
      cellClassName: (r) => cn("num", r.variance === 0 ? "text-content-faint" : "text-danger"),
      render: (r) => (r.variance === 0 ? "—" : formatMoney(r.variance, r.currency, 0)),
    },
    { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
    { key: "reason", label: "Break reason", cellClassName: "text-2xs text-content-faint", render: (r) => r.breakReason ?? "—" },
    { key: "cycle", label: "Cycle", align: "right", cellClassName: "text-2xs text-content-faint", render: (r) => formatDate(r.cycleDate) },
  ];

  const settlementColumns: DataTableColumn<Settlement>[] = [
    { key: "id", label: "Settlement", cellClassName: "font-mono text-2xs text-content-2", render: (s) => s.id },
    {
      key: "partner",
      label: "Partner",
      cellClassName: "strong",
      render: (s) => data.partners.find((p) => p.id === s.partnerId)?.name ?? s.partnerId,
    },
    { key: "corridor", label: "Corridor", cellClassName: "font-mono text-2xs", render: (s) => s.corridorCode },
    { key: "cycle", label: "Cycle date", cellClassName: "text-2xs text-content-muted", render: (s) => formatDate(s.cycleDate) },
    { key: "items", label: "Items", align: "right", cellClassName: "num text-content-muted", render: (s) => s.itemCount },
    { key: "gross", label: "Gross", align: "right", cellClassName: "num", render: (s) => formatMoney(s.grossAmount, s.currency, 0) },
    { key: "commission", label: "Commission", align: "right", cellClassName: "num text-content-faint", render: (s) => formatMoney(s.commission, s.currency, 0) },
    { key: "net", label: "Net", align: "right", cellClassName: "num", render: (s) => formatMoney(s.netAmount, s.currency, 0) },
    { key: "status", label: "Status", render: (s) => <StatusPill status={s.status} /> },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Reconciliation" subtitle="End-of-day settlement, partner statements and break detection for unreconciled items">
        <DownloadButtons />
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard accent label="Match rate" value={isEmpty ? "—" : `${matchRate}%`} sub={`${matched}/${items.length} matched`} icon={<GitCompareArrows size={12} />} />
        <StatCard label="Breaks" value={isEmpty ? "—" : breaks} sub="need resolution" icon={<AlertCircle size={12} />} />
        <StatCard label="Investigating" value={isEmpty ? "—" : investigating} sub="in progress" />
        <StatCard label="Total variance" value={isEmpty ? "—" : formatCompact(totalVarianceUsd)} sub="USD equivalent" />
        <StatCard label="Settlement cycles" value={isEmpty ? "—" : settlements.length} sub="in scope" />
        <StatCard label="Pending settlements" value={isEmpty ? "—" : pendingSettlements} sub="awaiting close" />
      </div>

      <SectionCard>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "breaks", label: "Reconciliation breaks", count: isEmpty ? 0 : items.length },
              { value: "settlements", label: "Settlements", count: isEmpty ? 0 : settlements.length },
            ]}
          />
          {tab === "breaks" && (
            <Toolbar>
              <Select value={statusFilter} onChange={setStatusFilter} options={["All statuses", "Matched", "Break", "Investigating", "Resolved"]} />
              <DownloadButtons />
            </Toolbar>
          )}
        </div>

        {tab === "breaks" &&
          (isEmpty || !filteredItems.length ? (
            <EmptyState title={isEmpty ? "No reconciliation items" : "No matches"} message={isEmpty ? "Flip the seed toggle to populate the ledger." : "Adjust your filter."} />
          ) : (
            <>
              <TotalCount count={filteredItems.length} noun="items" />
              <div className="w-full overflow-x-auto">
                <DataTable columns={itemColumns} rows={pgItems.paginated} rowKey={(r) => r.id} />
              </div>
              <Pagination page={pgItems.page} totalPages={pgItems.totalPages} perPage={pgItems.perPage} totalItems={pgItems.totalItems} onPageChange={pgItems.setPage} onPerPageChange={pgItems.setPerPage} />
            </>
          ))}

        {tab === "settlements" &&
          (isEmpty || !settlements.length ? (
            <EmptyState title="No settlements" message="Flip the seed toggle to view partner statements." />
          ) : (
            <>
              <TotalCount count={settlements.length} noun="settlements" />
              <div className="w-full overflow-x-auto">
                <DataTable columns={settlementColumns} rows={pgSettlements.paginated} rowKey={(s) => s.id} />
              </div>
              <Pagination page={pgSettlements.page} totalPages={pgSettlements.totalPages} perPage={pgSettlements.perPage} totalItems={pgSettlements.totalItems} onPageChange={pgSettlements.setPage} onPerPageChange={pgSettlements.setPerPage} />
            </>
          ))}
      </SectionCard>
    </div>
  );
}
