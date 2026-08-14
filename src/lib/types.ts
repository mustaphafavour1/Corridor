/**
 * ── CORRIDOR CORE DATA MODEL ──────────────────────────────────────────────────
 * 24 entities spanning senders, beneficiaries, partners, corridors, transfers,
 * FX, ledger, treasury float, compliance, approvals, reconciliation, RBAC,
 * territories, reporting, audit and the integration surface. All data synthetic.
 * ──────────────────────────────────────────────────────────────────────────────
 */

export type Currency = "USD" | "EUR" | "GBP" | "NGN" | "MXN" | "PHP" | "INR" | "MAD";

export type PayoutMethod = "bank" | "wallet" | "cash";
export type Rail = "BANK" | "WALLET" | "CASH";
export type ServiceCode = "RMT" | "B2B" | "PAYROLL" | "PENSION";

// ── RBAC ──────────────────────────────────────────────────────────────────────
export type BaseRole = "super_admin" | "admin" | "partner";
export type PermissionLevel = "none" | "view" | "edit";

export type ModuleKey =
  | "overview"
  | "transfers"
  | "senders"
  | "corridors"
  | "partners"
  | "treasury"
  | "compliance"
  | "approvals"
  | "reconciliation"
  | "analytics"
  | "users"
  | "integration"
  | "reports"
  | "audit"
  | "config";

export interface Role {
  id: string;
  name: string;
  base: BaseRole | "custom";
  description: string;
  system: boolean; // built-in roles can't be deleted
  permissions: Record<ModuleKey, PermissionLevel>;
  userCount: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
  status: "Active" | "Inactive" | "Suspended";
  assignedRegions: string[]; // region ids; [] === global
  assignedCorridors: string[]; // corridor codes; [] === all in region
  partnerId?: string; // set when the user is a payout-partner agent
  lastLogin: string;
  createdOn: string;
  avatarColor: string;
}

// ── Territory / Region ─────────────────────────────────────────────────────────
export interface Region {
  id: string;
  name: string;
  code: string;
  countries: string[];
  timezone: string;
}

// ── Corridor ────────────────────────────────────────────────────────────────────
export interface Corridor {
  code: string; // e.g. "GB-NG"
  sendCountry: string;
  sendCountryName: string;
  sendCurrency: Currency;
  receiveCountry: string;
  receiveCountryName: string;
  receiveCurrency: Currency;
  regionId: string;
  status: "Active" | "Paused" | "Onboarding";
  rails: Rail[];
  feePct: number;
  fxSpreadBps: number; // basis points
  minAmount: number;
  maxAmount: number;
  settlementSlaHrs: number;
  partnerIds: string[];
  monthlyVolume: number; // in send currency, synthetic
  successRate: number;
}

// ── FX ────────────────────────────────────────────────────────────────────────
export interface FxRate {
  id: string;
  pair: string; // "GBP/NGN"
  base: Currency;
  quote: Currency;
  midRate: number;
  liveRate: number;
  lockedRate: number;
  spreadBps: number;
  change24h: number; // pct
  updatedAt: string;
  locked: boolean;
}

export interface CurrencyExposure {
  currency: Currency;
  netPosition: number; // + long / - short, in that currency
  usdEquivalent: number;
  hedgedPct: number;
  limit: number;
}

// ── Senders & Beneficiaries ──────────────────────────────────────────────────────
export type KycTier = "Tier 1" | "Tier 2" | "Tier 3";
export type VerificationStatus = "Verified" | "Pending" | "Rejected" | "Expired";

export interface Sender {
  id: string; // "SND-4821"
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  countryName: string;
  regionId: string;
  kycTier: KycTier;
  kycStatus: VerificationStatus;
  monthlyLimit: number;
  currency: Currency;
  riskScore: number; // 0-100
  status: "Active" | "Inactive" | "Flagged" | "Blocked";
  beneficiaryIds: string[];
  totalSent: number;
  transferCount: number;
  joinedOn: string;
}

export interface Beneficiary {
  id: string; // "BEN-2093"
  senderId: string;
  name: string;
  country: string;
  countryName: string;
  corridorCode: string;
  method: PayoutMethod;
  currency: Currency;
  // rail-specific
  bankName?: string;
  accountNumber?: string; // masked
  iban?: string;
  walletProvider?: string;
  walletNumber?: string;
  pickupProvider?: string;
  relationship: string;
  verification: VerificationStatus;
  lastPaidOn?: string;
}

// ── Payout Partners & Treasury ────────────────────────────────────────────────────
export interface PayoutPartner {
  id: string; // "PTR-014"
  name: string;
  legalName: string;
  country: string;
  countryName: string;
  regionId: string;
  corridors: string[]; // corridor codes covered
  kybStatus: VerificationStatus;
  status: "Active" | "Suspended" | "Onboarding";
  rails: Rail[];
  successRate: number;
  avgPayoutMins: number;
  commissionPct: number;
  contactName: string;
  contactEmail: string;
  onboardedOn: string;
  topFailureReason: string;
}

export interface FloatAccount {
  id: string;
  partnerId: string;
  corridorCode: string;
  currency: Currency;
  balance: number;
  prefunded: number;
  minThreshold: number;
  targetBalance: number;
  utilisation: number; // pct of target consumed
  status: "Healthy" | "Low" | "Critical";
  lastToppedUp: string;
}

// ── Transfers & lifecycle ─────────────────────────────────────────────────────────
export type TransferStatus =
  | "Initiated"
  | "Screened"
  | "Funded"
  | "Routed"
  | "PaidOut"
  | "Settled"
  | "OnHold"
  | "Reversed"
  | "Failed";

export interface Transfer {
  id: string; // "TRF-..."
  reference: string; // "SND-4821 / GB-NG / RMT / 500GBP / BANK"
  senderId: string;
  senderName: string;
  beneficiaryId: string;
  beneficiaryName: string;
  corridorCode: string;
  serviceCode: ServiceCode;
  rail: Rail;
  partnerId: string;
  sendAmount: number;
  sendCurrency: Currency;
  fxRate: number;
  receiveAmount: number;
  receiveCurrency: Currency;
  feeAmount: number;
  partnerCommission: number;
  status: TransferStatus;
  riskFlagged: boolean;
  createdAt: string;
  settledAt?: string;
}

export interface LedgerEntry {
  id: string;
  transferId?: string;
  date: string;
  account: string;
  direction: "debit" | "credit";
  type: "Funding" | "Payout" | "Commission" | "Fee" | "FX" | "Adjustment";
  amount: number;
  currency: Currency;
  balance: number;
}

export interface Settlement {
  id: string;
  partnerId: string;
  corridorCode: string;
  cycleDate: string;
  grossAmount: number;
  commission: number;
  netAmount: number;
  currency: Currency;
  itemCount: number;
  status: "Settled" | "Pending" | "Failed";
}

// ── Compliance & risk ─────────────────────────────────────────────────────────────
export type CaseStatus = "Open" | "In Review" | "Escalated" | "Cleared" | "Filed";
export type CasePriority = "Low" | "Medium" | "High" | "Critical";

export interface ComplianceCase {
  id: string; // "CASE-..."
  transferId?: string;
  senderId?: string;
  subject: string;
  type: "AML" | "Sanctions" | "Fraud" | "KYC" | "Structuring";
  status: CaseStatus;
  priority: CasePriority;
  assignee: string;
  openedOn: string;
  amount: number;
  currency: Currency;
  notes: number;
  disposition?: "Escalate" | "Clear" | "File SAR";
}

export interface ScreeningHit {
  id: string;
  transferId?: string;
  entityName: string;
  matchedName: string;
  list: "OFAC" | "EU" | "UN" | "PEP" | "Interpol";
  matchScore: number; // 0-100
  matchType: "Name" | "Alias" | "DOB" | "Geography";
  status: "Pending" | "True Positive" | "False Positive";
  screenedOn: string;
}

export interface KycRecord {
  id: string;
  subjectId: string; // sender / beneficiary / partner id
  subjectName: string;
  subjectType: "Sender" | "Beneficiary" | "Partner";
  docType: "Passport" | "National ID" | "Driver License" | "Cert. of Incorp." | "Utility Bill";
  tier: KycTier;
  status: VerificationStatus;
  submittedOn: string;
  expiresOn?: string;
  mismatchFlags: number;
}

export interface RiskRule {
  id: string;
  name: string;
  category: "Velocity" | "Structuring" | "Threshold" | "Geography" | "Pattern";
  description: string;
  threshold: string;
  enabled: boolean;
  triggeredCount: number;
  severity: CasePriority;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: "Compliance" | "Liquidity" | "Payout" | "FX" | "System";
  severity: CasePriority;
  title: string;
  detail: string;
  corridorCode?: string;
  partnerId?: string;
  resolved: boolean;
}

// ── Maker-checker approvals ────────────────────────────────────────────────────────
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export interface ApprovalRequest {
  id: string; // "APR-..."
  type: "High-Value Transfer" | "Liquidity Change" | "Config Edit" | "Partner Onboarding" | "Risk Rule Change";
  summary: string;
  refId: string; // linked entity
  amount?: number;
  currency?: Currency;
  corridorCode?: string;
  requestedBy: string;
  requestedOn: string;
  status: ApprovalStatus;
  approver?: string;
  decidedOn?: string;
  rationale?: string;
}

// ── Reconciliation ────────────────────────────────────────────────────────────────
export interface ReconciliationItem {
  id: string;
  partnerId: string;
  corridorCode: string;
  transferId?: string;
  ourAmount: number;
  partnerAmount: number;
  currency: Currency;
  variance: number;
  status: "Matched" | "Break" | "Investigating" | "Resolved";
  breakReason?: string;
  cycleDate: string;
}

// ── Reporting / Audit / Integration ────────────────────────────────────────────────
export interface Report {
  id: string;
  name: string;
  category: "Transaction Register" | "Threshold" | "SAR/STR" | "Settlement" | "FX Exposure";
  period: string;
  generatedOn: string;
  format: "PDF" | "XLS" | "CSV";
  size: string;
  status: "Ready" | "Generating" | "Scheduled";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  module: ModuleKey;
  target: string;
  result: "success" | "denied";
  ip: string;
}

export interface ApiKey {
  id: string;
  label: string;
  environment: "Sandbox" | "Production";
  keyPreview: string; // "ck_live_••••4821"
  createdOn: string;
  lastUsed: string;
  scopes: string[];
  status: "Active" | "Revoked";
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: "Active" | "Failing" | "Disabled";
  successRate: number;
  lastDelivery: string;
}

export interface EventLog {
  id: string;
  timestamp: string;
  event: string;
  status: number; // http-like
  latencyMs: number;
}

export interface FeeSchedule {
  id: string;
  corridorCode: string;
  serviceCode: ServiceCode;
  fixedFee: number;
  pctFee: number;
  currency: Currency;
  minFee: number;
  maxFee: number;
  effectiveFrom: string;
}

// ── Time-series shapes for charts ───────────────────────────────────────────────────
export interface VolumePoint {
  date: string;
  volume: number;
  value: number;
}
export interface FlowPoint {
  date: string;
  inflow: number;
  outflow: number;
}
export interface RailMixPoint {
  date: string;
  bank: number;
  wallet: number;
  cash: number;
}
