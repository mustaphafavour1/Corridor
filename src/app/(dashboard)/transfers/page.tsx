"use client";

import * as React from "react";
import { Flag, ChevronRight, Check } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { scopeTransfers } from "@/lib/rbac";
import { formatMoney, formatCompact, formatDateTime, formatDate, cn } from "@/lib/utils";
import type { Currency, Transfer, TransferStatus } from "@/lib/types";
import {
  PageHeader,
  SectionCard,
  StatCard,
  Badge,
  StatusPill,
  statusTone,
  SearchInput,
  Select,
  Toolbar,
  DownloadButtons,
  DateRangeFilter,
  EmptyState,
  Pagination,
  usePagination,
  Sheet,
  DetailRow,
  DescriptionList,
  Button,
  DataTable,
  type DataTableColumn,
} from "@/components/ui";

const USD: Record<Currency, number> = {
  USD: 1, GBP: 1.27, EUR: 1.09, NGN: 0.00065, MXN: 0.058, PHP: 0.0171, INR: 0.012, MAD: 0.099,
};

const LIFECYCLE: TransferStatus[] = ["Initiated", "Screened", "Funded", "Routed", "PaidOut", "Settled"];
const STATUS_OPTIONS = ["All statuses", ...LIFECYCLE, "OnHold", "Reversed", "Failed"];

export default function TransfersPage() {
  const { data, scope, isEmpty } = useApp();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All statuses");
  const [corridor, setCorridor] = React.useState("All corridors");
  const [rail, setRail] = React.useState("All rails");
  const [selected, setSelected] = React.useState<Transfer | null>(null);

  const all = React.useMemo(
    () => scopeTransfers(data.transfers, scope, data.corridors),
    [data.transfers, scope, data.corridors],
  );

  const corridorOptions = React.useMemo(
    () => ["All corridors", ...Array.from(new Set(all.map((t) => t.corridorCode)))],
    [all],
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((t) => {
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q) ||
        t.senderName.toLowerCase().includes(q) ||
        t.beneficiaryName.toLowerCase().includes(q);
      const matchStatus = status === "All statuses" || t.status === status;
      const matchCorridor = corridor === "All corridors" || t.corridorCode === corridor;
      const matchRail = rail === "All rails" || t.rail === rail;
      return matchSearch && matchStatus && matchCorridor && matchRail;
    });
  }, [all, search, status, corridor, rail]);

  const pg = usePagination(filtered, 12);
  React.useEffect(() => pg.resetPage(), [search, status, corridor, rail]); // eslint-disable-line react-hooks/exhaustive-deps

  const volumeUsd = all.reduce((s, t) => s + t.sendAmount * (USD[t.sendCurrency] ?? 1), 0);
  const inFlight = all.filter((t) => !["Settled", "Failed", "Reversed"].includes(t.status)).length;
  const onHold = all.filter((t) => t.status === "OnHold").length;
  const failed = all.filter((t) => t.status === "Failed").length;
  const flaggedCount = all.filter((t) => t.riskFlagged).length;

  const stageCounts = LIFECYCLE.map((s) => ({ stage: s, count: all.filter((t) => t.status === s).length }));

  const transferColumns: DataTableColumn<Transfer>[] = [
    {
      key: "ref",
      label: "Reference",
      cellClassName: "font-mono text-2xs text-content-2",
      render: (t) => (
        <span className="flex items-center gap-1.5">
          {t.riskFlagged && <Flag size={10} className="text-warning" />}
          {t.id}
        </span>
      ),
    },
    {
      key: "sender",
      label: "Sender → Beneficiary",
      render: (t) => (
        <>
          <span className="strong block text-content-2">{t.senderName}</span>
          <span className="text-3xs text-content-faint">→ {t.beneficiaryName}</span>
        </>
      ),
    },
    { key: "corridor", label: "Corridor", cellClassName: "font-mono text-2xs", render: (t) => t.corridorCode },
    { key: "svc", label: "Svc", cellClassName: "text-2xs text-content-muted", render: (t) => t.serviceCode },
    { key: "send", label: "Send", align: "right", cellClassName: "num", render: (t) => formatMoney(t.sendAmount, t.sendCurrency) },
    { key: "receive", label: "Receive", align: "right", cellClassName: "num text-content-muted", render: (t) => formatMoney(t.receiveAmount, t.receiveCurrency, 0) },
    { key: "fee", label: "Fee", align: "right", cellClassName: "num text-content-faint", render: (t) => formatMoney(t.feeAmount, t.sendCurrency) },
    { key: "rail", label: "Rail", cellClassName: "text-2xs text-content-muted", render: (t) => t.rail },
    { key: "status", label: "Status", render: (t) => <StatusPill status={t.status} /> },
    { key: "created", label: "Created", align: "right", cellClassName: "text-2xs text-content-faint", render: (t) => formatDate(t.createdAt) },
    { key: "chevron", label: "", cellClassName: "text-content-dim", render: () => <ChevronRight size={13} /> },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Transfers" subtitle="End-to-end transfer lifecycle · initiated → screened → funded → routed → paid out → settled">
        <DateRangeFilter />
        <DownloadButtons />
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard accent label="Total Volume" value={isEmpty ? "—" : formatCompact(volumeUsd)} sub="USD equivalent" />
        <StatCard label="Transfers" value={isEmpty ? "—" : all.length.toLocaleString()} sub="in scope" />
        <StatCard label="In-flight" value={isEmpty ? "—" : inFlight} sub="not yet settled" />
        <StatCard label="On Hold" value={isEmpty ? "—" : onHold} sub="compliance / funding" />
        <StatCard label="Failed" value={isEmpty ? "—" : failed} sub="needs action" />
        <StatCard label="Risk-flagged" value={isEmpty ? "—" : flaggedCount} sub="monitoring hits" icon={<Flag size={12} />} />
      </div>

      {/* Lifecycle pipeline */}
      <SectionCard>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-md font-semibold text-content">Lifecycle pipeline</h3>
          <span className="text-2xs text-content-faint">Counts by current stage</span>
        </div>
        <div className="flex flex-wrap items-stretch gap-1.5">
          {stageCounts.map((s, i) => (
            <React.Fragment key={s.stage}>
              <div className="flex-1 min-w-[90px] rounded-panel border border-hairline bg-surface-1 px-2.5 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={dotStyle(s.stage)} />
                  <span className="text-2xs font-medium text-content-muted">{s.stage === "PaidOut" ? "Paid Out" : s.stage}</span>
                </div>
                <p className="mt-1 text-lg font-semibold text-content tabular">{isEmpty ? "—" : s.count}</p>
              </div>
              {i < stageCounts.length - 1 && (
                <div className="hidden items-center text-content-dim sm:flex">
                  <ChevronRight size={14} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <Toolbar className="mb-3 justify-between">
          <div className="w-full max-w-xs">
            <SearchInput value={search} onChange={setSearch} placeholder="Search reference, ID, sender or beneficiary" />
          </div>
          <Toolbar>
            <Select value={status} onChange={setStatus} options={STATUS_OPTIONS} />
            <Select value={corridor} onChange={setCorridor} options={corridorOptions} />
            <Select value={rail} onChange={setRail} options={["All rails", "BANK", "WALLET", "CASH"]} />
          </Toolbar>
        </Toolbar>

        {isEmpty || !filtered.length ? (
          <EmptyState
            title={isEmpty ? "No transfers yet" : "No matches"}
            message={isEmpty ? "Flip the seed toggle to populate demo activity." : "Adjust filters or search to see transfers."}
          />
        ) : (
          <>
            <div className="w-full overflow-x-auto">
              <DataTable columns={transferColumns} rows={pg.paginated} rowKey={(t) => t.id} onRowClick={setSelected} />
            </div>
            <Pagination
              page={pg.page}
              totalPages={pg.totalPages}
              perPage={pg.perPage}
              totalItems={pg.totalItems}
              onPageChange={pg.setPage}
              onPerPageChange={pg.setPerPage}
            />
          </>
        )}
      </SectionCard>

      <TransferSheet transfer={selected} onClose={() => setSelected(null)} partners={data.partners} />
    </div>
  );
}

function dotStyle(stage: TransferStatus): React.CSSProperties {
  const tone = statusTone(stage);
  const map: Record<string, string> = {
    success: "var(--success)", info: "var(--info)", violet: "var(--violet)",
    accent: "var(--accent)", warning: "var(--warning)", danger: "var(--danger)", neutral: "var(--text-faint)",
  };
  return { background: map[tone] };
}

function TransferSheet({
  transfer,
  onClose,
  partners,
}: {
  transfer: Transfer | null;
  onClose: () => void;
  partners: { id: string; name: string }[];
}) {
  const t = transfer;
  const partnerName = t ? partners.find((p) => p.id === t.partnerId)?.name ?? t.partnerId : "";
  const currentIdx = t ? LIFECYCLE.indexOf(t.status) : -1;
  const offHappyPath = t ? ["OnHold", "Reversed", "Failed"].includes(t.status) : false;

  return (
    <Sheet
      open={!!t}
      onOpenChange={(o) => !o && onClose()}
      title={t ? "Transfer receipt" : ""}
      description={t?.id}
      footer={
        t && (
          <>
            <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
            <Button variant="accent" size="sm">Download receipt</Button>
          </>
        )
      }
    >
      {t && (
        <div className="space-y-4">
          <div className="rounded-card metallic p-3">
            <p className="text-3xs uppercase tracking-wide text-accent-contrast/70">Structured reference</p>
            <p className="mt-1 font-mono text-xs font-semibold text-accent-contrast break-all">{t.reference}</p>
          </div>

          <div className="flex items-center justify-between">
            <StatusPill status={t.status} />
            {t.riskFlagged && <Badge tone="warning" dot>Risk-flagged</Badge>}
          </div>

          <div>
            <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-content-faint">Amount breakdown</p>
            <DescriptionList>
              <DetailRow label="Send amount" value={formatMoney(t.sendAmount, t.sendCurrency)} mono />
              <DetailRow label="Fee" value={formatMoney(t.feeAmount, t.sendCurrency)} mono />
              <DetailRow label="FX rate" value={`${t.sendCurrency}/${t.receiveCurrency} @ ${t.fxRate.toLocaleString()}`} mono />
              <DetailRow label="Receive amount" value={formatMoney(t.receiveAmount, t.receiveCurrency, 0)} mono />
              <DetailRow label="Partner commission" value={formatMoney(t.partnerCommission, t.sendCurrency)} mono />
            </DescriptionList>
          </div>

          <div>
            <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-content-faint">Route</p>
            <DescriptionList>
              <DetailRow label="Sender" value={`${t.senderName} · ${t.senderId}`} />
              <DetailRow label="Beneficiary" value={`${t.beneficiaryName} · ${t.beneficiaryId}`} />
              <DetailRow label="Corridor" value={t.corridorCode} mono />
              <DetailRow label="Service / Rail" value={`${t.serviceCode} · ${t.rail}`} />
              <DetailRow label="Payout partner" value={partnerName} />
            </DescriptionList>
          </div>

          <div>
            <p className="mb-2 text-2xs font-semibold uppercase tracking-wide text-content-faint">Lifecycle</p>
            <ol className="relative ml-1 border-l border-hairline pl-4">
              {LIFECYCLE.map((stage, i) => {
                const done = currentIdx >= 0 && i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <li key={stage} className="mb-2.5 last:mb-0">
                    <span
                      className={cn(
                        "absolute -left-[7px] flex h-3 w-3 items-center justify-center rounded-full border",
                        done ? "border-accent bg-accent" : "border-hairline-strong bg-surface-2",
                      )}
                    >
                      {done && <Check size={8} className="text-accent-contrast" />}
                    </span>
                    <span className={cn("text-2xs", active ? "font-semibold text-content" : done ? "text-content-2" : "text-content-faint")}>
                      {stage === "PaidOut" ? "Paid Out" : stage}
                    </span>
                  </li>
                );
              })}
              {offHappyPath && (
                <li className="mb-0">
                  <span className="absolute -left-[7px] flex h-3 w-3 items-center justify-center rounded-full border border-danger bg-danger" />
                  <span className="text-2xs font-semibold text-danger">{t.status === "OnHold" ? "On Hold" : t.status}</span>
                </li>
              )}
            </ol>
          </div>

          <DescriptionList>
            <DetailRow label="Created" value={formatDateTime(t.createdAt)} />
            {t.settledAt && <DetailRow label="Settled" value={formatDateTime(t.settledAt)} />}
          </DescriptionList>
        </div>
      )}
    </Sheet>
  );
}
