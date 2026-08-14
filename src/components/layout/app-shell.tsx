"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "@/context/app-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeUser, canView } = useApp();

  const allMobile = NAV.flatMap((g) => g.items).filter(
    (i) => i.built && (i.alwaysVisible || canView(i.module)),
  );
  const settingsItem = allMobile.find((i) => i.href === "/settings");
  const mobileItems = settingsItem
    ? [...allMobile.filter((i) => i.href !== "/settings").slice(0, 4), settingsItem]
    : allMobile.slice(0, 5);

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-[210px]">
        <Topbar />

        {/* No preview banner by design — role switching updates the view
            silently; the sidebar footer already surfaces the active persona. */}
        <main className="flex-1 px-5 pb-20 lg:px-10 lg:pb-8">
          <motion.div
            key={`${activeUser.id}:${pathname}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[1360px]"
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
