"use client";

import Link from "next/link";
import { Bell, Database, Search } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { initials } from "@/lib/utils";
import { Avatar, Segmented } from "@/components/ui/primitives";
import { Tooltip } from "@/components/ui/overlay";

// Top bar — v1 "Split": search at the far left, date / notifications / profile
// grouped at the far right, open space between. Rotated per dashboard per the
// design-taste doc; Corridor is assigned v1.
export function Topbar() {
  const { demoMode, setDemoMode, activeUser, data } = useApp();
  const unresolved = data.alerts.filter((a) => !a.resolved).length;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-hairline bg-surface-1/95 px-5 backdrop-blur lg:px-10">
      <div className="relative w-full max-w-xs">
        <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-content-faint" />
        <input
          type="text"
          placeholder="Search transfers, senders, corridors…"
          className="h-8 w-full rounded-control border border-hairline bg-surface-2 pl-7 pr-3 text-[11px] text-content placeholder:text-content-dim focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden items-center gap-1.5 md:flex">
          <Database size={12} className="text-content-faint" />
          <Segmented
            value={demoMode}
            onChange={(v) => setDemoMode(v)}
            options={[
              { value: "live", label: "Populated" },
              { value: "empty", label: "Empty" },
            ]}
          />
        </div>

        <div className="hidden items-center rounded-control border border-hairline bg-surface-2 px-2.5 h-8 text-xs font-medium text-content-muted tabular lg:flex">
          Thu, 14 Aug 2026
        </div>

        <Tooltip content={`${unresolved} unresolved alerts`}>
          <button className="relative flex h-8 w-8 items-center justify-center rounded-control border border-hairline bg-surface-1 text-content-muted hover:bg-surface-3 hover:text-content">
            <Bell size={13} />
            {unresolved > 0 && (
              <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-danger px-1 text-3xs font-bold text-white">
                {unresolved}
              </span>
            )}
          </button>
        </Tooltip>

        <Tooltip content="Settings">
          <Link href="/settings">
            <Avatar initials={initials(activeUser.firstName, activeUser.lastName)} color={activeUser.avatarColor} size={30} />
          </Link>
        </Tooltip>
      </div>
    </header>
  );
}
