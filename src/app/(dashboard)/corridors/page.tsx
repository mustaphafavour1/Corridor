"use client";

import * as React from "react";
import { Plus, ArrowRight, Lock, Unlock, ChevronRight } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { scopeCorridors } from "@/lib/rbac";
import { formatCompact, formatMoney, formatPct, formatDateTime, cn } from "@/lib/utils";
import type { Corridor, FxRate, Currency } from "@/lib/types";
import {
  PageHeader,
  SectionCard,
  StatCard,
  Badge,
  StatusPill,
  Meter,
  Button,
  SearchInput,
  Select,
  Switch,
  Tabs,
  Toolbar,
  DownloadButtons,
  EmptyState,
  Sheet,
  DetailRow,
  DescriptionList,
  DataTable,
  type DataTableColumn,
} from "@/components/ui";

function successTone(rate: number) {
  return rate >= 98 ? "success" : rate >= 96 ? "warning" : "danger";
}

export default function CorridorsPage() {
  const { data, scope, isEmpty, canEdit, toggleFxLock } = useApp();
  const [tab, setTab] = React.useState<"matrix" | "fx" | "exposure">("matrix");
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All statuses");
  const [selected, setSelected] = React.useState<Corridor | null>(null);

  const corridors = React.useMemo(() => scopeCorridors(data.corridors, scope), [data.corridors, scope]);

  // FX + exposure narrowed to currencies present in scope (unless global).
  const scopedCurrencies = new Set<Currency>();
  corridors.forEach((c) => {
    scopedCurrencies.add(c.sendCurrency);
    scopedCurrencies.add(c.receiveCurrency);
  });
  const fxRates = scope.isGlobal
    ? data.fxRates
    : data.fxRates.filter((f) => scopedCurrencies.has(f.base) && scopedCurrencies.has(f.quote));
  const exposures = scope.isGlobal
    ? data.exposures
    : data.exposures.filter((e) => scopedCurrencies.has(e.currency));

  const filteredCorridors = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return corridors.filter((c) => {
      const matchQ = !q || c.code.toLowerCase().includes(q) || c.sendCountryName.toLowerCase().includes(q) || c.receiveCountryName.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All statuses" || c.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [corridors, search, statusFilter]);

  const activeCount = corridors.filter((c) => c.status === "Active").length;
  const totalVolume = corridors.reduce((s, c) => s + c.monthlyVolume, 0);
  const avgFee = corridors.length ? corridors.reduce((s, c) => s + c.feePct, 0) / corridors.length : 0;
  const avgSpread = corridors.length ? Math.round(corridors.reduce((s, c) => s + c.fxSpreadBps, 0) / corridors.length) : 0;
  const avgSuccess = corridors.length ? corridors.reduce((s, c) => s + c.successRate, 0) / corridors.length : 0;
  const lockedCount = fxRates.filter((f) => f.locked).length;

  const matrixColumns: DataTableColumn<Corridor>[] = [
    {
      key: "corridor",
      label: "Corridor",
      render: (c) => (
        <>
          <div className="flex items-center gap-1.5 font-medium text-content-2">
            <span className="font-mono text-2xs">{c.sendCountry}</span>
            <ArrowRight size={11} className="text-content-faint" />
            <span className="font-mono text-2xs">{c.receiveCountry}</span>
            <span className="ml-1 text-3xs text-content-faint">{c.code}</span>
          </div>
          <span className="text-3xs text-content-faint">{c.sendCountryName} → {c.receiveCountryName}</span>
        </>
      ),
    },
    { key: "currencies", label: "Currencies", cellClassName: "font-mono text-2xs text-content-muted", render: (c) => `${c.sendCurrency}/${c.receiveCurrency}` },
    {
      key: "rails",
      label: "Rails",
      render: (c) => (
        <div className="flex gap-1">
          {c.rails.map((r) => (
            <span key={r} className="rounded bg-surface-3 px-1 py-[1px] text-3xs text-content-muted">{r}</span>
          ))}
        </div>
      ),
    },
    { key: "fee", label: "Fee", align: "right", cellClassName: "num", render: (c) => formatPct(c.feePct, 2) },
    { key: "spread", label: "Spread", align: "right", cellClassName: "num text-content-muted", render: (c) => `${c.fxSpreadBps}bps` },
    { key: "limits", label: "Limits", align: "right", cellClassName: "num text-content-muted text-2xs", render: (c) => `${formatCompact(c.minAmount, c.sendCurrency)}–${formatCompact(c.maxAmount, c.sendCurrency)}` },
    { key: "sla", label: "SLA", align: "right", cellClassName: "num text-content-muted", render: (c) => `${c.settlementSlaHrs}h` },
    { key: "partners", label: "Partners", align: "right", cellClassName: "num", render: (c) => c.partnerIds.length },
    { key: "volume", label: "Volume", align: "right", cellClassName: "num", render: (c) => formatCompact(c.monthlyVolume) },
    {
      key: "success",
      label: "Success",
      render: (c) => (
        <div className="flex items-center gap-1.5">
          <Meter value={c.successRate} tone={successTone(c.successRate)} className="w-10" />
          <span className="tabular text-2xs text-content-muted">{formatPct(c.successRate)}</span>
        </div>
      ),
    },
    { key: "status", label: "Status", render: (c) => <StatusPill status={c.status} /> },
    { key: "chevron", label: "", cellClassName: "text-content-dim", render: () => <ChevronRight size={13} /> },
  ];

  const fxColumns: DataTableColumn<FxRate>[] = [
    { key: "pair", label: "Pair", cellClassName: "font-mono font-medium text-content-2", render: (f) => f.pair },
    { key: "mid", label: "Mid", align: "right", cellClassName: "num", render: (f) => f.midRate.toLocaleString() },
    { key: "live", label: "Live", align: "right", cellClassName: "num text-content-muted", render: (f) => f.liveRate.toLocaleString() },
    { key: "locked", label: "Locked", align: "right", cellClassName: "num text-content-muted", render: (f) => f.lockedRate.toLocaleString() },
    { key: "spread", label: "Spread", align: "right", cellClassName: "num text-content-faint", render: (f) => `${f.spreadBps}bps` },
    {
      key: "change",
      label: "24h",
      align: "right",
      cellClassName: (f) => cn("num", f.change24h >= 0 ? "text-success" : "text-danger"),
      render: (f) => `${f.change24h >= 0 ? "+" : ""}${f.change24h.toFixed(2)}%`,
    },
    { key: "updated", label: "Updated", align: "right", cellClassName: "text-3xs text-content-faint", render: (f) => formatDateTime(f.updatedAt) },
    {
      key: "lock",
      label: "Rate lock",
      render: (f) => (
        <div className="flex items-center gap-2">
          <Switch checked={f.locked} onCheckedChange={() => toggleFxLock(f.id)} />
          <span className="inline-flex items-center gap-1 text-2xs text-content-muted">
            {f.locked ? <Lock size={10} className="text-accent" /> : <Unlock size={10} className="text-content-faint" />}
            {f.locked ? "Locked" : "Live"}
          </span>
        </div>
      ),
    },
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
    {
      key: "utilisation",
      label: "Utilisation",
      render: (e) => {
        const util = Math.min(100, Math.round((Math.abs(e.usdEquivalent) / e.limit) * 100));
        return (
          <div className="flex items-center gap-1.5">
            <Meter value={util} tone={util >= 80 ? "danger" : util >= 60 ? "warning" : "brand"} className="w-12" />
            <span className="tabular text-2xs text-content-muted">{util}%</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Corridors & FX" subtitle="Send→receive country pairs, per-corridor pricing, routing and currency exposure">
        <DownloadButtons />
        {canEdit("corridors") && (
          <Button variant="accent" size="sm">
            <Plus size={12} /> New corridor
          </Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard accent label="Active corridors" value={isEmpty ? "—" : activeCount} sub={`${corridors.length} total`} />
        <StatCard label="Monthly volume" value={isEmpty ? "—" : formatCompact(totalVolume)} sub="across scope" />
        <StatCard label="Avg fee" value={isEmpty ? "—" : formatPct(avgFee, 2)} sub="blended" />
        <StatCard label="Avg FX spread" value={isEmpty ? "—" : `${avgSpread}bps`} sub="mid vs offered" />
        <StatCard label="Avg success rate" value={isEmpty ? "—" : formatPct(avgSuccess)} sub="payout completion" />
        <StatCard label="Locked rates" value={isEmpty ? "—" : lockedCount} sub={`${fxRates.length} pairs`} />
      </div>

      <SectionCard>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "matrix", label: "Corridor matrix", count: isEmpty ? 0 : corridors.length },
              { value: "fx", label: "FX rates", count: isEmpty ? 0 : fxRates.length },
              { value: "exposure", label: "Exposure", count: isEmpty ? 0 : exposures.length },
            ]}
          />
          {tab === "matrix" && (
            <Toolbar>
              <div className="w-52">
                <SearchInput value={search} onChange={setSearch} placeholder="Search corridor or country" />
              </div>
              <Select value={statusFilter} onChange={setStatusFilter} options={["All statuses", "Active", "Paused", "Onboarding"]} />
            </Toolbar>
          )}
        </div>

        {/* MATRIX */}
        {tab === "matrix" &&
          (isEmpty || !filteredCorridors.length ? (
            <EmptyState title={isEmpty ? "No corridors" : "No matches"} message={isEmpty ? "Flip the seed toggle to populate the matrix." : "Adjust your search or filters."} />
          ) : (
            <div className="w-full overflow-x-auto">
              <DataTable columns={matrixColumns} rows={filteredCorridors} rowKey={(c) => c.code} onRowClick={setSelected} />
            </div>
          ))}

        {/* FX */}
        {tab === "fx" &&
          (isEmpty || !fxRates.length ? (
            <EmptyState title="No FX rates" message="Flip the seed toggle to see live vs locked pricing." />
          ) : (
            <div className="w-full overflow-x-auto">
              <DataTable columns={fxColumns} rows={fxRates} rowKey={(f) => f.id} />
            </div>
          ))}

        {/* EXPOSURE */}
        {tab === "exposure" &&
          (isEmpty || !exposures.length ? (
            <EmptyState title="No exposure data" message="Flip the seed toggle to view currency exposure." />
          ) : (
            <div className="w-full overflow-x-auto">
              <DataTable columns={exposureColumns} rows={exposures} rowKey={(e) => e.currency} />
            </div>
          ))}
      </SectionCard>

      <CorridorSheet
        corridor={selected}
        onClose={() => setSelected(null)}
        partners={data.partners}
        feeSchedules={data.feeSchedules}
      />
    </div>
  );
}

function CorridorSheet({
  corridor,
  onClose,
  partners,
  feeSchedules,
}: {
  corridor: Corridor | null;
  onClose: () => void;
  partners: { id: string; name: string; successRate: number }[];
  feeSchedules: { corridorCode: string; serviceCode: string; fixedFee: number; pctFee: number; currency: Currency; minFee: number; maxFee: number }[];
}) {
  const c = corridor;
  const routed = c ? partners.filter((p) => c.partnerIds.includes(p.id)) : [];
  const fees = c ? feeSchedules.filter((f) => f.corridorCode === c.code) : [];
  return (
    <Sheet open={!!c} onOpenChange={(o) => !o && onClose()} title={c ? `${c.sendCountryName} → ${c.receiveCountryName}` : ""} description={c?.code}>
      {c && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <StatusPill status={c.status} />
            <span className="font-mono text-2xs text-content-muted">{c.sendCurrency}/{c.receiveCurrency}</span>
          </div>

          <div>
            <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-content-faint">Rules & pricing</p>
            <DescriptionList>
              <DetailRow label="Fee" value={formatPct(c.feePct, 2)} mono />
              <DetailRow label="FX spread" value={`${c.fxSpreadBps} bps`} mono />
              <DetailRow label="Limits" value={`${formatMoney(c.minAmount, c.sendCurrency, 0)} – ${formatMoney(c.maxAmount, c.sendCurrency, 0)}`} mono />
              <DetailRow label="Settlement SLA" value={`${c.settlementSlaHrs} hours`} />
              <DetailRow label="Rails" value={c.rails.join(" · ")} />
              <DetailRow label="Monthly volume" value={formatCompact(c.monthlyVolume)} mono />
              <DetailRow label="Success rate" value={formatPct(c.successRate)} mono />
            </DescriptionList>
          </div>

          <div>
            <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-content-faint">Routing partners · {routed.length}</p>
            <div className="space-y-1.5">
              {routed.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-panel border border-hairline-faint bg-surface-1 px-2.5 py-2">
                  <div>
                    <p className="text-xs font-medium text-content-2">{p.name}</p>
                    <p className="font-mono text-3xs text-content-faint">{p.id}</p>
                  </div>
                  <Badge tone={successTone(p.successRate)}>{formatPct(p.successRate)}</Badge>
                </div>
              ))}
            </div>
          </div>

          {fees.length > 0 && (
            <div>
              <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-content-faint">Fee schedule</p>
              <DescriptionList>
                {fees.map((f, i) => (
                  <DetailRow
                    key={i}
                    label={f.serviceCode}
                    value={`${formatMoney(f.fixedFee, f.currency)} + ${f.pctFee}% · ${formatMoney(f.minFee, f.currency)}–${formatMoney(f.maxFee, f.currency)}`}
                    mono
                  />
                ))}
              </DescriptionList>
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}
