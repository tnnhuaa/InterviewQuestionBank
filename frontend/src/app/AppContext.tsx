import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { ApiError, apiFetch, setCsrfToken } from "@/shared/api/client";

export type Role = "public" | "student" | "mentor" | "admin";
export interface SessionUser { id: string; email: string; displayName: string; roles: Array<"STUDENT" | "MENTOR" | "ADMIN"> }
const sessionQueryKey = ["session"] as const;

async function replaceAccountCache(queryClient: QueryClient, user: SessionUser | null) {
  await queryClient.cancelQueries();
  queryClient.removeQueries({
    predicate: (query) => !(query.queryKey.length === 1 && query.queryKey[0] === sessionQueryKey[0]),
  });
  queryClient.setQueryData<SessionUser | null>(sessionQueryKey, user);
}

interface AppContextValue {
  role: Role;
  user: SessionUser | null;
  sessionLoading: boolean;
  setRole: (role: Role) => void;
  applyLogin: (payload: { user: SessionUser; csrfToken: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const demoEnabled = import.meta.env.VITE_ENABLE_DEMO_TOOLS === "true";
const AppContext = createContext<AppContextValue | null>(null);

function primaryRole(user: SessionUser | null, demoRole: Role | null): Role {
  if (demoEnabled && demoRole) return demoRole;
  if (user?.roles.includes("ADMIN")) return "admin";
  if (user?.roles.includes("MENTOR")) return "mentor";
  if (user?.roles.includes("STUDENT")) return "student";
  return "public";
}

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [demoRole, setDemoRole] = useState<Role | null>(null);
  const session = useQuery<SessionUser | null>({
    queryKey: sessionQueryKey,
    queryFn: () => apiFetch<SessionUser>("/me"),
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const user = session.data ?? null;
  const value = useMemo<AppContextValue>(() => ({
    role: primaryRole(user, demoRole),
    user,
    sessionLoading: session.isLoading,
    setRole: (role) => { if (demoEnabled) setDemoRole(role); },
    applyLogin: async (payload) => {
      setCsrfToken(payload.csrfToken);
      setDemoRole(null);
      await replaceAccountCache(queryClient, payload.user);
    },
    logout: async () => {
      try {
        await apiFetch("/auth/logout", { method: "POST" });
      } catch (error) {
        if (!(error instanceof ApiError && error.status === 401)) throw error;
      }
      setCsrfToken(null);
      setDemoRole(null);
      await replaceAccountCache(queryClient, null);
    },
  }), [demoRole, queryClient, session.isLoading, user]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
