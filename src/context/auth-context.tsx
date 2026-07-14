"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api";
import type { AuthState, User } from "@/types";

const STORAGE_KEY = "docmorph.auth";

type StoredSession = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

type AuthContextValue = AuthState & {
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
  setUser: (user: User | null) => void;
  getAccessToken: () => string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const router = useRouter();

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const login = useCallback((user: User, accessToken: string, refreshToken: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, accessToken, refreshToken }));
    }
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const getAccessToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<StoredSession>;
      return parsed.accessToken ?? null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        const parsed = JSON.parse(raw) as Partial<StoredSession>;
        if (parsed.user && parsed.accessToken && parsed.refreshToken) {
          setState({ user: parsed.user, isAuthenticated: true, isLoading: true });
          try {
            const freshUser = await getMe();
            setState({ user: freshUser, isAuthenticated: true, isLoading: false });
            window.localStorage.setItem("docmorph.auth", JSON.stringify({ ...parsed, user: freshUser }));
          } catch (err) {
            if ((err as { status?: number }).status === 401) {
              logout();
            } else {
              setState((prev) => ({ ...prev, isLoading: false }));
            }
          }
        } else {
          logout();
        }
      } catch {
        logout();
      }
    };

    initialize();
  }, [logout]);

  const refreshSession = useCallback(async () => {
    if (typeof window === "undefined") return false;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw) as { refreshToken?: string };
      if (!parsed.refreshToken) return false;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: parsed.refreshToken }),
      });
      if (!response.ok) {
        logout();
        return false;
      }
      const payload = (await response.json()) as { access_token?: string; refresh_token?: string };
      const next = JSON.parse(raw);
      next.accessToken = payload.access_token || next.accessToken;
      next.refreshToken = payload.refresh_token || next.refreshToken;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return true;
    } catch {
      logout();
      return false;
    }
  }, [logout]);

  const setUser = useCallback((user: User | null) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleLogout = () => {
      logout();
      router.replace("/login");
    };

    window.addEventListener("docmorph.logout", handleLogout);
    return () => window.removeEventListener("docmorph.logout", handleLogout);
  }, [logout, router]);

  useEffect(() => {
    const initialize = async () => {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        const parsed = JSON.parse(raw) as Partial<StoredSession>;
        if (parsed.user && parsed.accessToken && parsed.refreshToken) {
          setState({ user: parsed.user, isAuthenticated: true, isLoading: true });
          try {
            const freshUser = await getMe();
            setState({ user: freshUser, isAuthenticated: true, isLoading: false });
            window.localStorage.setItem("docmorph.auth", JSON.stringify({ ...parsed, user: freshUser }));
          } catch {
            logout();
          }
        } else {
          logout();
        }
      } catch {
        logout();
      }
    };

    initialize();
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, logout, refreshSession, setUser, getAccessToken }),
    [state, login, logout, refreshSession, setUser, getAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
