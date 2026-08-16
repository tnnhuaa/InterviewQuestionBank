import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Role = "public" | "student" | "mentor" | "admin";

interface AppContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

const ROLE_STORAGE_KEY = "prepvi.demo-role";
const ROLES: Role[] = ["public", "student", "mentor", "admin"];

function getInitialRole(): Role {
  if (typeof window === "undefined") return "public";
  const savedRole = window.localStorage.getItem(ROLE_STORAGE_KEY) as Role | null;
  return savedRole && ROLES.includes(savedRole) ? savedRole : "public";
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(getInitialRole);
  const setRole = useCallback((nextRole: Role) => {
    setRoleState(nextRole);
    window.localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
  }, []);
  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Context hooks intentionally share this small module with the provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
