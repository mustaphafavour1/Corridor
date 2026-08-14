import { regions, corridors, fxRates, exposures, feeSchedules, volumeSeries, flowSeries, railMixSeries, payoutMethodMix } from "@/lib/seed/reference";
import { senders, beneficiaries, partners, floatAccounts } from "@/lib/seed/parties";
import { transfers, ledgerEntries, settlements, reconciliationItems } from "@/lib/seed/activity";
import { complianceCases, screeningHits, kycRecords, riskRules, alerts, approvalRequests } from "@/lib/seed/compliance";
import { roles, users, reports, auditLog, apiKeys, webhooks, eventLogs, MODULES } from "@/lib/seed/platform";

export * from "@/lib/seed/reference";
export * from "@/lib/seed/parties";
export * from "@/lib/seed/activity";
export * from "@/lib/seed/compliance";
export * from "@/lib/seed/platform";

export interface Dataset {
  regions: typeof regions;
  corridors: typeof corridors;
  fxRates: typeof fxRates;
  exposures: typeof exposures;
  feeSchedules: typeof feeSchedules;
  senders: typeof senders;
  beneficiaries: typeof beneficiaries;
  partners: typeof partners;
  floatAccounts: typeof floatAccounts;
  transfers: typeof transfers;
  ledgerEntries: typeof ledgerEntries;
  settlements: typeof settlements;
  reconciliationItems: typeof reconciliationItems;
  complianceCases: typeof complianceCases;
  screeningHits: typeof screeningHits;
  kycRecords: typeof kycRecords;
  riskRules: typeof riskRules;
  alerts: typeof alerts;
  approvalRequests: typeof approvalRequests;
  roles: typeof roles;
  users: typeof users;
  reports: typeof reports;
  auditLog: typeof auditLog;
  apiKeys: typeof apiKeys;
  webhooks: typeof webhooks;
  eventLogs: typeof eventLogs;
}

/** Fully-populated, live-style synthetic dataset. */
export const seedDataset: Dataset = {
  regions,
  corridors,
  fxRates,
  exposures,
  feeSchedules,
  senders,
  beneficiaries,
  partners,
  floatAccounts,
  transfers,
  ledgerEntries,
  settlements,
  reconciliationItems,
  complianceCases,
  screeningHits,
  kycRecords,
  riskRules,
  alerts,
  approvalRequests,
  roles,
  users,
  reports,
  auditLog,
  apiKeys,
  webhooks,
  eventLogs,
};

/** Empty-state dataset — reference tables (regions/corridors/roles/users) stay so
 *  scoping and RBAC still work, but all activity/parties collections are emptied. */
export const emptyDataset: Dataset = {
  ...seedDataset,
  senders: [],
  beneficiaries: [],
  partners: [],
  floatAccounts: [],
  transfers: [],
  ledgerEntries: [],
  settlements: [],
  reconciliationItems: [],
  complianceCases: [],
  screeningHits: [],
  kycRecords: [],
  alerts: [],
  approvalRequests: [],
  reports: [],
  auditLog: [],
  eventLogs: [],
  fxRates: [],
  exposures: [],
};

export { MODULES };
