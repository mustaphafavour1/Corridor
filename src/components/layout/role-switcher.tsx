"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check, Eye, RotateCcw, Users2 } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { scopeLabel, buildScope } from "@/lib/rbac";
import { initials, cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/primitives";

export function RoleSwitcher() {
  const { data, activeUser, activeRole, rootUser, isPreviewing, setViewAs, resetView, scope } = useApp();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-control border px-2 text-xs font-medium transition-colors",
            isPreviewing
              ? "border-accent/40 bg-accent-soft text-accent-hi"
              : "border-hairline bg-surface-1 text-content-2 hover:bg-surface-3",
          )}
        >
          {isPreviewing ? <Eye size={12} /> : <Users2 size={12} className="text-content-faint" />}
          <span className="hidden sm:inline">
            {isPreviewing ? "Previewing: " : "View as "}
            <span className="font-semibold">{activeRole.name}</span>
          </span>
          <ChevronDown size={12} className="opacity-70" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 w-64 rounded-card border border-hairline-strong bg-surface-2 p-1.5 shadow-pop data-[state=open]:animate-fade-in"
        >
          <div className="px-2 py-1.5">
            <p className="text-3xs font-semibold uppercase tracking-wide text-content-dim">
              Real-time role preview
            </p>
            <p className="mt-0.5 text-3xs text-content-faint">
              Super Admin can preview any persona — nav, permissions and data update live.
            </p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-hairline" />

          <div className="max-h-72 overflow-y-auto">
            {data.users.map((u) => {
              const role = data.roles.find((r) => r.id === u.roleId)!;
              const uScope = buildScope(u, role);
              const isActive = u.id === activeUser.id;
              return (
                <DropdownMenu.Item
                  key={u.id}
                  onSelect={() => setViewAs(u.id)}
                  className="flex cursor-pointer items-center gap-2 rounded-control px-2 py-1.5 text-xs outline-none data-[highlighted]:bg-surface-3"
                >
                  <Avatar initials={initials(u.firstName, u.lastName)} color={u.avatarColor} size={22} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-content-2">
                      {u.firstName} {u.lastName}
                      {u.id === rootUser.id && (
                        <span className="ml-1 text-3xs text-content-dim">(you)</span>
                      )}
                    </p>
                    <p className="truncate text-3xs text-content-faint">
                      {role.name} · {scopeLabel(uScope, data.regions)}
                    </p>
                  </div>
                  {isActive && <Check size={13} className="text-accent shrink-0" />}
                </DropdownMenu.Item>
              );
            })}
          </div>

          {isPreviewing && (
            <>
              <DropdownMenu.Separator className="my-1 h-px bg-hairline" />
              <DropdownMenu.Item
                onSelect={resetView}
                className="flex cursor-pointer items-center gap-2 rounded-control px-2 py-1.5 text-xs font-medium text-accent-hi outline-none data-[highlighted]:bg-surface-3"
              >
                <RotateCcw size={13} />
                Reset to my view
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
