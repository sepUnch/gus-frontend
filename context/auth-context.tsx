"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// Pastikan import axiosInstance yang tadi kita edit
import axiosInstance from "@/lib/api-client"; 
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async (): Promise<User | null> => {
    // Jangan set loading jika user sudah ada (biar smooth)
    if (!user) setIsLoading(true);

    try {
      // 1. Cek Token di LocalStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return null;
      }

      // 2. Request ke Backend
      // Header Authorization SUDAH OTOMATIS dipasang oleh interceptor di api-client.ts
      // JADI KITA TIDAK PERLU SET MANUAL DISINI.
      
      const response = await axiosInstance.get("/member/me");
      const userData = response.data.data;

      setUser(userData);
      return userData;
    } catch (error: any) {
      console.error("CheckAuth Failed:", error);
      // Jika error 401, interceptor di api-client akan handle redirect/logout
      // Kita cukup set state user ke null
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (token: string, newUser: User) => {
    localStorage.setItem("token", token);
    // Tidak perlu set header manual, interceptor yang kerja
    setUser(newUser);

    if (newUser.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/member");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};