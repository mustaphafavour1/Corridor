"use client";

import * as React from "react";
import { Plus, ChevronRight, AlertTriangle, Zap, Gauge, TrendingUp } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { scopePartners, scopeFloat } from "@/lib/rbac";
import { formatCompact, formatMoney, formatPct, formatDate, cn } from "@/lib/utils";
import type { PayoutPartner, FloatAccount, Currency } from "@/lib/types";
import {
  PageHeader,
  SectionCard,
  SectionHeader,
  StatCard,
  Badge,
  StatusPill,
  Meter,
  Button,
  SearchInput,
  Select,
  Tabs,
  Toolbar,
  DownloadButtons,
  EmptyState,
  Pagination,
  usePagination,
  Sheet,
  DetailRow,
  DescriptionList,
  TotalCount,
  DataTable,
  type DataTableColumn,
} from "@/components/ui";

const USD: Record<Currency, number> = {
  USD: 1, GBP: 1.27, EUR: 1.09, NGN: 0.00065, MXN: 0.058, PHP: 0.0171, INR: 0.012, MAD: 0.099,
};

function successTone(rate: number) {
  return rate >= 98 ? "success" : rate >= 96 ? "warning" : "danger";
}
function floatTone(status: FloatAccount["status"]) {
  return status === "Healthy" ? "success" : status === "Low" ? "warning" : "danger";
}

export default function PartnersPage() {
  const { data, scope, isEmpty, canEdit } = useApp();
  const [tab, setTab] = React.useState<"partners" | "float">("partners");
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All statuses");
  const [selected, setSelected] = React.useState<PayoutPartner | null>(null);

  const partners = React.useMemo(() => scopePartners(data.partners, scope), [data.partners, scope]);
  const floats = React.useMemo(() => scopeFloat(data.floatAccounts, scope, data.corridors), [data.floatAccounts, scope, data.corridors]);

  const filteredPartners = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return partners.filter((p) => {
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.countryName.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All statuses" || p.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [partners, search, statusFilter]);

  const pgP = usePagination(filteredPartners, 10);
  const pgF = usePagination(floats, 12);
  React.useEffect(() => pgP.resetPage(), [search, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const activePartners = partners.filter((p) => p.status === "Active").length;
  const onboarding = partners.filter((p) => p.status === "Onboarding").length;
  const totalFloatUsd = floats.reduce((s, f) => s + f.balance * (USD[f.currency] ?? 1), 0);
  const atRisk = floats.filter((f) => f.status !== "Healthy");
  const avgSuccess = activePartners ? partners.filter((p) => p.status === "Active").reduce((s, p) => s + p.successRate, 0) / activePartners : 0;
  const avgSpeed = activePartners ? Math.round(partners.filter((p) => p.status === "Active").reduce((s, p) => s + p.avgPayoutMins, 0) / activePartners) : 0;

  const partnerColumns: DataTableColumn<PayoutPartner>[] = [
    {
      key: "partner",
      label: "Partner",
      render: (p) => (
        <>
          <span className="strong block text-content-2">{p.name}</span>
          <span className="font-mono text-3xs text-content-faint">{p.id}</span>
        </>
      ),
    },
    { key: "country", label: "Country", cellClassName: "text-content-muted", render: (p) => p.countryName },
    {
      key: "corridors",
      label: "Corridors",
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.corridors.length ? (
            p.corridors.map((c) => (
              <span key={c} className="rounded bg-surface-3 px-1 py-[1px] font-mono text-3xs text-content-muted">{c}</span>
            ))
          ) : (
            <span className="text-3xs text-content-dim">—</span>
          )}
        </div>
      ),
    },
    { key: "rails", label: "Rails", cellClassName: "text-2xs text-content-muted", render: (p) => p.rails.join("·") },
    { key: "kyb", label: "KYB", render: (p) => <StatusPill status={p.kybStatus} /> },
    {
      key: "success",
      label: "Success",
      render: (p) =>
        p.status === "Onboarding" ? (
          <span className="text-3xs text-content-dim">—</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <Meter value={p.successRate} tone={successTone(p.successRate)} className="w-10" />
            <span className="tabular text-2xs text-content-muted">{formatPct(p.successRate)}</span>
          </div>
        ),
    },
    { key: "speed", label: "Speed", align: "right", cellClassName: "num text-content-muted", render: (p) => (p.status === "Onboarding" ? "—" : `${p.avgPayoutMins}m`) },
    { key: "commission", label: "Commission", align: "right", cellClassName: "num", render: (p) => formatPct(p.commissionPct, 2) },
    { key: "status", label: "Status", render: (p) => <StatusPill status={p.status} /> },
    { key: "chevron", label: "", cellClassName: "text-content-dim", render: () => <ChevronRight size={13} /> },
  ];

  const floatColumns: DataTableColumn<FloatAccount>[] = [
    { key: "id", label: "Account", cellClassName: "font-mono text-2xs text-content-2", render: (f) => f.id },
    { key: "partner", label: "Partner", cellClassName: "text-content-muted", render: (f) => partners.find((p) => p.id === f.partnerId)?.name ?? f.partnerId },
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
    {
      key: "action",
      label: "",
      render: (f) => (canEdit("treasury") && f.status !== "Healthy" ? <Button size="xs" variant="subtle">Top up</Button> : null),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Payout Partners & Liquidity" subtitle="Distribution network, per-corridor float and settlement-ready treasury balances">
        <DownloadButtons />
        {canEdit("partners") && (
          <Button variant="accent" size="sm">
            <Plus size={12} /> Onboard partner
          </Button>
        )}
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard accent label="Active partners" value={isEmpty ? "—" : activePartners} sub={`${partners.length} in network`} />
        <StatCard label="Total float" value={isEmpty ? "—" : formatCompact(totalFloatUsd)} sub="USD equivalent" />
        <StatCard label="At-risk accounts" value={isEmpty ? "—" : atRisk.length} sub="low / critical" icon={<AlertTriangle size={12} />} />
        <StatCard label="Avg success rate" value={isEmpty ? "—" : formatPct(avgSuccess)} sub="active partners" />
        <StatCard label="Avg payout speed" value={isEmpty ? "—" : `${avgSpeed}m`} sub="instruction → payout" icon={<Zap size={12} />} />
        <StatCard label="Onboarding" value={isEmpty ? "—" : onboarding} sub="KYB pending" />
      </div>

      {/* Low-liquidity rebalancing suggestions — neutral card; the warning
          icon + status pills carry the signal, never a coloured card border. */}
      {!isEmpty && atRisk.length > 0 && (
        <SectionCard>
          <SectionHeader
            title={<span className="flex items-center gap-1.5"><AlertTriangle size={13} className="text-warning" /> Low-liquidity — rebalancing suggested</span>}
            caption="Float below threshold on these corridors. Pre-funding requires maker-checker approval."
          />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
            {atRisk.slice(0, 6).map((f) => {
              const partner = partners.find((p) => p.id === f.partnerId);
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
                    {canEdit("treasury") && <Button size="xs" variant="subtle">Request</Button>}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      <SectionCard>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "partners", label: "Partners", count: isEmpty ? 0 : partners.length },
              { value: "float", label: "Float & Liquidity", count: isEmpty ? 0 : floats.length },
            ]}
          />
          {tab === "partners" && (
            <Toolbar>
              <div className="w-52">
                <SearchInput value={search} onChange={setSearch} placeholder="Search partner or country" />
              </div>
              <Select value={statusFilter} onChange={setStatusFilter} options={["All statuses", "Active", "Suspended", "Onboarding"]} />
              <DownloadButtons />
            </Toolbar>
          )}
        </div>

        {/* PARTNERS */}
        {tab === "partners" &&
          (isEmpty || !filteredPartners.length ? (
            <EmptyState title={isEmpty ? "No partners yet" : "No matches"} message={isEmpty ? "Flip the seed toggle to populate the network." : "Adjust your search or filters."} />
          ) : (
            <>
              <TotalCount count={filteredPartners.length} noun="partners" />
              <div className="w-full overflow-x-auto">
                <DataTable columns={partnerColumns} rows={pgP.paginated} rowKey={(p) => p.id} onRowClick={setSelected} />
              </div>
              <Pagination page={pgP.page} totalPages={pgP.totalPages} perPage={pgP.perPage} totalItems={pgP.totalItems} onPageChange={pgP.setPage} onPerPageChange={pgP.setPerPage} />
            </>
          ))}

        {/* FLOAT */}
        {tab === "float" &&
          (isEmpty || !floats.length ? (
            <EmptyState title="No float accounts" message="Flip the seed toggle to view partner liquidity." />
          ) : (
            <>
              <TotalCount count={floats.length} noun="float accounts" />
              <div className="w-full overflow-x-auto">
                <DataTable columns={floatColumns} rows={pgF.paginated} rowKey={(f) => f.id} />
              </div>
              <Pagination page={pgF.page} totalPages={pgF.totalPages} perPage={pgF.perPage} totalItems={pgF.totalItems} onPageChange={pgF.setPage} onPerPageChange={pgF.setPerPage} />
            </>
          ))}
      </SectionCard>

      <PartnerSheet partner={selected} onClose={() => setSelected(null)} floats={data.floatAccounts} />
    </div>
  );
}

function PartnerSheet({
  partner,
  onClose,
  floats,
}: {
  partner: PayoutPartner | null;
  onClose: () => void;
  floats: FloatAccount[];
}) {
  const p = partner;
  const pf = p ? floats.filter((f) => f.partnerId === p.id) : [];
  return (
    <Sheet open={!!p} onOpenChange={(o) => !o && onClose()} title={p?.name ?? ""} description={p ? `${p.legalName} · ${p.id}` : ""}>
      {p && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <StatusPill status={p.status} />
            <Badge tone={p.kybStatus === "Verified" ? "success" : "warning"} dot>KYB {p.kybStatus}</Badge>
          </div>

          {/* Scorecard */}
          <div className="grid grid-cols-3 gap-2">
            <ScoreTile icon={<TrendingUp size={12} />} label="Success" value={p.status === "Onboarding" ? "—" : formatPct(p.successRate)} tone={successTone(p.successRate)} />
            <ScoreTile icon={<Zap size={12} />} label="Avg speed" value={p.status === "Onboarding" ? "—" : `${p.avgPayoutMins}m`} tone="info" />
            <ScoreTile icon={<Gauge size={12} />} label="Commission" value={formatPct(p.commissionPct, 2)} tone="accent" />
          </div>

          <div>
            <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-content-faint">Profile</p>
            <DescriptionList>
              <DetailRow label="Legal name" value={p.legalName} />
              <DetailRow label="Country" value={p.countryName} />
              <DetailRow label="Rails" value={p.rails.join(" · ")} />
              <DetailRow label="Corridors" value={p.corridors.length ? p.corridors.join(", ") : "—"} mono />
              <DetailRow label="Contact" value={`${p.contactName} · ${p.contactEmail}`} />
              <DetailRow label="Onboarded" value={formatDate(p.onboardedOn)} />
              <DetailRow label="Top failure reason" value={p.topFailureReason} />
            </DescriptionList>
          </div>

          {pf.length > 0 && (
            <div>
              <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-content-faint">Float accounts · {pf.length}</p>
              <div className="space-y-1.5">
                {pf.map((f) => (
                  <div key={f.id} className="rounded-panel border border-hairline-faint bg-surface-1 px-2.5 py-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xs text-content-2">{f.corridorCode} · {f.currency}</span>
                      <StatusPill status={f.status} />
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Meter value={f.utilisation} tone={floatTone(f.status)} className="flex-1" />
                      <span className="tabular text-2xs text-content-muted">{formatMoney(f.balance, f.currency, 0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}

function ScoreTile({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  const color: Record<string, string> = {
    success: "text-success", info: "text-info", accent: "text-accent-hi", warning: "text-warning", danger: "text-danger",
  };
  return (
    <div className="rounded-panel border border-hairline bg-surface-1 p-2.5">
      <span className="flex items-center gap-1 text-3xs text-content-faint">{icon} {label}</span>
      <p className={cn("mt-1 text-lg font-semibold tabular", color[tone] ?? "text-content")}>{value}</p>
    </div>
  );
}
