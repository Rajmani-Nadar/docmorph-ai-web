"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import type { AuthState, User } from "@/types";

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (email: string, password: string) => {
    setAuth((prev) => ({ ...prev, isLoading: true }));
    try {
      // TODO: Connect to backend authentication
      // For now, simulate login
      const user: User = {
        id: "1",
        email,
        name: email.split("@")[0],
      };
      setAuth({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuth((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setAuth((prev) => ({ ...prev, isLoading: true }));
    try {
      // TODO: Connect to backend authentication
      const user: User = {
        id: "1",
        email,
        name,
      };
      setAuth({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuth((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    setAuth({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
