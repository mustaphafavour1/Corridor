import type {
  Transfer,
  TransferStatus,
  LedgerEntry,
  Settlement,
  ReconciliationItem,
  Rail,
  ServiceCode,
  Currency,
} from "@/lib/types";
import { corridors, fxRates } from "@/lib/seed/reference";
import { senders, beneficiaries, partners } from "@/lib/seed/parties";
import { seededRand } from "@/lib/utils";

const TODAY = new Date("2026-08-14T09:00:00Z");

function isoDaysAgo(days: number, seed: string) {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - days);
  const mins = Math.floor(seededRand(seed + "m") * 1440);
  d.setUTCHours(0, mins, 0, 0);
  return d.toISOString();
}

function railFor(method: string): Rail {
  return method === "bank" ? "BANK" : method === "wallet" ? "WALLET" : "CASH";
}

function fxFor(send: Currency, recv: Currency): number {
  const rate = fxRates.find((f) => f.base === send && f.quote === recv);
  return rate ? rate.midRate : 1;
}

const STATUS_POOL: TransferStatus[] = [
  "Settled", "Settled", "Settled", "Settled", "PaidOut", "PaidOut",
  "Routed", "Funded", "Screened", "Initiated", "OnHold", "Failed", "Reversed",
];

const SERVICE_POOL: ServiceCode[] = ["RMT", "RMT", "RMT", "RMT", "B2B", "PAYROLL"];

function amountFor(currency: Currency, seed: string, big: boolean): number {
  const r = seededRand(seed);
  if (big) {
    const base = 8000 + Math.floor(r * 22000);
    return currency === "GBP" || currency === "EUR" || currency === "USD" ? base : base;
  }
  const tiers = [120, 250, 380, 500, 750, 1200, 1800, 2400];
  return tiers[Math.floor(r * tiers.length)];
}

export const transfers: Transfer[] = (() => {
  const rows: Transfer[] = [];
  let seq = 100234;

  beneficiaries.forEach((ben, bi) => {
    const sender = senders.find((s) => s.id === ben.senderId)!;
    const corridor = corridors.find((c) => c.code === ben.corridorCode)!;
    if (!corridor) return;
    const count = 2 + Math.floor(seededRand(`${ben.id}-count`) * 4); // 2-5
    for (let i = 0; i < count; i++) {
      const seed = `${ben.id}-${i}`;
      const r = seededRand(seed);
      const big = r > 0.86 || sender.status === "Flagged";
      const status = STATUS_POOL[Math.floor(seededRand(seed + "st") * STATUS_POOL.length)];
      const sendAmount = amountFor(corridor.sendCurrency, seed + "amt", big);
      const fx = fxFor(corridor.sendCurrency, corridor.receiveCurrency);
      const feeAmount = +(sendAmount * (corridor.feePct / 100) + 1.99).toFixed(2);
      const receiveAmount = Math.round(sendAmount * fx);
      const partnerId = corridor.partnerIds[Math.floor(seededRand(seed + "p") * corridor.partnerIds.length)] ?? corridor.partnerIds[0];
      const commission = +(sendAmount * ((partners.find((p) => p.id === partnerId)?.commissionPct ?? 0.8) / 100)).toFixed(2);
      const service = SERVICE_POOL[Math.floor(seededRand(seed + "sv") * SERVICE_POOL.length)];
      const rail = railFor(ben.method);
      const flagged = big && seededRand(seed + "fl") > 0.4;
      const daysAgo = Math.floor(seededRand(seed + "d") * 42);
      const createdAt = isoDaysAgo(daysAgo, seed);
      const id = `TRF-${seq++}`;
      rows.push({
        id,
        reference: `${sender.id} / ${corridor.code} / ${service} / ${sendAmount}${corridor.sendCurrency} / ${rail}`,
        senderId: sender.id,
        senderName: `${sender.firstName.trim()} ${sender.lastName}`,
        beneficiaryId: ben.id,
        beneficiaryName: ben.name,
        corridorCode: corridor.code,
        serviceCode: service,
        rail,
        partnerId,
        sendAmount,
        sendCurrency: corridor.sendCurrency,
        fxRate: fx,
        receiveAmount,
        receiveCurrency: corridor.receiveCurrency,
        feeAmount,
        partnerCommission: commission,
        status,
        riskFlagged: flagged,
        createdAt,
        settledAt: status === "Settled" ? isoDaysAgo(Math.max(0, daysAgo - 1), seed + "settle") : undefined,
      });
    }
  });

  return rows.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
})();

// Ledger entries derived from the 24 most recent transfers (funding + payout + commission legs).
export const ledgerEntries: LedgerEntry[] = (() => {
  const rows: LedgerEntry[] = [];
  let running = 12_400_000;
  transfers.slice(0, 24).forEach((t, i) => {
    running += t.sendAmount;
    rows.push({
      id: `LED-${1000 + i * 3}`,
      transferId: t.id,
      date: t.createdAt,
      account: `Funding · ${t.sendCurrency}`,
      direction: "credit",
      type: "Funding",
      amount: t.sendAmount,
      currency: t.sendCurrency,
      balance: running,
    });
    running -= t.partnerCommission;
    rows.push({
      id: `LED-${1000 + i * 3 + 1}`,
      transferId: t.id,
      date: t.createdAt,
      account: `Partner Payable · ${t.partnerId}`,
      direction: "debit",
      type: "Commission",
      amount: t.partnerCommission,
      currency: t.sendCurrency,
      balance: running,
    });
    rows.push({
      id: `LED-${1000 + i * 3 + 2}`,
      transferId: t.id,
      date: t.createdAt,
      account: `Payout · ${t.receiveCurrency}`,
      direction: "debit",
      type: "Payout",
      amount: t.receiveAmount,
      currency: t.receiveCurrency,
      balance: running,
    });
  });
  return rows;
})();

export const settlements: Settlement[] = (() => {
  const rows: Settlement[] = [];
  const activePartners = partners.filter((p) => p.status === "Active");
  activePartners.forEach((p, pi) => {
    p.corridors.forEach((code, ci) => {
      const corridor = corridors.find((c) => c.code === code);
      if (!corridor) return;
      const seed = `${p.id}-${code}-settle`;
      const r = seededRand(seed);
      const gross = Math.round((120_000 + r * 480_000) / 100) * 100;
      const commission = Math.round(gross * (p.commissionPct / 100));
      const status: Settlement["status"] = r > 0.85 ? "Pending" : r > 0.78 ? "Failed" : "Settled";
      rows.push({
        id: `STL-${p.id.slice(4)}-${ci}`,
        partnerId: p.id,
        corridorCode: code,
        cycleDate: "2026-08-13",
        grossAmount: gross,
        commission,
        netAmount: gross - commission,
        currency: corridor.receiveCurrency,
        itemCount: 40 + Math.floor(r * 160),
        status,
      });
    });
  });
  return rows;
})();

export const reconciliationItems: ReconciliationItem[] = (() => {
  const rows: ReconciliationItem[] = [];
  transfers.slice(0, 30).forEach((t, i) => {
    const r = seededRand(`${t.id}-recon`);
    const isBreak = r > 0.82;
    const variance = isBreak ? Math.round((r - 0.82) * t.receiveAmount * 0.4) : 0;
    rows.push({
      id: `RCN-${5000 + i}`,
      partnerId: t.partnerId,
      corridorCode: t.corridorCode,
      transferId: t.id,
      ourAmount: t.receiveAmount,
      partnerAmount: t.receiveAmount - variance,
      currency: t.receiveCurrency,
      variance,
      status: isBreak ? (r > 0.92 ? "Investigating" : "Break") : "Matched",
      breakReason: isBreak ? (r > 0.92 ? "FX timing difference" : "Partner fee deducted at source") : undefined,
      cycleDate: "2026-08-13",
    });
  });
  return rows;
})();
