"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import Link from "next/link";
import {
  LayoutGrid,
  Layers,
  Award,
  Users,
  Plus,
  Pencil,
  FileText,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // Install: npm install date-fns

export default function AdminDashboard() {
  // State untuk data dashboard
  const [stats, setStats] = useState({
    tracks: 0,
    series: 0,
    users: 0,
    active: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/admin/dashboard");
        const data = res.data?.data || {}; // Sesuai struktur response gin.H

        if (data.counts) setStats(data.counts);
        if (data.activities) setActivities(data.activities);
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Helper Icon berdasarkan Tipe Activity
  const getActivityIcon = (type: string, action: string) => {
    if (action.includes("New") || action.includes("added"))
      return <Plus className="w-5 h-5 text-blue-600" />;
    return <Pencil className="w-5 h-5 text-purple-600" />;
  };

  const getActivityBg = (type: string, action: string) => {
    if (action.includes("New") || action.includes("added"))
      return "bg-blue-100 dark:bg-blue-900/20";
    return "bg-purple-100 dark:bg-purple-900/20";
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 p-6 md:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Dashboard Overview
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Welcome back! Here's what's happening today.
              </p>
            </div>

            {/* Stats Cards (Dynamic) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Tracks"
                value={loading ? "..." : stats.tracks}
                icon={<LayoutGrid className="w-6 h-6 text-white" />}
                gradient="from-blue-500 to-blue-400"
              />
              <StatsCard
                title="Total Series"
                value={loading ? "..." : stats.series}
                icon={<Layers className="w-6 h-6 text-white" />}
                gradient="from-purple-500 to-purple-400"
              />
              <StatsCard
                title="Achievements"
                value={loading ? "..." : "2"} // Jika achievement belum ada API count-nya
                icon={<Award className="w-6 h-6 text-white" />}
                gradient="from-orange-500 to-amber-400"
              />
              <StatsCard
                title="Registered Users"
                value={loading ? "..." : stats.users}
                icon={<Users className="w-6 h-6 text-white" />}
                gradient="from-emerald-500 to-teal-400"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Quick Actions (Static) */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                      ⚡
                    </span>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                      href="/admin/tracks/create"
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        Manage Tracks
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Create and organize tracks
                      </p>
                    </Link>
                    <Link
                      href="/admin/series/create"
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        Manage Series
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Organize content series
                      </p>
                    </Link>
                    <Link
                      href="/admin/submissions"
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        View Submissions
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Review student work
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Recent Activity Section (DYNAMIC) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                    Recent Activity
                  </h3>

                  {loading ? (
                    <div className="space-y-4 animate-pulse">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"
                        ></div>
                      ))}
                    </div>
                  ) : activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                        >
                          {/* Icon Box */}
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityBg(
                              item.type,
                              item.action
                            )}`}
                          >
                            {getActivityIcon(item.type, item.action)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {item.action}
                            </h4>
                            <p className="text-sm text-slate-500 truncate">
                              {item.title}{" "}
                              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 uppercase ml-2">
                                {item.type}
                              </span>
                            </p>
                          </div>

                          {/* Time */}
                          <div className="text-xs font-medium text-slate-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(item.time), {
                              addSuffix: true,
                            }).replace("about ", "")}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500 text-sm">
                      No recent activity found.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (Placeholder for Leaderboard/Graph - Optional) */}
              <div className="space-y-8">
                {/* Anda bisa menambahkan widget lain disini di masa depan */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Component Stats Card Kecil
function StatsCard({ title, value, icon, gradient }: any) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${gradient} text-white shadow-lg shadow-blue-500/10`}
    >
      <div className="relative z-10">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className="text-white/80 text-sm font-medium">{title}</p>
      </div>
      {/* Dekorasi Background */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  );
}
