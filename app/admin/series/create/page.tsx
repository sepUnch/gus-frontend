"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import { adminAPI } from "@/lib/api/admin";
import axiosInstance from "@/lib/api-client"; // Pastikan import ini ada untuk fetch list tracks

export default function CreateSeriesPage() {
  const router = useRouter();
  
  // Form State
  const [seriesName, setSeriesName] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [trackId, setTrackId] = useState("");
  const [deadline, setDeadline] = useState("");

  // Data State
  const [tracks, setTracks] = useState<any[]>([]); // Untuk dropdown
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch Tracks saat halaman dimuat (untuk Dropdown)
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axiosInstance.get("/tracks");
        const tracksData = response.data?.data || response.data || [];
        setTracks(Array.isArray(tracksData) ? tracksData : []);
      } catch (err) {
        console.error("Failed to fetch tracks for dropdown:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTracks();
  }, []);

  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!trackId) {
      setError("Please select a parent track");
      setLoading(false);
      return;
    }
    if (!deadline) {
      setError("Deadline is required");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        series_name: seriesName,
        description: seriesDescription,
        track_id: parseInt(trackId),
        deadline: new Date(deadline).toISOString(),
      };

      await adminAPI.createSeries(payload);
      
      // Success Alert & Redirect
      // (Bisa diganti toast notification jika ada librarynya)
      router.push("/admin/series");
      
    } catch (err: any) {
      console.error("Create Series Error:", err);
      setError(err.response?.data?.message || "Failed to create series");
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-4xl">
            
            {/* HEADER SECTION */}
            <div className="mb-8">
              <button 
                onClick={() => router.back()}
                className="group flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-4 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Series List
              </button>
              
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                Create New Series
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Add a new learning module or event to an existing track.
              </p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

                <form onSubmit={handleCreateSeries} className="space-y-6 mt-2">
                    
                    {/* INPUT: SERIES NAME */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Series Name
                        </label>
                        <input
                            type="text"
                            value={seriesName}
                            onChange={(e) => setSeriesName(e.target.value)}
                            required
                            placeholder="e.g. Introduction to Golang, Weekly Meeting 1"
                            className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* INPUT: PARENT TRACK (DROPDOWN) */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Parent Track
                        </label>
                        <div className="relative">
                            <select
                                value={trackId}
                                onChange={(e) => setTrackId(e.target.value)}
                                required
                                disabled={initialLoading}
                                className="w-full px-5 py-3 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                            >
                                <option value="" disabled>
                                    {initialLoading ? "Loading tracks..." : "Select a track..."}
                                </option>
                                {tracks.map((track) => (
                                    <option key={track.id} value={track.id}>
                                        {track.track_name || track.name} (ID: {track.id})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5 ml-1">
                            This series will belong to the selected track.
                        </p>
                    </div>

                    {/* INPUT: DESCRIPTION */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={seriesDescription}
                            onChange={(e) => setSeriesDescription(e.target.value)}
                            required
                            rows={4}
                            placeholder="Describe what this series is about..."
                            className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* INPUT: DEADLINE */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Deadline
                        </label>
                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            required
                            className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [color-scheme:light] dark:[color-scheme:dark]"
                        />
                        <p className="text-xs text-slate-500 mt-1.5 ml-1">
                            Users cannot submit attendance after this date.
                        </p>
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                "Create Series"
                            )}
                        </button>
                    </div>

                </form>
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}