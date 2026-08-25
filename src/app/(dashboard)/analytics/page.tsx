"use client";

import * as React from "react";
import { useApp } from "@/context/app-provider";
import { scopeCorridors, scopeTransfers, scopePartners, scopeFloat } from "@/lib/rbac";
import { railMixSeries } from "@/lib/seed/reference";
import { formatPct } from "@/lib/utils";
import {
  PageHeader,
  SectionCard,
  SectionHeader,
  StatCard,
  DateRangeFilter,
  DownloadButtons,
  EmptyState,
  MultiLine,
  Donut,
  RankBars,
  CHART,
} from "@/components/ui";

export default function AnalyticsPage() {
  const { data, scope, isEmpty } = useApp();

  const corridors = React.useMemo(() => scopeCorridors(data.corridors, scope), [data.corridors, scope]);
  const transfers = React.useMemo(
    () => scopeTransfers(data.transfers, scope, data.corridors),
    [data.transfers, scope, data.corridors],
  );
  const partners = React.useMemo(() => scopePartners(data.partners, scope), [data.partners, scope]);
  const floats = React.useMemo(
    () => scopeFloat(data.floatAccounts, scope, data.corridors),
    [data.floatAccounts, scope, data.corridors],
  );

  // Case/screening records aren't region-tagged in the data model, so these
  // sections show the full compliance picture regardless of corridor scope.
  const cases = data.complianceCases;
  const hits = data.screeningHits;
  const exposures = scope.isGlobal
    ? data.exposures
    : data.exposures.filter((e) => corridors.some((c) => c.sendCurrency === e.currency || c.receiveCurrency === e.currency));

  // Cases by type
  const caseTypeCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    cases.forEach((c) => map.set(c.type, (map.get(c.type) ?? 0) + 1));
    const colors = [CHART.rose, CHART.info, CHART.amber, CHART.violet, CHART.mint];
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }));
  }, [cases]);

  // Screening hit status mix
  const hitStatus = React.useMemo(() => {
    const map = new Map<string, number>();
    hits.forEach((h) => map.set(h.status, (map.get(h.status) ?? 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [hits]);
  const truePositiveRate = hits.length
    ? Math.round((hits.filter((h) => h.status === "True Positive").length / hits.length) * 100)
    : 0;

  // Screening by list
  const hitsByList = React.useMemo(() => {
    const map = new Map<string, number>();
    hits.forEach((h) => map.set(h.list, (map.get(h.list) ?? 0) + 1));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value, color: CHART.info }));
  }, [hits]);

  // Partner scorecard comparison
  const partnerRank = [...partners]
    .filter((p) => p.status === "Active")
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 8)
    .map((p) => ({ label: p.name, value: p.successRate, color: CHART.mint }));

  // Treasury — hedged coverage by currency
  const hedgeRank = [...exposures]
    .sort((a, b) => a.hedgedPct - b.hedgedPct)
    .map((e) => ({ label: e.currency, value: e.hedgedPct, color: e.hedgedPct >= 80 ? CHART.mint : CHART.amber }));

  const avgHedge = exposures.length ? Math.round(exposures.reduce((s, e) => s + e.hedgedPct, 0) / exposures.length) : 0;
  const healthyFloat = floats.filter((f) => f.status === "Healthy").length;
  const coverage = floats.length ? Math.round((healthyFloat / floats.length) * 100) : 0;
  const openCases = cases.filter((c) => !["Cleared", "Filed"].includes(c.status)).length;
  const avgSuccess = partners.length
    ? partners.filter((p) => p.status === "Active").reduce((s, p) => s + p.successRate, 0) /
      Math.max(1, partners.filter((p) => p.status === "Active").length)
    : 0;

  return (
    <div className="space-y-4">
      <PageHeader title="Analytics" subtitle="Rail mix, compliance signal, treasury coverage and partner performance across scope">
        <DateRangeFilter />
        <DownloadButtons />
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard accent label="Transfers analysed" value={isEmpty ? "—" : transfers.length.toLocaleString()} sub="in scope" />
        <StatCard label="Open cases" value={isEmpty ? "—" : openCases} sub={`${cases.length} total`} />
        <StatCard label="True-positive rate" value={isEmpty ? "—" : `${truePositiveRate}%`} sub="screening hits" />
        <StatCard label="Avg hedged coverage" value={isEmpty ? "—" : `${avgHedge}%`} sub="by currency" />
        <StatCard label="Liquidity coverage" value={isEmpty ? "—" : `${coverage}%`} sub={`${healthyFloat}/${floats.length} healthy`} />
        <StatCard label="Avg partner success" value={isEmpty ? "—" : formatPct(avgSuccess)} sub="active partners" />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <SectionCard className="xl:col-span-2">
          <SectionHeader title="Service & rail mix" caption="Bank / wallet / cash volume over time" />
          {isEmpty ? (
            <EmptyState title="No rail data" />
          ) : (
            <MultiLine
              data={railMixSeries}
              height={220}
              series={[
                { key: "bank", color: CHART.rose, label: "Bank" },
                { key: "wallet", color: CHART.info, label: "Wallet" },
                { key: "cash", color: CHART.mint, label: "Cash pickup" },
              ]}
            />
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Screening hit status" caption="Disposition mix" />
          {isEmpty || !hits.length ? (
            <EmptyState title="No screening hits" />
          ) : (
            <>
              <Donut
                data={hitStatus}
                colors={[CHART.amber, "#e0564f", CHART.mint]}
                centerValue={`${truePositiveRate}%`}
                centerLabel="True positive"
              />
              <div className="mt-2 space-y-1">
                {hitStatus.map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between text-2xs">
                    <span className="flex items-center gap-1.5 text-content-muted">
                      <span className="h-2 w-2 rounded-full" style={{ background: [CHART.amber, "#e0564f", CHART.mint][i] }} />
                      {s.name}
                    </span>
                    <span className="tabular font-medium text-content-2">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <SectionCard>
          <SectionHeader title="Compliance cases by type" caption="AML / Sanctions / Fraud / KYC / Structuring" />
          {isEmpty || !caseTypeCounts.length ? (
            <EmptyState title="No cases" />
          ) : (
            <div className="pt-4">
              <RankBars items={caseTypeCounts} labelWidth="w-20" mono={false} gap="space-y-6" />
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Screening hits by list" caption="OFAC / EU / UN / PEP / Interpol" />
          {isEmpty || !hitsByList.length ? (
            <EmptyState title="No screening hits" />
          ) : (
            <div className="pt-4">
              <RankBars items={hitsByList} labelWidth="w-14" gap="space-y-6" />
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHeader title="FX exposure — hedged coverage" caption="By currency, ascending" />
          {isEmpty || !hedgeRank.length ? (
            <EmptyState title="No exposure data" />
          ) : (
            <RankBars items={hedgeRank} valueFormatter={(v) => `${v}%`} />
          )}
        </SectionCard>
      </div>

      <SectionCard>
        <SectionHeader title="Partner scorecard" caption="Payout success rate, top active partners in scope" />
        {isEmpty || !partnerRank.length ? (
          <EmptyState title="No active partners" />
        ) : (
          <RankBars items={partnerRank} valueFormatter={(v) => `${v}%`} labelWidth="w-32" mono={false} />
        )}
      </SectionCard>
    </div>
  );
}
