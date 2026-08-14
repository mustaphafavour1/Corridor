import type {
  Role,
  User,
  ModuleKey,
  PermissionLevel,
  Report,
  AuditLogEntry,
  ApiKey,
  Webhook,
  EventLog,
} from "@/lib/types";

export const MODULES: { key: ModuleKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "transfers", label: "Transfers" },
  { key: "senders", label: "Senders & Beneficiaries" },
  { key: "corridors", label: "Corridors & FX" },
  { key: "partners", label: "Payout Partners" },
  { key: "treasury", label: "Treasury & Liquidity" },
  { key: "compliance", label: "Compliance & Risk" },
  { key: "approvals", label: "Approvals" },
  { key: "reconciliation", label: "Reconciliation" },
  { key: "analytics", label: "Analytics" },
  { key: "users", label: "User Management" },
  { key: "integration", label: "Integration Console" },
  { key: "reports", label: "Reports" },
  { key: "audit", label: "Audit Log" },
  { key: "config", label: "Platform Config" },
];

const ALL_MODULES = MODULES.map((m) => m.key);

function perms(
  defaultLevel: PermissionLevel,
  overrides: Partial<Record<ModuleKey, PermissionLevel>> = {},
): Record<ModuleKey, PermissionLevel> {
  const out = {} as Record<ModuleKey, PermissionLevel>;
  for (const k of ALL_MODULES) out[k] = defaultLevel;
  return { ...out, ...overrides };
}

export const roles: Role[] = [
  {
    id: "role-super",
    name: "Super Admin",
    base: "super_admin",
    description: "Platform / Compliance HQ — full global access across every corridor, region and module.",
    system: true,
    permissions: perms("edit"),
    userCount: 3,
  },
  {
    id: "role-admin",
    name: "Regional Operations Manager",
    base: "admin",
    description: "Scoped to a region or corridor set — manages senders, transfers, partners and approvals in scope.",
    system: true,
    permissions: perms("edit", {
      users: "view",
      integration: "none",
      config: "view",
      audit: "view",
      compliance: "view",
    }),
    userCount: 6,
  },
  {
    id: "role-partner",
    name: "Payout Partner (Agent)",
    base: "partner",
    description: "Distribution partner — receives payout instructions, manages float, confirms disbursement and reconciles.",
    system: true,
    permissions: perms("none", {
      overview: "view",
      transfers: "view",
      partners: "view",
      treasury: "edit",
      reconciliation: "edit",
      reports: "view",
    }),
    userCount: 11,
  },
  {
    id: "role-compliance",
    name: "Compliance Analyst",
    base: "custom",
    description: "Custom — investigates cases, dispositions screening hits and drafts regulatory reports.",
    system: false,
    permissions: perms("none", {
      overview: "view",
      transfers: "view",
      senders: "view",
      compliance: "edit",
      approvals: "view",
      analytics: "view",
      reports: "edit",
      audit: "view",
    }),
    userCount: 4,
  },
  {
    id: "role-treasury",
    name: "Treasury Manager",
    base: "custom",
    description: "Custom — owns corridor liquidity, FX exposure, pre-funding and settlement timing.",
    system: false,
    permissions: perms("none", {
      overview: "view",
      corridors: "edit",
      partners: "view",
      treasury: "edit",
      reconciliation: "edit",
      analytics: "view",
      approvals: "view",
      reports: "view",
    }),
    userCount: 2,
  },
];

export const users: User[] = [
  { id: "USR-001", firstName: "Amara", lastName: "Diallo", email: "amara.diallo@corridor.io", phone: "+44 20 7946 0011", roleId: "role-super", status: "Active", assignedRegions: [], assignedCorridors: [], lastLogin: "2026-08-14T08:05:00Z", createdOn: "2023-01-10", avatarColor: "var(--accent)" },
  { id: "USR-002", firstName: "Ruth", lastName: "Okafor", email: "ruth.okafor@corridor.io", phone: "+234 812 233 4455", roleId: "role-admin", status: "Active", assignedRegions: ["reg-waf"], assignedCorridors: ["GB-NG", "NL-NG"], lastLogin: "2026-08-14T07:40:00Z", createdOn: "2023-05-19", avatarColor: "var(--info)" },
  { id: "USR-003", firstName: "Diego", lastName: "Ramírez", email: "diego.ramirez@corridor.io", phone: "+52 55 1234 5678", roleId: "role-admin", status: "Active", assignedRegions: ["reg-latam"], assignedCorridors: ["US-MX"], lastLogin: "2026-08-13T21:15:00Z", createdOn: "2023-08-02", avatarColor: "var(--success)" },
  { id: "USR-004", firstName: "Mariam", lastName: "Haddad", email: "mariam.haddad@corridor.io", phone: "+33 1 42 68 53 00", roleId: "role-compliance", status: "Active", assignedRegions: [], assignedCorridors: [], lastLogin: "2026-08-14T06:22:00Z", createdOn: "2024-02-14", avatarColor: "var(--violet)" },
  { id: "USR-005", firstName: "Sven", lastName: "Larsson", email: "sven.larsson@corridor.io", phone: "+44 20 7946 0042", roleId: "role-treasury", status: "Active", assignedRegions: [], assignedCorridors: [], lastLogin: "2026-08-14T05:50:00Z", createdOn: "2024-06-01", avatarColor: "var(--warning)" },
  { id: "USR-006", firstName: "Tayo", lastName: "Oviosu", email: "tayo@paga.ng", phone: "+234 803 000 1122", roleId: "role-partner", status: "Active", assignedRegions: ["reg-waf"], assignedCorridors: ["GB-NG"], partnerId: "PTR-001", lastLogin: "2026-08-14T08:30:00Z", createdOn: "2023-04-11", avatarColor: "var(--brand)" },
  { id: "USR-007", firstName: "Jean", lastName: "Lhuillier", email: "jean@cebuana.com", phone: "+63 917 000 3344", roleId: "role-partner", status: "Active", assignedRegions: ["reg-sea"], assignedCorridors: ["US-PH", "GB-PH"], partnerId: "PTR-010", lastLogin: "2026-08-14T01:12:00Z", createdOn: "2022-09-27", avatarColor: "var(--brand-muted)" },
  { id: "USR-008", firstName: "Nabil", lastName: "Adel", email: "nabil@cashplus.ma", phone: "+212 522 000 556", roleId: "role-partner", status: "Active", assignedRegions: ["reg-nafr"], assignedCorridors: ["NL-MA", "GB-MA"], partnerId: "PTR-013", lastLogin: "2026-08-13T18:44:00Z", createdOn: "2023-08-19", avatarColor: "var(--info)" },
  { id: "USR-009", firstName: "Priya", lastName: "Menon", email: "priya.menon@corridor.io", phone: "+44 20 7946 0088", roleId: "role-compliance", status: "Active", assignedRegions: ["reg-sasia"], assignedCorridors: [], lastLogin: "2026-08-13T16:05:00Z", createdOn: "2024-09-11", avatarColor: "var(--violet)" },
  { id: "USR-010", firstName: "Felix", lastName: "Adeyemi", email: "felix.adeyemi@corridor.io", phone: "+234 809 555 7788", roleId: "role-admin", status: "Inactive", assignedRegions: ["reg-waf"], assignedCorridors: [], lastLogin: "2026-07-28T10:00:00Z", createdOn: "2024-03-20", avatarColor: "var(--text-muted)" },
];

export const reports: Report[] = [
  { id: "REP-01", name: "Transaction Register — August 2026", category: "Transaction Register", period: "01–14 Aug 2026", generatedOn: "2026-08-14", format: "CSV", size: "2.4 MB", status: "Ready" },
  { id: "REP-02", name: "Threshold Report (≥ $15k)", category: "Threshold", period: "Jul 2026", generatedOn: "2026-08-01", format: "PDF", size: "812 KB", status: "Ready" },
  { id: "REP-03", name: "SAR Draft — CASE-3088", category: "SAR/STR", period: "Aug 2026", generatedOn: "2026-08-13", format: "PDF", size: "146 KB", status: "Ready" },
  { id: "REP-04", name: "Partner Settlement Statement — Paga", category: "Settlement", period: "13 Aug 2026", generatedOn: "2026-08-14", format: "XLS", size: "1.1 MB", status: "Ready" },
  { id: "REP-05", name: "FX Exposure Snapshot", category: "FX Exposure", period: "14 Aug 2026", generatedOn: "2026-08-14", format: "PDF", size: "402 KB", status: "Generating" },
  { id: "REP-06", name: "Transaction Register — Q3 2026", category: "Transaction Register", period: "Q3 2026", generatedOn: "—", format: "CSV", size: "—", status: "Scheduled" },
];

export const auditLog: AuditLogEntry[] = [
  { id: "AUD-9001", timestamp: "2026-08-14T08:32:00Z", actor: "Amara Diallo", actorRole: "Super Admin", action: "Approved liquidity top-up", module: "approvals", target: "APR-6003", result: "success", ip: "81.2.69.142" },
  { id: "AUD-9002", timestamp: "2026-08-14T08:10:00Z", actor: "A. Bello", actorRole: "Regional Ops", action: "Submitted high-value transfer for approval", module: "transfers", target: "TRF-100262", result: "success", ip: "102.89.34.7" },
  { id: "AUD-9003", timestamp: "2026-08-14T07:41:00Z", actor: "Mariam Haddad", actorRole: "Compliance Analyst", action: "Opened compliance case", module: "compliance", target: "CASE-3082", result: "success", ip: "92.184.99.10" },
  { id: "AUD-9004", timestamp: "2026-08-14T07:12:00Z", actor: "Felix Adeyemi", actorRole: "Regional Ops", action: "Attempted config edit outside scope", module: "config", target: "GB-IN", result: "denied", ip: "197.210.55.2" },
  { id: "AUD-9005", timestamp: "2026-08-13T22:03:00Z", actor: "System", actorRole: "System", action: "Raised low-float alert", module: "treasury", target: "PTR-002 / NL-NG", result: "success", ip: "—" },
  { id: "AUD-9006", timestamp: "2026-08-13T19:40:00Z", actor: "Ruth Okafor", actorRole: "Regional Ops", action: "Requested corridor limit change", module: "corridors", target: "GB-NG", result: "success", ip: "102.89.34.7" },
  { id: "AUD-9007", timestamp: "2026-08-13T16:20:00Z", actor: "Sven Larsson", actorRole: "Treasury Manager", action: "Locked FX rate", module: "corridors", target: "GBP/INR", result: "success", ip: "81.2.69.160" },
  { id: "AUD-9008", timestamp: "2026-08-13T14:05:00Z", actor: "Amara Diallo", actorRole: "Super Admin", action: "Created custom role", module: "users", target: "Treasury Manager", result: "success", ip: "81.2.69.142" },
];

export const apiKeys: ApiKey[] = [
  { id: "KEY-01", label: "Production — Core Ledger", environment: "Production", keyPreview: "ck_live_••••4821", createdOn: "2024-01-15", lastUsed: "2026-08-14", scopes: ["transfers:write", "payouts:write", "fx:read"], status: "Active" },
  { id: "KEY-02", label: "Sandbox — Integration Test", environment: "Sandbox", keyPreview: "ck_test_••••9930", createdOn: "2026-06-02", lastUsed: "2026-08-13", scopes: ["transfers:write", "webhooks:manage"], status: "Active" },
  { id: "KEY-03", label: "Production — Reconciliation Bot", environment: "Production", keyPreview: "ck_live_••••2210", createdOn: "2025-03-11", lastUsed: "2026-08-14", scopes: ["settlements:read", "recon:write"], status: "Active" },
  { id: "KEY-04", label: "Sandbox — Deprecated", environment: "Sandbox", keyPreview: "ck_test_••••0071", createdOn: "2025-09-20", lastUsed: "2026-02-10", scopes: ["transfers:read"], status: "Revoked" },
];

export const webhooks: Webhook[] = [
  { id: "WH-01", url: "https://ops.corridor.io/hooks/transfers", events: ["transfer.created", "transfer.settled", "transfer.failed"], status: "Active", successRate: 99.8, lastDelivery: "2026-08-14T08:31:00Z" },
  { id: "WH-02", url: "https://treasury.corridor.io/hooks/liquidity", events: ["float.low", "float.critical"], status: "Active", successRate: 100, lastDelivery: "2026-08-14T07:42:00Z" },
  { id: "WH-03", url: "https://partner.paga.ng/callbacks/payout", events: ["payout.instructed", "payout.confirmed"], status: "Failing", successRate: 91.2, lastDelivery: "2026-08-14T08:12:00Z" },
  { id: "WH-04", url: "https://legacy.corridor.io/hooks/all", events: ["*"], status: "Disabled", successRate: 0, lastDelivery: "2026-06-01T00:00:00Z" },
];

export const eventLogs: EventLog[] = [
  { id: "EVT-1", timestamp: "2026-08-14T08:31:04Z", event: "transfer.settled", status: 200, latencyMs: 142 },
  { id: "EVT-2", timestamp: "2026-08-14T08:30:51Z", event: "transfer.created", status: 200, latencyMs: 98 },
  { id: "EVT-3", timestamp: "2026-08-14T08:29:33Z", event: "payout.confirmed", status: 200, latencyMs: 210 },
  { id: "EVT-4", timestamp: "2026-08-14T08:28:12Z", event: "payout.instructed", status: 500, latencyMs: 3021 },
  { id: "EVT-5", timestamp: "2026-08-14T08:27:45Z", event: "float.low", status: 200, latencyMs: 76 },
  { id: "EVT-6", timestamp: "2026-08-14T08:26:02Z", event: "transfer.failed", status: 200, latencyMs: 120 },
  { id: "EVT-7", timestamp: "2026-08-14T08:25:19Z", event: "screening.hit", status: 200, latencyMs: 340 },
  { id: "EVT-8", timestamp: "2026-08-14T08:24:00Z", event: "payout.confirmed", status: 429, latencyMs: 1502 },
];
