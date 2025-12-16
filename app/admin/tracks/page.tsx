"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";

export default function ManageTracksPage() {
  const router = useRouter();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/tracks");
      const rawData = res.data?.data || res.data || [];
      setTracks(Array.isArray(rawData) ? rawData : []);
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTracks = tracks.filter((track) => {
    const trackName = track.track_name || track.name || "";
    const description = track.description || "";
    return (
      trackName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-7xl">
            {/* HEADER SECTION */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                Manage Tracks
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Create and organize learning paths for your platform.
              </p>
            </div>

            <button
              onClick={() => router.push("/admin/tracks/create")}
              className="w-full sm:w-auto px-6 py-3 mb-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Track
            </button>

            {/* SEARCH BAR */}
            {/* 1. Pindahkan mb-4 ke sini agar wrapper memberi jarak ke bawah, bukan inputnya */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search tracks by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // 2. Hapus 'mb-4' dari class input di bawah ini
                className="w-full px-5 py-3 pl-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />

              {/* Icon Search */}
              <svg
                className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              {/* Icon Clear (X) */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* STATS SUMMARY */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Tracks
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : tracks.length}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Total Series
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading
                    ? "..."
                    : tracks.reduce(
                        (acc, track) => acc + (track.series?.length || 0),
                        0
                      )}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Filtered
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : filteredTracks.length}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Avg Series
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading
                    ? "..."
                    : tracks.length > 0
                    ? Math.round(
                        tracks.reduce(
                          (acc, track) => acc + (track.series?.length || 0),
                          0
                        ) / tracks.length
                      )
                    : 0}
                </p>
              </div>
            </div>

            {/* TRACKS GRID */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 animate-pulse"
                  >
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : filteredTracks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTracks.map((track) => {
                  const series = track.series || track.Series || [];
                  return (
                    <div
                      key={track.id}
                      onClick={() => router.push(`/admin/tracks/${track.id}`)}
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
                    >
                      {/* Decorative gradient */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-300 to-pink-300"></div>

                      {/* ID Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          #{track.id}
                        </span>
                      </div>

                      {/* Track Icon */}
                      {/* <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg></div>
                      </div> */}

                      {/* Track Name */}
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {track.track_name || track.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 min-h-[60px]">
                        {track.description || "No description available"}
                      </p>

                      {/* Series Badge */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                              Series
                            </p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {series.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {searchQuery ? "No tracks found" : "No tracks yet"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Get started by creating your first learning track"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => router.push("/admin/tracks/create")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create First Track
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
