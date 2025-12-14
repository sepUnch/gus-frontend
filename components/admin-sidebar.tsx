"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Library, 
  ListVideo, 
  FileCheck, 
  Trophy, 
  Users, 
  LogOut,
  ChevronRight
} from "lucide-react";

// --- KOMPONEN LOGO GOOGLE (SVG) ---
const GoogleLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Tracks", href: "/admin/tracks", icon: Library },
    { label: "Series", href: "/admin/series", icon: ListVideo },
    { label: "Submissions", href: "/admin/submissions", icon: FileCheck },
    { label: "Achievements", href: "/admin/achievements", icon: Trophy },
    { label: "Users", href: "/admin/users", icon: Users },
  ];

  return (
    <>
      {/* MOBILE TOP BAR (Hamburger) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-4 justify-between shadow-sm">
        <div className="flex items-center gap-3">
            <button
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setOpen(true)}
            >
            <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
                 <span className="font-bold text-lg bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Admin
                </span>
            </div>
        </div>
      </div>

      {/* OVERLAY (Mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR MAIN */}
      <aside
        className={`
          fixed top-0 left-0 z-50 
          w-72 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          flex flex-col shadow-2xl md:shadow-none
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER LOGO SIDEBAR */}
        <div className="h-auto min-h-[5rem] py-4 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 w-full">
                {/* LOGO */}
                <div className="shrink-0 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm self-start mt-0.5">
                    <GoogleLogo className="w-6 h-6" />
                </div>

                {/* WRAPPER TEKS */}
                <div className="flex flex-col min-w-0 flex-1">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
                        GDGOC
                    </h1>
                    {/* PERBAIKAN DI SINI: truncate dihapus, whitespace-normal ditambahkan */}
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5 whitespace-normal break-words">
                        Google Developer Group On Campus
                    </p>
                </div>

                {/* Mobile Close Button */}
                <button
                    onClick={() => setOpen(false)}
                    className="md:hidden ml-auto p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full self-start"
                >
                    <X size={20} />
                </button>
            </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Main Menu
            </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm mb-1
                  ${isActive 
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                    <Icon 
                        size={18} 
                        className={`transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500"}`} 
                    />
                    <span>{item.label}</span>
                </div>
                
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER USER PROFILE */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
             {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
               {user?.name?.charAt(0).toUpperCase()}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                   {user?.name || "Admin"}
               </p>
               <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                   Administrator
               </p>
            </div>

            {/* Tombol Logout */}
            <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Logout"
            >
                <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};