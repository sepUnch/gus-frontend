"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    tracks: 0,
    series: 0,
    achievements: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // 1. Fetch tracks and series (Masih menggunakan logika lama)
      let totalTracks = 0;
      let totalSeries = 0;
      try {
        const tracksResponse = await axiosInstance.get("/tracks");
        const rawData = tracksResponse.data?.data || tracksResponse.data || [];

        if (Array.isArray(rawData)) {
          totalTracks = rawData.length;
          totalSeries = rawData.reduce((acc: number, track: any) => {
            const seriesList = track.series || track.Series || [];
            return acc + seriesList.length;
          }, 0);
        }
      } catch (error) {
        console.error("Failed to load tracks:", error);
      }

      // ---------------------------------------------------------
      // 2. FETCH REAL ACHIEVEMENTS (LOGIKA BARU - COUNT ONLY)
      // ---------------------------------------------------------
      let totalAchievements = 0;
      try {
        // Memanggil endpoint baru: /admin/stats/achievements
        const achievementsResponse = await axiosInstance.get(
          "/admin/stats/achievements"
        );

        // Backend Go mengirim format: { data: { count: 50 } }
        const data =
          achievementsResponse.data?.data || achievementsResponse.data;

        // Ambil property 'count' dari object data
        totalAchievements = data?.count || 0;
      } catch (error) {
        console.error("Failed to load achievements stats:", error);
      }
      // ---------------------------------------------------------

      // 3. Fetch users (Logika Baru - Count Only)
      let totalUsers = 0;
      try {
        const statsResponse = await axiosInstance.get("/admin/stats");
        // Backend Go mengirim format: { data: { users: 123 } }
        totalUsers = statsResponse.data?.data?.users || 0;
      } catch (error) {
        console.error("Failed to load user stats:", error);
      }

      setStats({
        tracks: totalTracks,
        series: totalSeries,
        achievements: totalAchievements,
        users: totalUsers,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 pt-16 md:pt-0">
          <div className="container mx-auto px-6 md:px-10 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                Dashboard Overview
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Welcome back! Here's what's happening with your platform today.
              </p>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* Tracks Card */}
              <div className="group relative bg-gradient-to-br from-blue-300 to-blue-400 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-white/90 text-sm font-medium mb-1">
                    Total Tracks
                  </h3>
                  {loading ? (
                    <div className="h-10 w-20 bg-white/20 animate-pulse rounded-lg"></div>
                  ) : (
                    <p className="text-4xl font-bold text-white mb-1">
                      {stats.tracks}
                    </p>
                  )}
                  <p className="text-white/70 text-xs">Active tracks</p>
                </div>
              </div>

              {/* Series Card */}
              <div className="group relative bg-gradient-to-br from-purple-300 to-purple-400 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-white/90 text-sm font-medium mb-1">
                    Total Series
                  </h3>
                  {loading ? (
                    <div className="h-10 w-20 bg-white/20 animate-pulse rounded-lg"></div>
                  ) : (
                    <p className="text-4xl font-bold text-white mb-1">
                      {stats.series}
                    </p>
                  )}
                  <p className="text-white/70 text-xs">Content series</p>
                </div>
              </div>

              {/* Achievements Card - REAL DATA */}
              <div className="group relative bg-gradient-to-br from-amber-300 to-orange-400 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-white/90 text-sm font-medium mb-1">
                    Achievements
                  </h3>
                  {loading ? (
                    <div className="h-10 w-20 bg-white/20 animate-pulse rounded-lg"></div>
                  ) : (
                    <p className="text-4xl font-bold text-white mb-1">
                      {stats.achievements}
                    </p>
                  )}
                  <p className="text-white/70 text-xs">Total badges</p>
                </div>
              </div>

              {/* Users Card - REAL DATA */}
              <div className="group relative bg-gradient-to-br from-emerald-300 to-teal-400 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-white/90 text-sm font-medium mb-1">
                    Active Users
                  </h3>
                  {loading ? (
                    <div className="h-10 w-20 bg-white/20 animate-pulse rounded-lg"></div>
                  ) : (
                    <p className="text-4xl font-bold text-white mb-1">
                      {stats.users}
                    </p>
                  )}
                  <p className="text-white/70 text-xs">Registered users</p>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-300 to-purple-400 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Quick Actions
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push("/admin/tracks")}
                  className="group relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-950 dark:hover:to-blue-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        Manage Tracks
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Create and organize learning tracks
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/admin/series")}
                  className="group relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 hover:from-purple-50 hover:to-purple-100 dark:hover:from-purple-950 dark:hover:to-purple-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-300 to-purple-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        Manage Series
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Organize content into series
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/admin/submissions")}
                  className="group relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 hover:from-emerald-50 hover:to-emerald-100 dark:hover:from-emerald-950 dark:hover:to-emerald-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        View Submissions
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Review user submissions
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Activity Overview - Optional Section */}
            <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      New track added
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Web Development Basics
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">2h ago</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-500 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Series updated
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      React Fundamentals
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">5h ago</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
