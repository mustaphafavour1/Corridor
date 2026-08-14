"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, X } from "lucide-react";
import { useApp } from "@/context/app-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeUser, activeRole, isPreviewing, resetView, canView } = useApp();

  const mobileItems = NAV.flatMap((g) => g.items)
    .filter((i) => i.built && canView(i.module))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-[212px]">
        <Topbar />

        {isPreviewing && (
          <div className="flex items-center justify-between gap-3 border-b border-accent/25 bg-accent-soft px-4 py-1.5 lg:px-6">
            <span className="flex items-center gap-1.5 text-2xs text-accent-hi">
              <Eye size={12} />
              Previewing as <span className="font-semibold">{activeUser.firstName} {activeUser.lastName}</span> · {activeRole.name}. Navigation, permissions and data reflect this persona.
            </span>
            <button
              onClick={resetView}
              className="flex items-center gap-1 rounded-control px-1.5 py-0.5 text-2xs font-medium text-accent-hi hover:bg-accent/15"
            >
              <X size={11} /> Exit preview
            </button>
          </div>
        )}

        <main className="flex-1 px-4 py-4 pb-20 lg:px-6 lg:py-5 lg:pb-6">
          <motion.div
            key={`${activeUser.id}:${pathname}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[1520px]"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-stretch border-t border-hairline bg-surface-1/95 backdrop-blur lg:hidden">
        {mobileItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-3xs font-medium",
                active ? "text-accent-hi" : "text-content-faint",
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              <span className="max-w-full truncate px-1">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
