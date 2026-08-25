import type { ModuleKey } from "@/lib/types";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Globe,
  Building2,
  Wallet,
  GitCompareArrows,
  ShieldCheck,
  Stamp,
  BarChart3,
  UserCog,
  TerminalSquare,
  FileText,
  ScrollText,
  Settings2,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  module: ModuleKey;
  built: boolean;
  /** Bypasses the permission check — used for Settings so a previewed,
   *  narrowly-scoped persona can always reach the role switch to reset. */
  alwaysVisible?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Overview", href: "/overview", icon: LayoutDashboard, module: "overview", built: true },
    ],
  },
  {
    label: "Money Movement",
    items: [
      { label: "Transfers", href: "/transfers", icon: ArrowLeftRight, module: "transfers", built: true },
      { label: "Senders & Beneficiaries", href: "/senders", icon: Users, module: "senders", built: true },
      { label: "Corridors & FX", href: "/corridors", icon: Globe, module: "corridors", built: true },
    ],
  },
  {
    label: "Network & Treasury",
    items: [
      { label: "Payout Partners", href: "/partners", icon: Building2, module: "partners", built: true },
      { label: "Treasury & Liquidity", href: "/treasury", icon: Wallet, module: "treasury", built: true },
      { label: "Reconciliation", href: "/reconciliation", icon: GitCompareArrows, module: "reconciliation", built: true },
    ],
  },
  {
    label: "Risk & Control",
    items: [
      { label: "Compliance & Risk", href: "/compliance", icon: ShieldCheck, module: "compliance", built: false },
      { label: "Approvals", href: "/approvals", icon: Stamp, module: "approvals", built: true },
      { label: "Analytics", href: "/analytics", icon: BarChart3, module: "analytics", built: true },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "User Management", href: "/users", icon: UserCog, module: "users", built: false },
      { label: "Integration Console", href: "/integration", icon: TerminalSquare, module: "integration", built: false },
      { label: "Reports", href: "/reports", icon: FileText, module: "reports", built: false },
      { label: "Audit Log", href: "/audit", icon: ScrollText, module: "audit", built: false },
      { label: "Platform Config", href: "/config", icon: Settings2, module: "config", built: false },
      { label: "Settings", href: "/settings", icon: Settings, module: "config", built: true, alwaysVisible: true },
    ],
  },
];
