"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";

export default function AdminSubmissionsPage() {
  const router = useRouter();

  // State
  const [allSeries, setAllSeries] = useState<any[]>([]); // Untuk dropdown
  const [selectedSeriesId, setSelectedSeriesId] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  
  // Loading States
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 1. Fetch Series List untuk Dropdown saat halaman dimuat
  useEffect(() => {
    fetchSeriesForDropdown();
  }, []);

  const fetchSeriesForDropdown = async () => {
    try {
      const response = await axiosInstance.get("/tracks");
      const tracks = response.data?.data || response.data || [];
      
      // Flatten tracks to get all series
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
      console.error("Failed to fetch series list:", error);
    } finally {
      setLoadingSeries(false);
    }
  };

  // 2. Handle Search/View Submissions
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedSeriesId) return;

    setLoadingSubmissions(true);
    setHasSearched(true);
    setSubmissions([]);

    try {
      const response = await axiosInstance.get(
        `/admin/submissions/series/${selectedSeriesId}`
      );
      const rawData = response.data?.data || response.data || [];
      setSubmissions(Array.isArray(rawData) ? rawData : []);
    } catch (err: any) {
      console.error("Search error:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-7xl">
            
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                Manage Submissions
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                View and grade student submissions by selecting a series.
              </p>
            </div>

            {/* FILTER CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8 relative overflow-hidden">
                {/* Decorative Line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>

                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4">
                    <div className="w-full">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Select Series to View
                        </label>
                        <div className="relative">
                            <select
                                value={selectedSeriesId}
                                onChange={(e) => setSelectedSeriesId(e.target.value)}
                                disabled={loadingSeries}
                                className="w-full px-5 py-3 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                            >
                                <option value="" disabled>
                                    {loadingSeries ? "Loading series list..." : "Choose a series..."}
                                </option>
                                {allSeries.map((series) => (
                                    <option key={series.id} value={series.id}>
                                        {series.series_name || series.name} (Track: {series.parent_track})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!selectedSeriesId || loadingSubmissions}
                        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        {loadingSubmissions ? (
                             <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                View Submissions
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* RESULTS SECTION */}
            <div>
                {loadingSubmissions ? (
                    // Loading State
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                         <p className="text-slate-500">Fetching submissions data...</p>
                    </div>
                ) : hasSearched && submissions.length > 0 ? (
                    // Table State
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                Found {submissions.length} Submissions
                            </h2>
                        </div>
                        
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left text-sm min-w-[800px]">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">File Link</th>
                                        <th className="px-6 py-4">Score Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {submissions.map((sub) => {
                                        // Initials Logic
                                        const name = sub.user?.name || "Unknown User";
                                        const initials = name.split(" ").map((n:string) => n[0]).join("").slice(0, 2).toUpperCase();
                                        
                                        return (
                                            <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                {/* Student Column */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                                            {initials}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 dark:text-white">{name}</div>
                                                            <div className="text-xs text-slate-500">{sub.user?.email || `ID: ${sub.user_id}`}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* File Column */}
                                                <td className="px-6 py-4">
                                                    <a
                                                        href={sub.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                                        <span className="truncate max-w-[200px]">{sub.file_url}</span>
                                                    </a>
                                                </td>

                                                {/* Score Column */}
                                                <td className="px-6 py-4">
                                                    {sub.score > 0 ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                            Score: {sub.score}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                                                            Not Graded
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Action Column */}
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => router.push(`/admin/submissions/${sub.id}`)}
                                                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors shadow-sm"
                                                    >
                                                        Grade Now
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : hasSearched ? (
                    // Empty State (Searched but no results)
                     <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Submissions Found</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            It looks like no one has submitted for this series yet.
                        </p>
                    </div>
                ) : (
                    // Initial State (No Search Yet)
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Please select a series from the dropdown above to view student submissions.
                        </p>
                    </div>
                )}
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}