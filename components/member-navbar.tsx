"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  Library,
  Trophy,
  Medal,
  LogOut,
  User,
  Settings,
} from "lucide-react";

// --- KOMPONEN LOGO GOOGLE (SVG) ---
const GoogleLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
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

export const MemberNavbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { label: "Tracks", href: "/member", icon: Library },
    { label: "Leaderboard", href: "/member/leaderboard", icon: Trophy },
    { label: "Achievements", href: "/member/achievements", icon: Medal },
  ];

  const renderAvatar = () => {
    if (user?.avatar) {
      const avatarUrl = user.avatar.startsWith('http') 
        ? user.avatar 
        : `http://localhost:8080/${user.avatar}`; 
      
      return (
        <img 
          src={avatarUrl} 
          alt={user.name} 
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center text-white font-bold">
        {user?.name?.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* --- LEFT: LOGO (PERBAIKAN DI SINI) --- */}
        <div className="flex items-center gap-3">
          <Link href="/member" className="flex items-center gap-2 group">
            {/* Logo Icon */}
            <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm group-hover:shadow-md transition-all">
              <GoogleLogo className="w-6 h-6" />
            </div>
            
            {/* Logo Text - Hapus 'hidden sm:flex' agar selalu muncul */}
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent leading-none">
                GDGOC
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Member Area
              </span>
            </div>
          </Link>
        </div>
        {/* -------------------------------------- */}

        {/* CENTER: DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                    flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                    }
                `}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: USER PROFILE & MOBILE TOGGLE */}
        <div className="flex items-center gap-3">
          {/* User Profile (Desktop) */}
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                {user?.name || "Member"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user?.email}
              </p>
            </div>
            
            <div className="relative group cursor-pointer">
              {/* AVATAR WRAPPER */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900 overflow-hidden">
                {renderAvatar()}
              </div>

              {/* Hover Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1 lg:hidden">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  
                  <Link
                    href="/member/profile"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors mb-1"
                  >
                    <Settings size={16} />
                    Profile Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sm:h-auto">
          <div className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                        ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }
                    `}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
              <Link 
                href="/member/profile" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                   {user?.avatar ? (
                      <img 
                        src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:8080/${user.avatar}`} 
                        className="w-full h-full object-cover"
                      />
                   ) : (
                      <span className="text-slate-600 dark:text-slate-300 font-bold text-xs">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                   )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500">Edit Profile</p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};