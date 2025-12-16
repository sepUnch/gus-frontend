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
  const activeSeries = allSeries.filter((s) => s.is_active).length;
  const closedSeries = totalSeries - activeSeries;

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

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
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                  Active
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : activeSeries}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Closed
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : closedSeries}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
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
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 animate-pulse h-64"
                  ></div>
                ))}
              </div>
            ) : filteredSeries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSeries.map((series) => (
                  <div
                    key={series.id}
                    onClick={() => router.push(`/admin/series/${series.id}`)}
                    className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden flex flex-col h-full"
                  >
                    {/* Decorative gradient */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                        series.is_active
                          ? "from-indigo-400 via-purple-400 to-pink-400"
                          : "from-slate-300 to-slate-400"
                      }`}
                    ></div>

                    {/* --- HEADER ROW: ID & STATUS (ANTI NABRAK) --- */}
                    <div className="flex justify-between items-start mb-4 mt-1">
                      {/* Kiri: ID Badge */}
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                        #{series.id}
                      </span>

                      {/* Kanan: Status Badge */}
                      {series.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-200 uppercase tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wide">
                          Closed
                        </span>
                      )}
                    </div>

                    {/* --- SERIES NAME (Full Width, No Overlap) --- */}
                    <h3
                      className={`text-xl font-bold mb-2 line-clamp-2 transition-colors ${
                        series.is_active
                          ? "text-slate-900 dark:text-white group-hover:text-indigo-600"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {series.series_name || series.name}
                    </h3>

                    {/* Parent Track Label */}
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 truncate max-w-full">
                        <svg
                          className="w-3 h-3 shrink-0"
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
                        <span className="truncate">{series.parent_track}</span>
                      </span>
                    </div>

                    {/* Footer Stats / Deadline (Pushed to bottom) */}
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Attendance Code
                        </span>
                        {series.verification_code ? (
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                              series.is_active
                                ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                : "bg-slate-100 text-slate-500 border border-slate-200 line-through decoration-slate-400"
                            }`}
                          >
                            {series.verification_code}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-red-400">
                            Missing
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Deadline</span>
                        <span
                          className={`text-xs font-medium ${
                            series.is_active
                              ? "text-slate-700 dark:text-slate-300"
                              : "text-slate-400"
                          }`}
                        >
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
                <p className="text-slate-500">No series found.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
