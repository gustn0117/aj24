"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { MemberPublic } from "@/lib/types";

interface AuthContextType {
  member: MemberPublic | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  member: null,
  isLoading: true,
  login: async () => ({ ok: false }),
  register: async () => ({ ok: false }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<MemberPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setMember(data))
      .catch(() => setMember(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMember(data);
        return { ok: true };
      }
      return { ok: false, error: data.error || "로그인에 실패했습니다." };
    } catch {
      return { ok: false, error: "네트워크 오류가 발생했습니다." };
    }
  }, []);

  const register = useCallback(async (info: { name: string; email: string; password: string; phone?: string }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      if (res.ok) {
        setMember(data);
        return { ok: true };
      }
      return { ok: false, error: data.error || "회원가입에 실패했습니다." };
    } catch {
      return { ok: false, error: "네트워크 오류가 발생했습니다." };
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setMember(null);
  }, []);

  return (
    <AuthContext.Provider value={{ member, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
