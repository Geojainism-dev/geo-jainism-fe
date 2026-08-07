import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

const resolveStatus = (role) => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") return "authenticated";
  if (role === "USER") return "pending";
  return "unauthenticated";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const refresh = useCallback(async () => {
    setStatus("loading");
    try {
      const { data } = await api.get("/admin/auth/profile");
      setUser(data.user);
      setStatus(resolveStatus(data.user?.role));
      return data.user;
    } catch {
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, status, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
