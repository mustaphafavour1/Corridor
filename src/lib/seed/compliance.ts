import type {
  ComplianceCase,
  ScreeningHit,
  KycRecord,
  RiskRule,
  Alert,
  ApprovalRequest,
} from "@/lib/types";

export const complianceCases: ComplianceCase[] = [
  { id: "CASE-3081", transferId: "TRF-100240", senderId: "SND-4826", subject: "Rapid succession transfers below threshold", type: "Structuring", status: "Escalated", priority: "High", assignee: "R. Okafor", openedOn: "2026-08-11", amount: 8400, currency: "GBP", notes: 4, disposition: "Escalate" },
  { id: "CASE-3082", transferId: "TRF-100251", senderId: "SND-4831", subject: "Sanctions name match — EU consolidated list", type: "Sanctions", status: "In Review", priority: "Critical", assignee: "M. Haddad", openedOn: "2026-08-12", amount: 2100, currency: "EUR", notes: 6 },
  { id: "CASE-3083", transferId: "TRF-100262", senderId: "SND-4829", subject: "High-value B2B payout to new beneficiary", type: "AML", status: "Open", priority: "Medium", assignee: "Unassigned", openedOn: "2026-08-13", amount: 24500, currency: "USD", notes: 1 },
  { id: "CASE-3084", senderId: "SND-4830", subject: "Velocity rule triggered — 9 transfers / 24h", type: "AML", status: "In Review", priority: "Medium", assignee: "R. Okafor", openedOn: "2026-08-10", amount: 12200, currency: "GBP", notes: 3 },
  { id: "CASE-3085", transferId: "TRF-100238", senderId: "SND-4821", subject: "PEP association flagged on beneficiary", type: "Sanctions", status: "Cleared", priority: "Low", assignee: "M. Haddad", openedOn: "2026-08-05", amount: 1500, currency: "GBP", notes: 5, disposition: "Clear" },
  { id: "CASE-3086", senderId: "SND-4835", subject: "KYC document mismatch — DOB / passport", type: "KYC", status: "Open", priority: "Medium", assignee: "Unassigned", openedOn: "2026-08-13", amount: 0, currency: "EUR", notes: 2 },
  { id: "CASE-3087", transferId: "TRF-100244", senderId: "SND-4834", subject: "Fraud pattern — device reuse across senders", type: "Fraud", status: "Escalated", priority: "High", assignee: "A. Bello", openedOn: "2026-08-09", amount: 18700, currency: "USD", notes: 7, disposition: "Escalate" },
  { id: "CASE-3088", transferId: "TRF-100255", senderId: "SND-4833", subject: "Threshold breach — cumulative monthly limit", type: "AML", status: "Filed", priority: "High", assignee: "A. Bello", openedOn: "2026-08-02", amount: 40100, currency: "EUR", notes: 9, disposition: "File SAR" },
  { id: "CASE-3089", senderId: "SND-4827", subject: "Beneficiary bank in elevated-risk jurisdiction", type: "AML", status: "In Review", priority: "Low", assignee: "R. Okafor", openedOn: "2026-08-12", amount: 3200, currency: "USD", notes: 2 },
  { id: "CASE-3090", transferId: "TRF-100271", senderId: "SND-4823", subject: "Unusual corridor for sender profile", type: "AML", status: "Open", priority: "Low", assignee: "Unassigned", openedOn: "2026-08-14", amount: 5600, currency: "GBP", notes: 0 },
];

export const screeningHits: ScreeningHit[] = [
  { id: "SCR-901", transferId: "TRF-100251", entityName: "Elena Popescu", matchedName: "Elena POPESCU", list: "EU", matchScore: 88, matchType: "Name", status: "Pending", screenedOn: "2026-08-12" },
  { id: "SCR-902", transferId: "TRF-100238", entityName: "Ngozi Bankole", matchedName: "N. Bankole", list: "PEP", matchScore: 62, matchType: "Alias", status: "False Positive", screenedOn: "2026-08-05" },
  { id: "SCR-903", transferId: "TRF-100262", entityName: "Meera Patel", matchedName: "Mira Patel", list: "OFAC", matchScore: 54, matchType: "Name", status: "False Positive", screenedOn: "2026-08-13" },
  { id: "SCR-904", entityName: "Hassan Benali", matchedName: "Hassan BEN ALI", list: "UN", matchScore: 79, matchType: "Name", status: "Pending", screenedOn: "2026-08-12" },
  { id: "SCR-905", transferId: "TRF-100244", entityName: "Ana Cruz", matchedName: "Ana CRUZ", list: "Interpol", matchScore: 71, matchType: "Geography", status: "Pending", screenedOn: "2026-08-09" },
  { id: "SCR-906", entityName: "Kwame Asante", matchedName: "Kwame ASANTE", list: "PEP", matchScore: 66, matchType: "DOB", status: "Pending", screenedOn: "2026-08-13" },
  { id: "SCR-907", entityName: "Omar Benali", matchedName: "Omar BEN ALI", list: "OFAC", matchScore: 48, matchType: "Alias", status: "False Positive", screenedOn: "2026-08-07" },
  { id: "SCR-908", entityName: "James Okoro", matchedName: "James OKORO", list: "EU", matchScore: 83, matchType: "Name", status: "True Positive", screenedOn: "2026-08-11" },
];

export const kycRecords: KycRecord[] = [
  { id: "KYC-701", subjectId: "SND-4821", subjectName: "Adeola Bankole", subjectType: "Sender", docType: "Passport", tier: "Tier 3", status: "Verified", submittedOn: "2024-03-12", expiresOn: "2029-03-11", mismatchFlags: 0 },
  { id: "KYC-702", subjectId: "SND-4826", subjectName: "James Okoro", subjectType: "Sender", docType: "Driver License", tier: "Tier 1", status: "Pending", submittedOn: "2026-06-18", mismatchFlags: 2 },
  { id: "KYC-703", subjectId: "SND-4831", subjectName: "Elena Popescu", subjectType: "Sender", docType: "National ID", tier: "Tier 1", status: "Rejected", submittedOn: "2026-07-29", mismatchFlags: 3 },
  { id: "KYC-704", subjectId: "SND-4835", subjectName: "Kwame Asante", subjectType: "Sender", docType: "Passport", tier: "Tier 2", status: "Pending", submittedOn: "2025-04-27", mismatchFlags: 1 },
  { id: "KYC-705", subjectId: "PTR-003", subjectName: "Zeepay Ghana Ltd", subjectType: "Partner", docType: "Cert. of Incorp.", tier: "Tier 3", status: "Pending", submittedOn: "2026-07-30", mismatchFlags: 0 },
  { id: "KYC-706", subjectId: "PTR-012", subjectName: "Palawan Pawnshop Inc", subjectType: "Partner", docType: "Cert. of Incorp.", tier: "Tier 3", status: "Pending", submittedOn: "2026-08-01", mismatchFlags: 1 },
  { id: "KYC-707", subjectId: "BEN-2005", subjectName: "Lakshmi Nair", subjectType: "Beneficiary", docType: "National ID", tier: "Tier 2", status: "Pending", submittedOn: "2026-08-04", mismatchFlags: 0 },
  { id: "KYC-708", subjectId: "SND-4829", subjectName: "Rajesh Patel", subjectType: "Sender", docType: "Passport", tier: "Tier 3", status: "Verified", submittedOn: "2023-06-22", expiresOn: "2028-06-21", mismatchFlags: 0 },
  { id: "KYC-709", subjectId: "SND-4836", subjectName: "Layla Haddad", subjectType: "Sender", docType: "Passport", tier: "Tier 3", status: "Verified", submittedOn: "2024-06-09", expiresOn: "2030-01-14", mismatchFlags: 0 },
  { id: "KYC-710", subjectId: "BEN-2022", subjectName: "Efua Asante", subjectType: "Beneficiary", docType: "Utility Bill", tier: "Tier 1", status: "Pending", submittedOn: "2026-08-10", mismatchFlags: 1 },
];

export const riskRules: RiskRule[] = [
  { id: "RR-01", name: "Structuring — sub-threshold clustering", category: "Structuring", description: "≥3 transfers within 90% of reporting threshold in 24h", threshold: "3 / 24h", enabled: true, triggeredCount: 42, severity: "High" },
  { id: "RR-02", name: "Velocity — transfer frequency", category: "Velocity", description: "More than 8 transfers by one sender in 24h", threshold: "8 / 24h", enabled: true, triggeredCount: 118, severity: "Medium" },
  { id: "RR-03", name: "Single-transfer threshold", category: "Threshold", description: "Single transfer at or above USD 15,000 equivalent", threshold: "≥ $15,000", enabled: true, triggeredCount: 67, severity: "High" },
  { id: "RR-04", name: "High-risk geography", category: "Geography", description: "Beneficiary bank domiciled in FATF grey-list jurisdiction", threshold: "FATF grey-list", enabled: true, triggeredCount: 23, severity: "Critical" },
  { id: "RR-05", name: "Dormant-then-active", category: "Pattern", description: "Account dormant 90d+ then large transfer", threshold: "90d + ≥$5k", enabled: true, triggeredCount: 14, severity: "Medium" },
  { id: "RR-06", name: "New beneficiary large payout", category: "Pattern", description: "First payout to new beneficiary above USD 10,000", threshold: "≥ $10,000", enabled: false, triggeredCount: 9, severity: "Medium" },
  { id: "RR-07", name: "Device / IP reuse", category: "Pattern", description: "Same device fingerprint across ≥4 sender accounts", threshold: "≥4 senders", enabled: true, triggeredCount: 31, severity: "High" },
  { id: "RR-08", name: "Cumulative monthly limit", category: "Threshold", description: "Sender approaching or breaching monthly limit", threshold: "≥ 95% limit", enabled: true, triggeredCount: 88, severity: "Low" },
];

export const alerts: Alert[] = [
  { id: "ALT-01", timestamp: "2026-08-14T07:42:00Z", type: "Liquidity", severity: "Critical", title: "Critical float — CashPlus Maroc (NL-MA)", detail: "Float at 6% of target; projected depletion in ~5h at current run-rate.", corridorCode: "NL-MA", partnerId: "PTR-013", resolved: false },
  { id: "ALT-02", timestamp: "2026-08-14T06:15:00Z", type: "Compliance", severity: "Critical", title: "Sanctions hit pending disposition", detail: "EU list match (88%) on SND-4831 held for review beyond SLA.", resolved: false },
  { id: "ALT-03", timestamp: "2026-08-13T22:03:00Z", type: "Liquidity", severity: "High", title: "Low float — Moniepoint (NL-NG)", detail: "Float at 18% of target; top-up recommended before EOD cycle.", corridorCode: "NL-NG", partnerId: "PTR-002", resolved: false },
  { id: "ALT-04", timestamp: "2026-08-13T18:20:00Z", type: "Payout", severity: "Medium", title: "Elevated payout failures — GB-MA", detail: "Failure rate 3.9% over last 4h, above 2% corridor baseline.", corridorCode: "GB-MA", resolved: false },
  { id: "ALT-05", timestamp: "2026-08-13T14:50:00Z", type: "FX", severity: "Medium", title: "USD/MXN moved +0.55% intraday", detail: "Locked-rate exposure on 14 open transfers; review hedging.", resolved: false },
  { id: "ALT-06", timestamp: "2026-08-13T11:30:00Z", type: "Liquidity", severity: "High", title: "Low float — Airtel Payments (DE-IN)", detail: "Float at 18% of target on DE-IN corridor.", corridorCode: "DE-IN", partnerId: "PTR-006", resolved: false },
  { id: "ALT-07", timestamp: "2026-08-12T16:12:00Z", type: "Compliance", severity: "High", title: "Structuring pattern — SND-4826", detail: "3 sub-threshold transfers in 24h; case CASE-3081 escalated.", resolved: false },
  { id: "ALT-08", timestamp: "2026-08-12T09:05:00Z", type: "System", severity: "Low", title: "Webhook endpoint failing", detail: "payments.settled deliveries failing for 1 endpoint (12 retries).", resolved: true },
];

// ── Maker-checker: pre-seeded pending high-value items so the queue is populated ──
export const approvalRequests: ApprovalRequest[] = [
  { id: "APR-6001", type: "High-Value Transfer", summary: "Transfer £24,500 · GB-IN · B2B to new beneficiary", refId: "TRF-100262", amount: 24500, currency: "GBP", corridorCode: "GB-IN", requestedBy: "A. Bello (Ops)", requestedOn: "2026-08-14T08:10:00Z", status: "Pending" },
  { id: "APR-6002", type: "High-Value Transfer", summary: "Transfer $28,900 · US-MX · RMT above single-txn threshold", refId: "TRF-100244", amount: 28900, currency: "USD", corridorCode: "US-MX", requestedBy: "S. Reyes (Ops)", requestedOn: "2026-08-14T07:55:00Z", status: "Pending" },
  { id: "APR-6003", type: "Liquidity Change", summary: "Pre-fund top-up €450,000 to CashPlus Maroc (NL-MA)", refId: "FLT-013-NL-MA", amount: 450000, currency: "EUR", corridorCode: "NL-MA", requestedBy: "Treasury Desk", requestedOn: "2026-08-14T07:30:00Z", status: "Pending" },
  { id: "APR-6004", type: "Config Edit", summary: "Raise GB-NG corridor max limit £40k → £60k", refId: "GB-NG", corridorCode: "GB-NG", requestedBy: "R. Okafor (Admin)", requestedOn: "2026-08-13T19:40:00Z", status: "Pending" },
  { id: "APR-6005", type: "Risk Rule Change", summary: "Disable rule RR-06 (new beneficiary large payout)", refId: "RR-06", requestedBy: "M. Haddad (Compliance)", requestedOn: "2026-08-13T15:22:00Z", status: "Pending" },
  { id: "APR-6006", type: "Partner Onboarding", summary: "Approve KYB for Zeepay Ghana (reg-waf)", refId: "PTR-003", requestedBy: "Ops HQ", requestedOn: "2026-08-13T12:05:00Z", status: "Pending" },
  { id: "APR-6007", type: "High-Value Transfer", summary: "Transfer €40,100 · FR-MA · above monthly limit", refId: "TRF-100255", amount: 40100, currency: "EUR", corridorCode: "FR-MA", requestedBy: "H. Benali (Ops)", requestedOn: "2026-08-12T10:15:00Z", status: "Approved", approver: "A. Bello", decidedOn: "2026-08-12T11:02:00Z", rationale: "Verified source of funds; SAR filed in parallel." },
  { id: "APR-6008", type: "High-Value Transfer", summary: "Transfer £18,200 · GB-NG · RMT", refId: "TRF-100231", amount: 18200, currency: "GBP", corridorCode: "GB-NG", requestedBy: "C. Nwankwo (Ops)", requestedOn: "2026-08-11T14:30:00Z", status: "Rejected", approver: "R. Okafor", decidedOn: "2026-08-11T15:10:00Z", rationale: "Beneficiary verification incomplete; resubmit after KYC." },
];
