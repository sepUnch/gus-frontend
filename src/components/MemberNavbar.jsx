"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { 
  Menu, 
  X, 
  Library, 
  Trophy, 
  Medal, 
  Settings // Tambah icon ini
} from "lucide-react";

export const MemberNavbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // const [isOpen, setIsOpen] = useState(false); // Kalau mau pakai mobile menu nanti

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { label: "Tracks", href: "/member", icon: Library },
    { label: "Leaderboard", href: "/member/leaderboard", icon: Trophy },
    { label: "Achievements", href: "/member/achievements", icon: Medal },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/member" className="text-2xl font-bold text-blue-600">
          GDGOC
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href 
                  ? "text-blue-600 font-bold" 
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* USER & LOGOUT */}
        <div className="flex items-center gap-4">
          
          {/* --- BAGIAN INI YANG DIUBAH (DIBUNGKUS LINK & ADA LOGIKA GAMBAR) --- */}
          <Link href="/member/profile" className="hidden sm:flex items-center gap-2 hover:bg-slate-100 p-2 rounded-lg transition-colors group">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold overflow-hidden border border-slate-200">
              {user?.avatar ? (
                 // TAMPILKAN GAMBAR JIKA ADA
                 <img 
                    src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:8080/${user.avatar}`} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                 />
              ) : (
                 // TAMPILKAN INISIAL JIKA TIDAK ADA GAMBAR
                 <span>{user?.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="text-xs group-hover:text-blue-600">
                <p className="font-bold">{user?.name}</p>
                <div className="flex items-center gap-1 text-slate-500">
                  <Settings size={10} /> 
                  <span>Edit Profile</span>
                </div>
            </div>
          </Link>
          {/* ------------------------------------------------------------------ */}

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors border border-slate-200 rounded-lg hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};