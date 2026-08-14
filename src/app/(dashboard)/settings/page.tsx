"use client";

import * as React from "react";
import { Eye, ShieldCheck, Sliders, UserCircle2 } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { scopeLabel } from "@/lib/rbac";
import { MODULES } from "@/lib/seed";
import { initials, formatDateTime } from "@/lib/utils";
import type { PermissionLevel } from "@/lib/types";
import {
  PageHeader,
  SectionCard,
  SectionHeader,
  Avatar,
  Badge,
  DetailRow,
  DescriptionList,
  Segmented,
} from "@/components/ui";
import { RoleSwitcher } from "@/components/layout/role-switcher";

const PERM_LABEL: Record<PermissionLevel, string> = {
  none: "No access",
  view: "View only",
  edit: "View & edit",
};

export default function SettingsPage() {
  const { data, activeUser, activeRole, rootUser, scope, isPreviewing, resetView, demoMode, setDemoMode } = useApp();

  const rootRole = data.roles.find((r) => r.id === rootUser.roleId);
  const canSwitch = rootRole?.base === "super_admin";

  return (
    <div className="space-y-4">
      <PageHeader title="Settings" subtitle="Session, role preview and platform preferences" />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {/* Session / profile */}
        <SectionCard className="xl:col-span-1">
          <SectionHeader title="Session" caption="Your signed-in identity" action={<UserCircle2 size={13} className="text-content-faint" />} />
          <div className="flex items-center gap-3 mb-3">
            <Avatar initials={initials(rootUser.firstName, rootUser.lastName)} color={rootUser.avatarColor} size={40} />
            <div>
              <p className="text-sm font-semibold text-content-2">{rootUser.firstName} {rootUser.lastName}</p>
              <p className="text-2xs text-content-faint">{rootRole?.name}</p>
            </div>
          </div>
          <DescriptionList>
            <DetailRow label="Email" value={rootUser.email} />
            <DetailRow label="Phone" value={rootUser.phone} mono />
            <DetailRow label="Last login" value={formatDateTime(rootUser.lastLogin)} />
            <DetailRow label="Member since" value={rootUser.createdOn} />
          </DescriptionList>
        </SectionCard>

        {/* Role & preview */}
        <SectionCard className="xl:col-span-2">
          <SectionHeader
            title="Role & preview"
            caption="Real-time role switching — nav, permissions and data update live, with no page reload"
            action={<Eye size={13} className="text-content-faint" />}
          />

          {canSwitch ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-panel border border-hairline bg-surface-1 px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar initials={initials(activeUser.firstName, activeUser.lastName)} color={activeUser.avatarColor} size={30} />
                  <div>
                    <p className="text-xs font-medium text-content-2">
                      {isPreviewing ? "Currently previewing" : "Viewing as yourself"} — {activeUser.firstName} {activeUser.lastName}
                    </p>
                    <p className="text-3xs text-content-faint">{activeRole.name} · Scope: {scopeLabel(scope, data.regions)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isPreviewing && (
                    <button
                      onClick={resetView}
                      className="text-2xs font-medium text-accent-hi hover:underline"
                    >
                      Reset to my view
                    </button>
                  )}
                  <RoleSwitcher />
                </div>
              </div>

              <p className="mt-3 text-2xs text-content-faint">
                Every account in the system is listed below by name and role — only the personas Corridor has fully
                built (Super Admin, Regional Operations Manager, Payout Partner) render a scoped, live view when
                selected; others still appear so the role model reads as complete.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {data.roles.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-panel border border-hairline-faint bg-surface-1 px-2.5 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-content-2">{r.name}</p>
                      <p className="truncate text-3xs text-content-faint">{r.userCount} user{r.userCount === 1 ? "" : "s"}</p>
                    </div>
                    <Badge tone={r.system ? "info" : "violet"}>{r.system ? "Base role" : "Custom"}</Badge>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-content-muted">
              Role preview is available to Super Admin accounts. Signed in as {activeRole.name}.
            </p>
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {/* Permissions matrix for the active role */}
        <SectionCard className="xl:col-span-2">
          <SectionHeader
            title="Permissions"
            caption={`Module access for ${activeRole.name} — modules as rows, current role as the column`}
            action={<ShieldCheck size={13} className="text-content-faint" />}
          />
          <div className="w-full overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody>
                {MODULES.map((m) => {
                  const level = activeRole.permissions[m.key];
                  return (
                    <tr key={m.key}>
                      <td className="strong">{m.label}</td>
                      <td>
                        <Badge tone={level === "edit" ? "success" : level === "view" ? "info" : "neutral"}>
                          {PERM_LABEL[level]}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Preferences */}
        <SectionCard>
          <SectionHeader title="Preferences" caption="Demo & display" action={<Sliders size={13} className="text-content-faint" />} />
          <div className="space-y-3">
            <div>
              <p className="text-2xs font-medium text-content-2 mb-1.5">Seed data</p>
              <Segmented
                value={demoMode}
                onChange={setDemoMode}
                options={[
                  { value: "live", label: "Populated" },
                  { value: "empty", label: "Empty" },
                ]}
              />
              <p className="mt-1.5 text-3xs text-content-faint">Flips every page between live-style seed data and empty states.</p>
            </div>
            <DescriptionList>
              <DetailRow label="Theme" value="Dark (default)" />
              <DetailRow label="Base currency" value="USD" mono />
            </DescriptionList>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
