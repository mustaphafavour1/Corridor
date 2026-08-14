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
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Corridor</th>
                    <th>Currencies</th>
                    <th>Rails</th>
                    <th className="text-right">Fee</th>
                    <th className="text-right">Spread</th>
                    <th className="text-right">Limits</th>
                    <th className="text-right">SLA</th>
                    <th className="text-right">Partners</th>
                    <th className="text-right">Volume</th>
                    <th>Success</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCorridors.map((c) => (
                    <tr key={c.code} className="cursor-pointer" onClick={() => setSelected(c)}>
                      <td>
                        <div className="flex items-center gap-1.5 font-medium text-content-2">
                          <span className="font-mono text-2xs">{c.sendCountry}</span>
                          <ArrowRight size={11} className="text-content-faint" />
                          <span className="font-mono text-2xs">{c.receiveCountry}</span>
                          <span className="ml-1 text-3xs text-content-faint">{c.code}</span>
                        </div>
                        <span className="text-3xs text-content-faint">{c.sendCountryName} → {c.receiveCountryName}</span>
                      </td>
                      <td className="font-mono text-2xs text-content-muted">{c.sendCurrency}/{c.receiveCurrency}</td>
                      <td>
                        <div className="flex gap-1">
                          {c.rails.map((r) => (
                            <span key={r} className="rounded bg-surface-3 px-1 py-[1px] text-3xs text-content-muted">{r}</span>
                          ))}
                        </div>
                      </td>
                      <td className="num text-right">{formatPct(c.feePct, 2)}</td>
                      <td className="num text-right text-content-muted">{c.fxSpreadBps}bps</td>
                      <td className="num text-right text-content-muted text-2xs">{formatCompact(c.minAmount, c.sendCurrency)}–{formatCompact(c.maxAmount, c.sendCurrency)}</td>
                      <td className="num text-right text-content-muted">{c.settlementSlaHrs}h</td>
                      <td className="num text-right">{c.partnerIds.length}</td>
                      <td className="num text-right">{formatCompact(c.monthlyVolume)}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Meter value={c.successRate} tone={successTone(c.successRate)} className="w-10" />
                          <span className="tabular text-2xs text-content-muted">{formatPct(c.successRate)}</span>
                        </div>
                      </td>
                      <td><StatusPill status={c.status} /></td>
                      <td className="text-content-dim"><ChevronRight size={13} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

        {/* FX */}
        {tab === "fx" &&
          (isEmpty || !fxRates.length ? (
            <EmptyState title="No FX rates" message="Flip the seed toggle to see live vs locked pricing." />
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th className="text-right">Mid</th>
                    <th className="text-right">Live</th>
                    <th className="text-right">Locked</th>
                    <th className="text-right">Spread</th>
                    <th className="text-right">24h</th>
                    <th className="text-right">Updated</th>
                    <th>Rate lock</th>
                  </tr>
                </thead>
                <tbody>
                  {fxRates.map((f) => (
                    <FxRow key={f.id} fx={f} canEdit={canEdit("corridors")} onToggle={() => toggleFxLock(f.id)} />
                  ))}
                </tbody>
              </table>
            </div>
          ))}

        {/* EXPOSURE */}
        {tab === "exposure" &&
          (isEmpty || !exposures.length ? (
            <EmptyState title="No exposure data" message="Flip the seed toggle to view currency exposure." />
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Currency</th>
                    <th className="text-right">Net position</th>
                    <th className="text-right">USD equivalent</th>
                    <th>Hedged</th>
                    <th className="text-right">Limit (USD)</th>
                    <th>Utilisation</th>
                  </tr>
                </thead>
                <tbody>
                  {exposures.map((e) => {
                    const util = Math.min(100, Math.round((Math.abs(e.usdEquivalent) / e.limit) * 100));
                    return (
                      <tr key={e.currency}>
                        <td className="font-mono font-medium text-content-2">{e.currency}</td>
                        <td className={cn("num text-right", e.netPosition < 0 ? "text-danger" : "text-success")}>
                          {e.netPosition.toLocaleString()}
                        </td>
                        <td className="num text-right">{formatMoney(e.usdEquivalent, "USD", 0)}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <Meter value={e.hedgedPct} tone={e.hedgedPct >= 80 ? "success" : "warning"} className="w-12" />
                            <span className="tabular text-2xs text-content-muted">{e.hedgedPct}%</span>
                          </div>
                        </td>
                        <td className="num text-right text-content-muted">{formatCompact(e.limit)}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <Meter value={util} tone={util >= 80 ? "danger" : util >= 60 ? "warning" : "brand"} className="w-12" />
                            <span className="tabular text-2xs text-content-muted">{util}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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

function FxRow({ fx, canEdit, onToggle }: { fx: FxRate; canEdit: boolean; onToggle: () => void }) {
  return (
    <tr>
      <td className="font-mono font-medium text-content-2">{fx.pair}</td>
      <td className="num text-right">{fx.midRate.toLocaleString()}</td>
      <td className="num text-right text-content-muted">{fx.liveRate.toLocaleString()}</td>
      <td className="num text-right text-content-muted">{fx.lockedRate.toLocaleString()}</td>
      <td className="num text-right text-content-faint">{fx.spreadBps}bps</td>
      <td className={cn("num text-right", fx.change24h >= 0 ? "text-success" : "text-danger")}>
        {fx.change24h >= 0 ? "+" : ""}{fx.change24h.toFixed(2)}%
      </td>
      <td className="text-right text-3xs text-content-faint">{formatDateTime(fx.updatedAt)}</td>
      <td>
        <div className="flex items-center gap-2">
          <Switch checked={fx.locked} onCheckedChange={onToggle} />
          <span className="inline-flex items-center gap-1 text-2xs text-content-muted">
            {fx.locked ? <Lock size={10} className="text-accent" /> : <Unlock size={10} className="text-content-faint" />}
            {fx.locked ? "Locked" : "Live"}
          </span>
        </div>
      </td>
    </tr>
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
