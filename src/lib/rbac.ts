import type {
  User,
  Role,
  ModuleKey,
  PermissionLevel,
  Corridor,
  Transfer,
  Sender,
  PayoutPartner,
  FloatAccount,
  Region,
} from "@/lib/types";

export interface Scope {
  isGlobal: boolean;
  regionIds: string[];
  corridorCodes: string[];
  partnerId?: string;
  base: Role["base"];
}

export function buildScope(user: User, role: Role): Scope {
  return {
    isGlobal: user.assignedRegions.length === 0 && !user.partnerId,
    regionIds: user.assignedRegions,
    corridorCodes: user.assignedCorridors,
    partnerId: user.partnerId,
    base: role.base,
  };
}

// ── Permissions ───────────────────────────────────────────────────────────────
export function permissionFor(role: Role, module: ModuleKey): PermissionLevel {
  return role.permissions[module] ?? "none";
}
export function canView(role: Role, module: ModuleKey) {
  return permissionFor(role, module) !== "none";
}
export function canEdit(role: Role, module: ModuleKey) {
  return permissionFor(role, module) === "edit";
}

// ── Scoping predicates ──────────────────────────────────────────────────────────
export function corridorInScope(c: Corridor, scope: Scope): boolean {
  if (scope.partnerId) return c.partnerIds.includes(scope.partnerId);
  if (scope.corridorCodes.length) return scope.corridorCodes.includes(c.code);
  if (scope.regionIds.length) return scope.regionIds.includes(c.regionId);
  return true;
}

export function scopeCorridors(list: Corridor[], scope: Scope): Corridor[] {
  if (scope.isGlobal) return list;
  return list.filter((c) => corridorInScope(c, scope));
}

export function scopeTransfers(list: Transfer[], scope: Scope, corridors: Corridor[]): Transfer[] {
  if (scope.isGlobal) return list;
  const allowed = new Set(scopeCorridors(corridors, scope).map((c) => c.code));
  return list.filter((t) => {
    if (scope.partnerId) return t.partnerId === scope.partnerId;
    return allowed.has(t.corridorCode);
  });
}

export function scopeSenders(list: Sender[], scope: Scope): Sender[] {
  if (scope.isGlobal) return list;
  if (scope.regionIds.length) return list.filter((s) => scope.regionIds.includes(s.regionId));
  // partner agents don't own senders — show none
  if (scope.partnerId) return [];
  return list;
}

export function scopePartners(list: PayoutPartner[], scope: Scope): PayoutPartner[] {
  if (scope.isGlobal) return list;
  if (scope.partnerId) return list.filter((p) => p.id === scope.partnerId);
  if (scope.regionIds.length) return list.filter((p) => scope.regionIds.includes(p.regionId));
  return list;
}

export function scopeFloat(list: FloatAccount[], scope: Scope, corridors: Corridor[]): FloatAccount[] {
  if (scope.isGlobal) return list;
  if (scope.partnerId) return list.filter((f) => f.partnerId === scope.partnerId);
  const allowed = new Set(scopeCorridors(corridors, scope).map((c) => c.code));
  return list.filter((f) => allowed.has(f.corridorCode));
}

export function scopeLabel(scope: Scope, regions: Region[]): string {
  if (scope.isGlobal) return "Global";
  if (scope.partnerId) return scope.partnerId;
  if (scope.corridorCodes.length) return scope.corridorCodes.join(", ");
  if (scope.regionIds.length) {
    return scope.regionIds
      .map((id) => regions.find((r) => r.id === id)?.name ?? id)
      .join(", ");
  }
  return "Global";
}
