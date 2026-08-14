"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedDataset, emptyDataset, type Dataset } from "@/lib/seed";
import type { ModuleKey, Role, User, ApprovalStatus } from "@/lib/types";
import { buildScope, canEdit, canView, permissionFor, type Scope } from "@/lib/rbac";

const ROOT_USER_ID = "USR-001"; // logged-in Super Admin

type DemoMode = "live" | "empty";

interface AppContextValue {
  data: Dataset;
  demoMode: DemoMode;
  isEmpty: boolean;
  setDemoMode: (m: DemoMode) => void;
  toggleDemo: () => void;

  rootUser: User;
  activeUser: User;
  activeRole: Role;
  scope: Scope;
  isPreviewing: boolean;
  setViewAs: (userId: string) => void;
  resetView: () => void;

  can: (module: ModuleKey) => ReturnType<typeof permissionFor>;
  canView: (module: ModuleKey) => boolean;
  canEdit: (module: ModuleKey) => boolean;

  decideApproval: (id: string, decision: Exclude<ApprovalStatus, "Pending">, rationale?: string) => void;
  toggleFxLock: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoModeState] = useState<DemoMode>("live");
  const [data, setData] = useState<Dataset>(seedDataset);
  const [activeUserId, setActiveUserId] = useState<string>(ROOT_USER_ID);

  // Swap dataset when the demo toggle flips. Mutations reset on toggle (demo-safe).
  useEffect(() => {
    setData(demoMode === "live" ? seedDataset : emptyDataset);
  }, [demoMode]);

  const rootUser = useMemo(
    () => seedDataset.users.find((u) => u.id === ROOT_USER_ID)!,
    [],
  );
  const activeUser = useMemo(
    () => seedDataset.users.find((u) => u.id === activeUserId) ?? rootUser,
    [activeUserId, rootUser],
  );
  const activeRole = useMemo(
    () => seedDataset.roles.find((r) => r.id === activeUser.roleId) ?? seedDataset.roles[0],
    [activeUser],
  );
  const scope = useMemo(() => buildScope(activeUser, activeRole), [activeUser, activeRole]);

  const setDemoMode = useCallback((m: DemoMode) => setDemoModeState(m), []);
  const toggleDemo = useCallback(
    () => setDemoModeState((m) => (m === "live" ? "empty" : "live")),
    [],
  );

  const setViewAs = useCallback((userId: string) => setActiveUserId(userId), []);
  const resetView = useCallback(() => setActiveUserId(ROOT_USER_ID), []);

  const decideApproval = useCallback(
    (id: string, decision: Exclude<ApprovalStatus, "Pending">, rationale?: string) => {
      setData((prev) => ({
        ...prev,
        approvalRequests: prev.approvalRequests.map((a) =>
          a.id === id
            ? {
                ...a,
                status: decision,
                approver: `${activeUser.firstName} ${activeUser.lastName}`,
                decidedOn: new Date().toISOString(),
                rationale: rationale ?? a.rationale,
              }
            : a,
        ),
      }));
    },
    [activeUser],
  );

  const toggleFxLock = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      fxRates: prev.fxRates.map((f) => (f.id === id ? { ...f, locked: !f.locked } : f)),
    }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      demoMode,
      isEmpty: demoMode === "empty",
      setDemoMode,
      toggleDemo,
      rootUser,
      activeUser,
      activeRole,
      scope,
      isPreviewing: activeUserId !== ROOT_USER_ID,
      setViewAs,
      resetView,
      can: (m) => permissionFor(activeRole, m),
      canView: (m) => canView(activeRole, m),
      canEdit: (m) => canEdit(activeRole, m),
      decideApproval,
      toggleFxLock,
    }),
    [data, demoMode, setDemoMode, toggleDemo, rootUser, activeUser, activeRole, scope, activeUserId, setViewAs, resetView, decideApproval, toggleFxLock],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}
