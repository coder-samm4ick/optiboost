import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";
import { findUserByEmail, addUser, getAuth, setAuth } from "@/lib/storage";

interface AuthContextValue {
  user: Omit<User, "password"> | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.user);
    setReady(true);
  }, []);

  const login = async (email: string, password: string) => {
    const existing = findUserByEmail(email);
    if (!existing) {
      return { success: false, error: "Пользователь с такой почтой не найден" };
    }
    if (existing.password !== password) {
      return { success: false, error: "Неверный пароль" };
    }
    const safeUser = { id: existing.id, email: existing.email, role: existing.role, createdAt: existing.createdAt };
    setUser(safeUser);
    setAuth(safeUser);
    return { success: true };
  };

  const register = async (email: string, password: string) => {
    if (!email.includes("@") || email.length < 5) {
      return { success: false, error: "Введите корректный email" };
    }
    if (password.length < 6) {
      return { success: false, error: "Пароль должен содержать минимум 6 символов" };
    }
    if (findUserByEmail(email)) {
      return { success: false, error: "Пользователь с такой почтой уже существует" };
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      role: "user",
      createdAt: new Date().toISOString(),
    };
    addUser(newUser);
    const safeUser = { id: newUser.id, email: newUser.email, role: newUser.role, createdAt: newUser.createdAt };
    setUser(safeUser);
    setAuth(safeUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setAuth(null);
  };

  if (!ready) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
