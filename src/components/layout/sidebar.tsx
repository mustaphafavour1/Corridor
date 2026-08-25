"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, LogOut } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { NAV } from "@/lib/nav";
import { scopeLabel } from "@/lib/rbac";
import { initials, cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/primitives";
import { Tooltip } from "@/components/ui/overlay";

export function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-[9px] metallic shadow-accent-glow">
        <ArrowLeftRight size={14} className="text-accent-contrast" strokeWidth={2.4} />
      </span>
      <span className="leading-none">
        <span className="block text-md font-bold tracking-tight text-content">CorriDoor</span>
        <span className="block text-3xs uppercase tracking-[0.16em] text-content-faint mt-0.5">
          Payments Ops
        </span>
      </span>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { canView, activeUser, activeRole, scope, data } = useApp();

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[210px] flex-col border-r border-hairline bg-surface-1 lg:flex">
      {/* Logo lockup — same height as the top bar, aligned bottom edges */}
      <div className="flex h-14 items-center border-b border-hairline px-4 shrink-0">
        <Brand />
      </div>

      {/* Independent scroll track — stays put when main content is taller */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        {NAV.map((group) => {
          const items = group.items.filter((i) => i.alwaysVisible || canView(i.module));
          if (!items.length) return null;
          return (
            <div key={group.label} className="mb-3">
              <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-[0.06em] text-content-faint">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  if (!item.built) {
                    return (
                      <li key={item.href}>
                        <div className="flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2.5 text-[11.5px] text-content-dim">
                          <Icon size={15} strokeWidth={1.75} className="shrink-0 opacity-60" />
                          <span className="flex-1 truncate whitespace-nowrap">{item.label}</span>
                          <span className="h-1 w-1 shrink-0 rounded-full border border-content-dim" aria-hidden />
                        </div>
                      </li>
                    );
                  }
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[11.5px] transition-colors",
                          active
                            ? "bg-accent-soft text-accent-hi font-semibold"
                            : "text-content-dim font-medium hover:bg-surface-3 hover:text-content-2",
                        )}
                      >
                        <Icon
                          size={15}
                          strokeWidth={1.9}
                          className={cn("shrink-0", active ? "text-accent" : "text-content-faint group-hover:text-content-2")}
                        />
                        <span className="flex-1 truncate whitespace-nowrap">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 border-t border-hairline px-3 py-2.5">
        <Avatar initials={initials(activeUser.firstName, activeUser.lastName)} color={activeUser.avatarColor} size={28} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-content-2">
            {activeUser.firstName} {activeUser.lastName}
          </p>
          <p className="truncate text-3xs text-content-faint">
            {activeRole.name} · {scopeLabel(scope, data.regions)}
          </p>
        </div>
        <Tooltip content="Sign out">
          <button className="rounded-control p-1 text-content-faint hover:bg-surface-3 hover:text-danger">
            <LogOut size={13} />
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
