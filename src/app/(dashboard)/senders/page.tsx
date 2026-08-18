"use client";

import * as React from "react";
import { Landmark, Smartphone, Banknote, Upload, Plus, ChevronRight, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { scopeSenders } from "@/lib/rbac";
import { formatMoney, formatDate, cn } from "@/lib/utils";
import type { Sender, Beneficiary, PayoutMethod } from "@/lib/types";
import {
  PageHeader,
  SectionCard,
  StatCard,
  Badge,
  StatusPill,
  Meter,
  Avatar,
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
  Modal,
  DetailRow,
  DescriptionList,
  DataTable,
  type DataTableColumn,
} from "@/components/ui";
import { initials } from "@/lib/utils";

const METHOD_ICON: Record<PayoutMethod, typeof Landmark> = {
  bank: Landmark,
  wallet: Smartphone,
  cash: Banknote,
};
const METHOD_LABEL: Record<PayoutMethod, string> = { bank: "Bank", wallet: "Wallet", cash: "Cash pickup" };

function riskTone(score: number) {
  return score < 25 ? "success" : score < 50 ? "warning" : "danger";
}
function beneficiaryDetail(b: Beneficiary) {
  if (b.method === "bank") return `${b.bankName ?? ""} · ${b.accountNumber ?? b.iban ?? ""}`;
  if (b.method === "wallet") return `${b.walletProvider ?? ""} · ${b.walletNumber ?? ""}`;
  return b.pickupProvider ?? "";
}

export default function SendersPage() {
  const { data, scope, isEmpty } = useApp();
  const [tab, setTab] = React.useState<"senders" | "beneficiaries">("senders");
  const [search, setSearch] = React.useState("");
  const [kyc, setKyc] = React.useState("All KYC");
  const [selected, setSelected] = React.useState<Sender | null>(null);
  const [importOpen, setImportOpen] = React.useState(false);

  const senders = React.useMemo(() => scopeSenders(data.senders, scope), [data.senders, scope]);
  const senderIds = new Set(senders.map((s) => s.id));
  const beneficiaries = React.useMemo(
    () => data.beneficiaries.filter((b) => senderIds.has(b.senderId)),
    [data.beneficiaries, senders], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const filteredSenders = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return senders.filter((s) => {
      const matchQ = !q || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchKyc = kyc === "All KYC" || s.kycStatus === kyc;
      return matchQ && matchKyc;
    });
  }, [senders, search, kyc]);

  const filteredBens = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return beneficiaries.filter((b) => !q || b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.corridorCode.toLowerCase().includes(q));
  }, [beneficiaries, search]);

  const list = tab === "senders" ? filteredSenders : filteredBens;
  const pg = usePagination(list as any[], 12);
  React.useEffect(() => pg.resetPage(), [tab, search, kyc]); // eslint-disable-line react-hooks/exhaustive-deps

  const verified = senders.filter((s) => s.kycStatus === "Verified").length;
  const pendingKyc = senders.filter((s) => s.kycStatus === "Pending").length;
  const flagged = senders.filter((s) => s.status === "Flagged" || s.status === "Blocked").length;
  const avgRisk = senders.length ? Math.round(senders.reduce((s, x) => s + x.riskScore, 0) / senders.length) : 0;

  const partnerScoped = !!scope.partnerId;

  const senderColumns: DataTableColumn<Sender>[] = [
    {
      key: "sender",
      label: "Sender",
      render: (s) => (
        <div className="flex items-center gap-2">
          <Avatar initials={initials(s.firstName, s.lastName)} color="var(--surface-4)" size={22} />
          <div>
            <span className="strong block text-content-2">{s.firstName.trim()} {s.lastName}</span>
            <span className="font-mono text-3xs text-content-faint">{s.id}</span>
          </div>
        </div>
      ),
    },
    { key: "country", label: "Country", cellClassName: "text-content-muted", render: (s) => s.countryName },
    { key: "tier", label: "KYC tier", render: (s) => <Badge tone="info">{s.kycTier}</Badge> },
    { key: "kyc", label: "KYC status", render: (s) => <StatusPill status={s.kycStatus} /> },
    { key: "limit", label: "Monthly limit", align: "right", cellClassName: "num", render: (s) => formatMoney(s.monthlyLimit, s.currency, 0) },
    {
      key: "risk",
      label: "Risk",
      render: (s) => (
        <div className="flex items-center gap-1.5">
          <Meter value={s.riskScore} tone={riskTone(s.riskScore)} className="w-10" />
          <span className="tabular text-2xs text-content-muted">{s.riskScore}</span>
        </div>
      ),
    },
    { key: "payees", label: "Payees", align: "right", cellClassName: "num", render: (s) => s.beneficiaryIds.length },
    { key: "sent", label: "Total sent", align: "right", cellClassName: "num", render: (s) => formatMoney(s.totalSent, s.currency, 0) },
    { key: "status", label: "Status", render: (s) => <StatusPill status={s.status} /> },
    { key: "chevron", label: "", cellClassName: "text-content-dim", render: () => <ChevronRight size={13} /> },
  ];

  const beneficiaryColumns: DataTableColumn<Beneficiary>[] = [
    {
      key: "beneficiary",
      label: "Beneficiary",
      render: (b) => (
        <>
          <span className="strong block text-content-2">{b.name}</span>
          <span className="font-mono text-3xs text-content-faint">{b.id} · {b.countryName}</span>
        </>
      ),
    },
    {
      key: "sender",
      label: "Sender",
      cellClassName: "text-content-muted",
      render: (b) => {
        const sender = senders.find((s) => s.id === b.senderId);
        return sender ? `${sender.firstName.trim()} ${sender.lastName}` : b.senderId;
      },
    },
    { key: "corridor", label: "Corridor", cellClassName: "font-mono text-2xs", render: (b) => b.corridorCode },
    {
      key: "method",
      label: "Method",
      render: (b) => {
        const Icon = METHOD_ICON[b.method];
        return (
          <span className="inline-flex items-center gap-1.5 text-2xs text-content-muted">
            <Icon size={12} className="text-content-faint" /> {METHOD_LABEL[b.method]}
          </span>
        );
      },
    },
    { key: "destination", label: "Destination", cellClassName: "font-mono text-2xs text-content-muted", render: (b) => beneficiaryDetail(b) },
    { key: "relationship", label: "Relationship", cellClassName: "text-content-muted", render: (b) => b.relationship },
    { key: "verification", label: "Verification", render: (b) => <StatusPill status={b.verification} /> },
    { key: "lastPaid", label: "Last paid", align: "right", cellClassName: "text-2xs text-content-faint", render: (b) => (b.lastPaidOn ? formatDate(b.lastPaidOn) : "—") },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Senders & Beneficiaries" subtitle="KYC-tiered senders and their per-corridor payout beneficiaries">
        <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
          <Upload size={12} /> Import CSV
        </Button>
        <Button variant="accent" size="sm">
          <Plus size={12} /> Add sender
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard accent label="Senders" value={isEmpty ? "—" : senders.length} sub="in scope" />
        <StatCard label="KYC Verified" value={isEmpty ? "—" : verified} sub={`${senders.length ? Math.round((verified / senders.length) * 100) : 0}% of base`} />
        <StatCard label="Pending KYC" value={isEmpty ? "—" : pendingKyc} sub="awaiting review" />
        <StatCard label="Flagged / Blocked" value={isEmpty ? "—" : flagged} sub="elevated risk" />
        <StatCard label="Beneficiaries" value={isEmpty ? "—" : beneficiaries.length} sub="saved payees" />
        <StatCard label="Avg risk score" value={isEmpty ? "—" : avgRisk} sub="0–100 scale" />
      </div>

      <SectionCard>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "senders", label: "Senders", count: isEmpty ? 0 : senders.length },
              { value: "beneficiaries", label: "Beneficiaries", count: isEmpty ? 0 : beneficiaries.length },
            ]}
          />
          <Toolbar>
            <div className="w-56">
              <SearchInput value={search} onChange={setSearch} placeholder={tab === "senders" ? "Search senders" : "Search beneficiaries"} />
            </div>
            {tab === "senders" && <Select value={kyc} onChange={setKyc} options={["All KYC", "Verified", "Pending", "Rejected", "Expired"]} />}
            <DownloadButtons />
          </Toolbar>
        </div>

        {partnerScoped ? (
          <EmptyState title="Managed by HQ / Regional Ops" message="Payout partners don't hold sender or beneficiary records — you receive payout instructions on Transfers." icon={<ShieldCheck size={20} strokeWidth={1.5} />} />
        ) : isEmpty || !list.length ? (
          <EmptyState title={isEmpty ? "No records yet" : "No matches"} message={isEmpty ? "Flip the seed toggle to populate demo data." : "Adjust your search or filters."} />
        ) : tab === "senders" ? (
          <>
            <div className="w-full overflow-x-auto">
              <DataTable columns={senderColumns} rows={pg.paginated as Sender[]} rowKey={(s) => s.id} onRowClick={setSelected} />
            </div>
            <Pagination page={pg.page} totalPages={pg.totalPages} perPage={pg.perPage} totalItems={pg.totalItems} onPageChange={pg.setPage} onPerPageChange={pg.setPerPage} />
          </>
        ) : (
          <>
            <div className="w-full overflow-x-auto">
              <DataTable columns={beneficiaryColumns} rows={pg.paginated as Beneficiary[]} rowKey={(b) => b.id} />
            </div>
            <Pagination page={pg.page} totalPages={pg.totalPages} perPage={pg.perPage} totalItems={pg.totalItems} onPageChange={pg.setPage} onPerPageChange={pg.setPerPage} />
          </>
        )}
      </SectionCard>

      <SenderSheet sender={selected} onClose={() => setSelected(null)} allBeneficiaries={data.beneficiaries} />
      <ImportCsvModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}

function SenderSheet({
  sender,
  onClose,
  allBeneficiaries,
}: {
  sender: Sender | null;
  onClose: () => void;
  allBeneficiaries: Beneficiary[];
}) {
  const s = sender;
  const bens = s ? allBeneficiaries.filter((b) => b.senderId === s.id) : [];
  return (
    <Sheet open={!!s} onOpenChange={(o) => !o && onClose()} title={s ? `${s.firstName.trim()} ${s.lastName}` : ""} description={s?.id}>
      {s && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <StatusPill status={s.status} />
            <Badge tone="info">{s.kycTier}</Badge>
          </div>

          <div>
            <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-content-faint">Profile</p>
            <DescriptionList>
              <DetailRow label="Email" value={s.email} />
              <DetailRow label="Phone" value={s.phone} mono />
              <DetailRow label="Country" value={s.countryName} />
              <DetailRow label="Joined" value={formatDate(s.joinedOn)} />
            </DescriptionList>
          </div>

          <div>
            <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-content-faint">KYC & limits</p>
            <DescriptionList>
              <DetailRow label="KYC status" value={<StatusPill status={s.kycStatus} />} />
              <DetailRow label="Monthly limit" value={formatMoney(s.monthlyLimit, s.currency, 0)} mono />
              <DetailRow label="Total sent" value={formatMoney(s.totalSent, s.currency, 0)} mono />
              <DetailRow label="Transfers" value={s.transferCount} />
            </DescriptionList>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xs text-content-faint">Risk score</span>
              <Meter value={s.riskScore} tone={riskTone(s.riskScore)} className="flex-1" />
              <span className="tabular text-2xs font-medium text-content-2">{s.riskScore}/100</span>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-content-faint">
              Beneficiaries · {bens.length}
            </p>
            <div className="space-y-1.5">
              {bens.map((b) => {
                const Icon = METHOD_ICON[b.method];
                return (
                  <div key={b.id} className="flex items-center gap-2.5 rounded-panel border border-hairline-faint bg-surface-1 px-2.5 py-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-3 text-content-muted">
                      <Icon size={13} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-content-2">{b.name}</p>
                      <p className="truncate font-mono text-3xs text-content-faint">{b.corridorCode} · {beneficiaryDetail(b)}</p>
                    </div>
                    <StatusPill status={b.verification} dot={false} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}

const SAMPLE_CSV = [
  { name: "Olusegun Ade", country: "Nigeria", corridor: "GB-NG", method: "Bank", valid: true },
  { name: "Priya Raman", country: "India", corridor: "GB-IN", method: "Wallet", valid: true },
  { name: "—", country: "Mexico", corridor: "US-MX", method: "Cash", valid: false },
];

const CSV_COLUMNS: DataTableColumn<(typeof SAMPLE_CSV)[number]>[] = [
  { key: "sn", label: "#", cellClassName: "text-content-faint", render: (_r, i) => i + 1 },
  { key: "name", label: "Name", cellClassName: "strong", render: (r) => r.name },
  { key: "country", label: "Country", cellClassName: "text-content-muted", render: (r) => r.country },
  { key: "corridor", label: "Corridor", cellClassName: "font-mono text-2xs", render: (r) => r.corridor },
  { key: "method", label: "Method", cellClassName: "text-content-muted", render: (r) => r.method },
  {
    key: "validation",
    label: "Validation",
    render: (r) => (r.valid ? <Badge tone="success" dot>Valid</Badge> : <Badge tone="danger" dot>Missing name</Badge>),
  },
];

function ImportCsvModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const validCount = SAMPLE_CSV.filter((r) => r.valid).length;
  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title="Import senders — preview"
      description="Review parsed rows before committing. Invalid rows are excluded."
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="accent" size="sm" onClick={onClose}>Commit {validCount} rows</Button>
        </>
      }
    >
      <div className="w-full overflow-x-auto">
        <DataTable columns={CSV_COLUMNS} rows={SAMPLE_CSV} rowKey={(_r, i) => i} />
      </div>
      <p className="mt-3 text-2xs text-content-faint">
        {validCount} of {SAMPLE_CSV.length} rows valid · 1 row will be skipped.
      </p>
    </Modal>
  );
}
