"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import toast from "react-hot-toast"; // Import Toast

export default function CreateSeriesPage() {
  const router = useRouter();

  // Form State
  const [seriesName, setSeriesName] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [trackId, setTrackId] = useState("");
  const [deadline, setDeadline] = useState("");

  // Data State
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch Tracks untuk Dropdown
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axiosInstance.get("/tracks");
        const tracksData = response.data?.data || response.data || [];
        setTracks(Array.isArray(tracksData) ? tracksData : []);
      } catch (err) {
        console.error("Failed to fetch tracks:", err);
        toast.error("Failed to load tracks list");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTracks();
  }, []);

  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackId) {
      toast.error("Please select a parent track");
      return;
    }
    if (!deadline) {
      toast.error("Deadline is required");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating new series...");

    try {
      const payload = {
        series_name: seriesName,
        description: seriesDescription,
        track_id: parseInt(trackId),
        deadline: new Date(deadline).toISOString(),
      };

      await axiosInstance.post("/admin/series", payload);

      toast.success("Series created successfully!", { id: toastId });
      router.push("/admin/series");
    } catch (err: any) {
      console.error("Create Series Error:", err);
      const msg = err.response?.data?.message || "Failed to create series";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-4xl">
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="group flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-4 text-sm font-medium"
              >
                <svg
                  className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
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

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

              <form onSubmit={handleCreateSeries} className="space-y-6 mt-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Series Name
                  </label>
                  <input
                    type="text"
                    value={seriesName}
                    onChange={(e) => setSeriesName(e.target.value)}
                    required
                    placeholder="e.g. Introduction to Golang"
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

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
                        {initialLoading
                          ? "Loading tracks..."
                          : "Select a track..."}
                      </option>
                      {tracks.map((track) => (
                        <option key={track.id} value={track.id}>
                          {track.track_name || track.name} (ID: {track.id})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

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

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Deadline
                  </label>
                  <div className="relative">
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all [color-scheme:light] dark:[color-scheme:dark]"
                  />
                  </div>
                </div>

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
                    {loading ? "Creating..." : "Create Series"}
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
