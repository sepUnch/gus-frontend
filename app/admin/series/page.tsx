"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";

export default function ManageSeriesPage() {
  const router = useRouter();
  const [allSeries, setAllSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSeriesViaTracks();
  }, []);

  const fetchSeriesViaTracks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/tracks");
      const tracks = response.data?.data || response.data || [];

      let flattenedSeries: any[] = [];

      if (Array.isArray(tracks)) {
        tracks.forEach((track: any) => {
          const seriesList = track.series || track.Series || [];
          const seriesWithTrackInfo = seriesList.map((s: any) => ({
            ...s,
            parent_track: track.track_name || track.name,
          }));
          flattenedSeries = [...flattenedSeries, ...seriesWithTrackInfo];
        });
      }
      setAllSeries(flattenedSeries);
    } catch (error) {
      console.error("Failed to fetch series:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredSeries = allSeries.filter((series) => {
    const seriesName = series.series_name || series.name || "";
    const parentTrack = series.parent_track || "";
    const query = searchQuery.toLowerCase();

    return (
      seriesName.toLowerCase().includes(query) ||
      parentTrack.toLowerCase().includes(query)
    );
  });

  // Stats Logic
  const totalSeries = allSeries.length;
  const withCode = allSeries.filter((s) => s.verification_code).length;
  const noCode = totalSeries - withCode;

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
                Manage Series
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Organize individual series and attendance codes within your
                tracks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
              <button
                onClick={() => router.push("/admin/series/create")}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
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
                Create New Series
              </button>
            </div>

            {/* SEARCH BAR */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search series by name or parent track..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 mb-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg
                className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
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
                  Total Series
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : totalSeries}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                  With Code
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : withCode}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-sm text-red-500 dark:text-red-400 mb-1">
                  No Code
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : noCode}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Filtered
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : filteredSeries.length}
                </p>
              </div>
            </div>

            {/* SERIES GRID */}
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
            ) : filteredSeries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSeries.map((series) => (
                  <div
                    key={series.id}
                    onClick={() => router.push(`/admin/series/${series.id}`)}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Decorative gradient (Purple/Blue variant for Series) */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>

                    {/* ID Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        #{series.id}
                      </span>
                    </div>

                    {/* Series Name */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pr-8">
                      {series.series_name || series.name}
                    </h3>

                    {/* Parent Track Label */}
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        {series.parent_track}
                      </span>
                    </div>

                    {/* Footer Stats / Deadline */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      {/* Verification Code Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Code Status
                        </span>
                        {series.verification_code ? (
                          <span className="text-xs font-bold text-green-600 flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Active: {series.verification_code}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-red-500 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Missing
                          </span>
                        )}
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Deadline</span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {series.deadline
                            ? new Date(series.deadline).toLocaleDateString()
                            : "No Deadline"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {searchQuery ? "No series found" : "No series yet"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Create a series inside a track to get started"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => router.push("/admin/series/create")}
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
                    Create First Series
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
