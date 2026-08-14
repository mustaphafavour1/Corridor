import type {
  Region,
  Corridor,
  FxRate,
  CurrencyExposure,
  FeeSchedule,
  VolumePoint,
  FlowPoint,
  RailMixPoint,
} from "@/lib/types";

export const regions: Region[] = [
  { id: "reg-weu", name: "Western Europe", code: "WEU", countries: ["GB", "NL", "DE", "FR"], timezone: "Europe/London" },
  { id: "reg-namer", name: "North America", code: "NAM", countries: ["US"], timezone: "America/New_York" },
  { id: "reg-latam", name: "Latin America", code: "LAT", countries: ["MX"], timezone: "America/Mexico_City" },
  { id: "reg-waf", name: "West Africa", code: "WAF", countries: ["NG", "GH"], timezone: "Africa/Lagos" },
  { id: "reg-nafr", name: "North Africa", code: "NAF", countries: ["MA"], timezone: "Africa/Casablanca" },
  { id: "reg-sasia", name: "South Asia", code: "SAS", countries: ["IN"], timezone: "Asia/Kolkata" },
  { id: "reg-sea", name: "Southeast Asia", code: "SEA", countries: ["PH"], timezone: "Asia/Manila" },
];

// Send→receive pairs. regionId = receive-side operational region (partner scoping).
export const corridors: Corridor[] = [
  { code: "GB-NG", sendCountry: "GB", sendCountryName: "United Kingdom", sendCurrency: "GBP", receiveCountry: "NG", receiveCountryName: "Nigeria", receiveCurrency: "NGN", regionId: "reg-waf", status: "Active", rails: ["BANK", "WALLET", "CASH"], feePct: 1.2, fxSpreadBps: 85, minAmount: 20, maxAmount: 40000, settlementSlaHrs: 4, partnerIds: ["PTR-001", "PTR-002"], monthlyVolume: 8_420_000, successRate: 98.4 },
  { code: "NL-NG", sendCountry: "NL", sendCountryName: "Netherlands", sendCurrency: "EUR", receiveCountry: "NG", receiveCountryName: "Nigeria", receiveCurrency: "NGN", regionId: "reg-waf", status: "Active", rails: ["BANK", "WALLET"], feePct: 1.4, fxSpreadBps: 92, minAmount: 20, maxAmount: 35000, settlementSlaHrs: 6, partnerIds: ["PTR-002"], monthlyVolume: 3_110_000, successRate: 97.6 },
  { code: "GB-IN", sendCountry: "GB", sendCountryName: "United Kingdom", sendCurrency: "GBP", receiveCountry: "IN", receiveCountryName: "India", receiveCurrency: "INR", regionId: "reg-sasia", status: "Active", rails: ["BANK", "WALLET"], feePct: 0.9, fxSpreadBps: 55, minAmount: 20, maxAmount: 50000, settlementSlaHrs: 3, partnerIds: ["PTR-005", "PTR-006"], monthlyVolume: 6_980_000, successRate: 99.1 },
  { code: "US-IN", sendCountry: "US", sendCountryName: "United States", sendCurrency: "USD", receiveCountry: "IN", receiveCountryName: "India", receiveCurrency: "INR", regionId: "reg-sasia", status: "Active", rails: ["BANK"], feePct: 1.0, fxSpreadBps: 60, minAmount: 25, maxAmount: 60000, settlementSlaHrs: 4, partnerIds: ["PTR-005"], monthlyVolume: 5_240_000, successRate: 98.8 },
  { code: "DE-IN", sendCountry: "DE", sendCountryName: "Germany", sendCurrency: "EUR", receiveCountry: "IN", receiveCountryName: "India", receiveCurrency: "INR", regionId: "reg-sasia", status: "Active", rails: ["BANK", "WALLET"], feePct: 1.1, fxSpreadBps: 62, minAmount: 20, maxAmount: 45000, settlementSlaHrs: 5, partnerIds: ["PTR-006"], monthlyVolume: 2_760_000, successRate: 98.2 },
  { code: "US-MX", sendCountry: "US", sendCountryName: "United States", sendCurrency: "USD", receiveCountry: "MX", receiveCountryName: "Mexico", receiveCurrency: "MXN", regionId: "reg-latam", status: "Active", rails: ["BANK", "CASH"], feePct: 1.3, fxSpreadBps: 70, minAmount: 10, maxAmount: 30000, settlementSlaHrs: 2, partnerIds: ["PTR-008", "PTR-009"], monthlyVolume: 9_650_000, successRate: 98.9 },
  { code: "US-PH", sendCountry: "US", sendCountryName: "United States", sendCurrency: "USD", receiveCountry: "PH", receiveCountryName: "Philippines", receiveCurrency: "PHP", regionId: "reg-sea", status: "Active", rails: ["BANK", "WALLET", "CASH"], feePct: 1.1, fxSpreadBps: 68, minAmount: 10, maxAmount: 35000, settlementSlaHrs: 3, partnerIds: ["PTR-010", "PTR-011"], monthlyVolume: 7_120_000, successRate: 99.0 },
  { code: "DE-PH", sendCountry: "DE", sendCountryName: "Germany", sendCurrency: "EUR", receiveCountry: "PH", receiveCountryName: "Philippines", receiveCurrency: "PHP", regionId: "reg-sea", status: "Active", rails: ["WALLET", "CASH"], feePct: 1.35, fxSpreadBps: 75, minAmount: 15, maxAmount: 30000, settlementSlaHrs: 5, partnerIds: ["PTR-011"], monthlyVolume: 2_040_000, successRate: 97.9 },
  { code: "GB-PH", sendCountry: "GB", sendCountryName: "United Kingdom", sendCurrency: "GBP", receiveCountry: "PH", receiveCountryName: "Philippines", receiveCurrency: "PHP", regionId: "reg-sea", status: "Active", rails: ["BANK", "WALLET"], feePct: 1.15, fxSpreadBps: 72, minAmount: 15, maxAmount: 35000, settlementSlaHrs: 4, partnerIds: ["PTR-010"], monthlyVolume: 3_480_000, successRate: 98.5 },
  { code: "NL-MA", sendCountry: "NL", sendCountryName: "Netherlands", sendCurrency: "EUR", receiveCountry: "MA", receiveCountryName: "Morocco", receiveCurrency: "MAD", regionId: "reg-nafr", status: "Active", rails: ["BANK", "CASH"], feePct: 1.25, fxSpreadBps: 80, minAmount: 20, maxAmount: 25000, settlementSlaHrs: 6, partnerIds: ["PTR-013", "PTR-014"], monthlyVolume: 2_890_000, successRate: 97.3 },
  { code: "FR-MA", sendCountry: "FR", sendCountryName: "France", sendCurrency: "EUR", receiveCountry: "MA", receiveCountryName: "Morocco", receiveCurrency: "MAD", regionId: "reg-nafr", status: "Active", rails: ["BANK", "CASH"], feePct: 1.2, fxSpreadBps: 78, minAmount: 20, maxAmount: 25000, settlementSlaHrs: 5, partnerIds: ["PTR-014"], monthlyVolume: 4_010_000, successRate: 98.0 },
  { code: "GB-MA", sendCountry: "GB", sendCountryName: "United Kingdom", sendCurrency: "GBP", receiveCountry: "MA", receiveCountryName: "Morocco", receiveCurrency: "MAD", regionId: "reg-nafr", status: "Onboarding", rails: ["BANK"], feePct: 1.3, fxSpreadBps: 88, minAmount: 25, maxAmount: 20000, settlementSlaHrs: 8, partnerIds: ["PTR-013"], monthlyVolume: 640_000, successRate: 96.1 },
];

export const fxRates: FxRate[] = [
  { id: "fx-1", pair: "GBP/NGN", base: "GBP", quote: "NGN", midRate: 2011.4, liveRate: 2013.2, lockedRate: 2008.0, spreadBps: 85, change24h: 0.42, updatedAt: "2026-08-14T08:30:00Z", locked: false },
  { id: "fx-2", pair: "EUR/NGN", base: "EUR", quote: "NGN", midRate: 1735.9, liveRate: 1738.1, lockedRate: 1732.0, spreadBps: 92, change24h: -0.31, updatedAt: "2026-08-14T08:30:00Z", locked: false },
  { id: "fx-3", pair: "GBP/INR", base: "GBP", quote: "INR", midRate: 105.62, liveRate: 105.74, lockedRate: 105.40, spreadBps: 55, change24h: 0.12, updatedAt: "2026-08-14T08:30:00Z", locked: true },
  { id: "fx-4", pair: "USD/INR", base: "USD", quote: "INR", midRate: 83.41, liveRate: 83.49, lockedRate: 83.30, spreadBps: 60, change24h: 0.08, updatedAt: "2026-08-14T08:30:00Z", locked: false },
  { id: "fx-5", pair: "EUR/INR", base: "EUR", quote: "INR", midRate: 90.18, liveRate: 90.31, lockedRate: 89.95, spreadBps: 62, change24h: -0.17, updatedAt: "2026-08-14T08:30:00Z", locked: false },
  { id: "fx-6", pair: "USD/MXN", base: "USD", quote: "MXN", midRate: 17.12, liveRate: 17.15, lockedRate: 17.08, spreadBps: 70, change24h: 0.55, updatedAt: "2026-08-14T08:30:00Z", locked: false },
  { id: "fx-7", pair: "USD/PHP", base: "USD", quote: "PHP", midRate: 58.34, liveRate: 58.41, lockedRate: 58.20, spreadBps: 68, change24h: 0.21, updatedAt: "2026-08-14T08:30:00Z", locked: true },
  { id: "fx-8", pair: "EUR/PHP", base: "EUR", quote: "PHP", midRate: 62.51, liveRate: 62.60, lockedRate: 62.35, spreadBps: 75, change24h: -0.09, updatedAt: "2026-08-14T08:30:00Z", locked: false },
  { id: "fx-9", pair: "GBP/PHP", base: "GBP", quote: "PHP", midRate: 74.13, liveRate: 74.22, lockedRate: 73.95, spreadBps: 72, change24h: 0.33, updatedAt: "2026-08-14T08:30:00Z", locked: false },
  { id: "fx-10", pair: "EUR/MAD", base: "EUR", quote: "MAD", midRate: 10.82, liveRate: 10.84, lockedRate: 10.79, spreadBps: 80, change24h: 0.04, updatedAt: "2026-08-14T08:30:00Z", locked: false },
  { id: "fx-11", pair: "GBP/MAD", base: "GBP", quote: "MAD", midRate: 12.61, liveRate: 12.63, lockedRate: 12.57, spreadBps: 88, change24h: 0.19, updatedAt: "2026-08-14T08:30:00Z", locked: false },
];

export const exposures: CurrencyExposure[] = [
  { currency: "NGN", netPosition: -1_240_000_000, usdEquivalent: -742_000, hedgedPct: 68, limit: 1_000_000 },
  { currency: "INR", netPosition: -184_000_000, usdEquivalent: -2_206_000, hedgedPct: 81, limit: 3_000_000 },
  { currency: "MXN", netPosition: -41_200_000, usdEquivalent: -2_407_000, hedgedPct: 74, limit: 3_500_000 },
  { currency: "PHP", netPosition: -96_500_000, usdEquivalent: -1_654_000, hedgedPct: 79, limit: 2_500_000 },
  { currency: "MAD", netPosition: -18_900_000, usdEquivalent: -1_746_000, hedgedPct: 62, limit: 2_000_000 },
  { currency: "GBP", netPosition: 3_820_000, usdEquivalent: 4_852_000, hedgedPct: 100, limit: 6_000_000 },
  { currency: "EUR", netPosition: 2_910_000, usdEquivalent: 3_183_000, hedgedPct: 100, limit: 5_000_000 },
  { currency: "USD", netPosition: 5_140_000, usdEquivalent: 5_140_000, hedgedPct: 100, limit: 8_000_000 },
];

export const feeSchedules: FeeSchedule[] = [
  { id: "fee-1", corridorCode: "GB-NG", serviceCode: "RMT", fixedFee: 1.99, pctFee: 1.2, currency: "GBP", minFee: 1.99, maxFee: 45, effectiveFrom: "2026-01-01" },
  { id: "fee-2", corridorCode: "US-MX", serviceCode: "RMT", fixedFee: 2.99, pctFee: 1.3, currency: "USD", minFee: 2.99, maxFee: 40, effectiveFrom: "2026-01-01" },
  { id: "fee-3", corridorCode: "GB-IN", serviceCode: "RMT", fixedFee: 0.99, pctFee: 0.9, currency: "GBP", minFee: 0.99, maxFee: 35, effectiveFrom: "2026-02-01" },
  { id: "fee-4", corridorCode: "US-PH", serviceCode: "RMT", fixedFee: 1.99, pctFee: 1.1, currency: "USD", minFee: 1.99, maxFee: 38, effectiveFrom: "2026-01-15" },
  { id: "fee-5", corridorCode: "NL-MA", serviceCode: "RMT", fixedFee: 2.49, pctFee: 1.25, currency: "EUR", minFee: 2.49, maxFee: 30, effectiveFrom: "2026-03-01" },
  { id: "fee-6", corridorCode: "GB-NG", serviceCode: "B2B", fixedFee: 9.99, pctFee: 0.6, currency: "GBP", minFee: 9.99, maxFee: 250, effectiveFrom: "2026-01-01" },
];

// ── Chart series (monthly) ─────────────────────────────────────────────────────────
const MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

export const volumeSeries: VolumePoint[] = MONTHS.map((m, i) => ({
  date: m,
  volume: Math.round(28_000 + i * 2600 + Math.sin(i / 1.6) * 5200 + (i > 8 ? 6400 : 0)),
  value: Math.round(31.2 + i * 1.9 + Math.sin(i / 1.4) * 4.1),
}));

export const flowSeries: FlowPoint[] = MONTHS.map((m, i) => ({
  date: m,
  inflow: Math.round(38 + i * 2.3 + Math.sin(i / 1.5) * 5),
  outflow: Math.round(31 + i * 2.0 + Math.cos(i / 1.7) * 4),
}));

export const railMixSeries: RailMixPoint[] = MONTHS.map((m, i) => ({
  date: m,
  bank: Math.round(4200 + i * 210 + Math.sin(i / 2) * 400),
  wallet: Math.round(2600 + i * 320 + Math.cos(i / 1.8) * 380),
  cash: Math.round(1800 + i * 90 + Math.sin(i / 2.4) * 260),
}));

export const payoutMethodMix = [
  { name: "Bank", value: 52, key: "bank" },
  { name: "Mobile Wallet", value: 33, key: "wallet" },
  { name: "Cash Pickup", value: 15, key: "cash" },
];
