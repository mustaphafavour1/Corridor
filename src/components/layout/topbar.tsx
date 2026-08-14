"use client";

import { Bell, Database, MapPin } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { scopeLabel } from "@/lib/rbac";
import { Brand } from "@/components/layout/sidebar";
import { RoleSwitcher } from "@/components/layout/role-switcher";
import { Segmented } from "@/components/ui/primitives";
import { Tooltip } from "@/components/ui/overlay";

export function Topbar() {
  const { demoMode, setDemoMode, scope, data } = useApp();
  const unresolved = data.alerts.filter((a) => !a.resolved).length;

  return (
    <header className="sticky top-0 z-20 flex h-12 items-center justify-between gap-3 border-b border-hairline bg-surface-1/95 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <Brand />
        </div>
        <div className="hidden items-center gap-1.5 rounded-control border border-hairline bg-surface-2 px-2 py-1 text-2xs text-content-muted lg:inline-flex">
          <MapPin size={11} className="text-content-faint" />
          Scope: <span className="font-medium text-content-2">{scopeLabel(scope, data.regions)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 md:flex">
          <Database size={12} className="text-content-faint" />
          <span className="text-2xs text-content-faint">Seed</span>
          <Segmented
            value={demoMode}
            onChange={(v) => setDemoMode(v)}
            options={[
              { value: "live", label: "Populated" },
              { value: "empty", label: "Empty" },
            ]}
          />
        </div>

        <RoleSwitcher />

        <Tooltip content={`${unresolved} unresolved alerts`}>
          <button className="relative flex h-7 w-7 items-center justify-center rounded-control border border-hairline bg-surface-1 text-content-muted hover:bg-surface-3 hover:text-content">
            <Bell size={13} />
            {unresolved > 0 && (
              <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-danger px-1 text-3xs font-bold text-white">
                {unresolved}
              </span>
            )}
          </button>
        </Tooltip>

        <div className="hidden items-center rounded-control border border-hairline bg-surface-2 px-2 py-1 text-2xs font-medium text-content-muted tabular lg:flex">
          Thu, 14 Aug 2026
        </div>
      </div>
    </header>
  );
}
