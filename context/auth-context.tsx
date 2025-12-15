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
    if (!user) setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return null;
      }
      
      // --- PERBAIKAN DI SINI ---
      // GANTI "/member/me" MENJADI "/me"
      // Endpoint /me biasanya hanya butuh login, tidak peduli role-nya apa.
      const response = await axiosInstance.get("/me"); 
      
      const userData = response.data.data;
      setUser(userData);
      return userData;

    } catch (error) {
      console.error("Auth check failed:", error);
      // Jika token ditolak server, hapus localstorage agar bersih
      localStorage.removeItem("token");
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