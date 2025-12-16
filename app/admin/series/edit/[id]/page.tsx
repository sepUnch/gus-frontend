"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import toast from "react-hot-toast";
import { ChevronLeft, Trash2, Calendar, AlertTriangle } from "lucide-react";

export default function EditSeriesPage() {
  const router = useRouter();
  const { id } = useParams();

  // Form State
  const [seriesName, setSeriesName] = useState("");
  const [seriesDescription, setSeriesDescription] = useState("");
  const [trackId, setTrackId] = useState("");
  const [deadline, setDeadline] = useState("");

  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const initData = async () => {
      try {
        const [tracksRes, seriesRes] = await Promise.all([
          axiosInstance.get("/tracks"),
          axiosInstance.get(`/admin/series/${id}`),
        ]);

        const tracksData = tracksRes.data?.data || tracksRes.data || [];
        setTracks(Array.isArray(tracksData) ? tracksData : []);

        const seriesData = seriesRes.data?.data || seriesRes.data;
        if (seriesData) {
          setSeriesName(seriesData.series_name || "");
          setSeriesDescription(seriesData.description || "");
          setTrackId(seriesData.track_id || "");

          if (seriesData.deadline) {
            const d = new Date(seriesData.deadline);
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            setDeadline(d.toISOString().slice(0, 16));
          }
        }
      } catch (err) {
        toast.error("Failed to load series data");
        router.push("/admin/series");
      } finally {
        setFetching(false);
      }
    };

    if (id) initData();
  }, [id, router]);

  // 2. Handle Update
  const handleUpdateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating series...");

    try {
      const payload = {
        series_name: seriesName,
        description: seriesDescription,
        track_id: parseInt(trackId),
        deadline: new Date(deadline).toISOString(),
      };

      await axiosInstance.put(`/admin/series/${id}`, payload);
      toast.success("Series updated successfully!", { id: toastId });
      router.push("/admin/series");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update series";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Delete
  const handleDelete = async () => {
    setDeleting(true);
    const toastId = toast.loading("Deleting series...");
    try {
      await axiosInstance.delete(`/admin/series/${id}`);
      toast.success("Series deleted successfully", { id: toastId });
      setShowDeleteModal(false);
      router.push("/admin/series");
    } catch (error: any) {
      toast.error("Failed to delete series", { id: toastId });
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (fetching) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="flex min-h-screen bg-white dark:bg-slate-950">
          <AdminSidebar />
          <div className="flex-1 md:ml-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950 relative">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="group inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors mb-4"
              >
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Series List
              </button>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                Edit Series
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Manage details and settings for this series.
              </p>
            </div>

            {/* Form Card (STYLE CREATE SERIES) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              {/* Garis Gradient di Atas */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

              <form onSubmit={handleUpdateSeries} className="space-y-6 mt-2">
                {/* Series Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Series Name
                  </label>
                  <input
                    type="text"
                    value={seriesName}
                    onChange={(e) => setSeriesName(e.target.value)}
                    required
                    placeholder="e.g. Build Website with React.js"
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Parent Track */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Parent Track
                  </label>
                  <div className="relative">
                    <select
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      required
                      className="w-full px-5 py-3 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="" disabled>
                        Select a track...
                      </option>
                      {tracks.map((track) => (
                        <option key={track.id} value={track.id}>
                          {track.track_name || track.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                      <ChevronLeft className="w-5 h-5 -rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={seriesDescription}
                    onChange={(e) => setSeriesDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe this series..."
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Deadline */}
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

                {/* --- ACTION BUTTONS (Update: Style Match Create Series) --- */}
                <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
                  {/* Left Side (Desktop): Delete Button */}
                  {/* Menggunakan style shape yang sama (rounded-xl, px-6 py-3) agar konsisten */}
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden">Delete Series</span>{" "}
                    {/* Teks lengkap di Mobile */}
                    <span className="hidden sm:inline">Delete</span>{" "}
                    {/* Teks singkat di Desktop */}
                  </button>

                  {/* Right Side (Desktop): Cancel & Save Group */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>

                    {/* Style tombol Save ini SAMA PERSIS dengan Create Series */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>

        {/* --- CUSTOM MODAL OVERLAY (Tetap Ada) --- */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Delete Series?
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete this series? This action
                  cannot be undone.
                </p>
              </div>

              <div className="flex border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="w-1/2 px-4 py-4 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors border-r border-slate-100 dark:border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-1/2 px-4 py-4 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
