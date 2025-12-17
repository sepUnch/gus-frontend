"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import toast from "react-hot-toast";
import { ChevronLeft, Trash2, AlertTriangle } from "lucide-react";

export default function EditTrackPage() {
  const router = useRouter();
  const { id } = useParams();

  // Form State
  const [trackName, setTrackName] = useState("");
  const [description, setDescription] = useState("");

  // Loading State
  const [loading, setLoading] = useState(false); // Untuk save
  const [fetching, setFetching] = useState(true); // Untuk fetch data awal

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await axiosInstance.get(`/admin/tracks/${id}`);
        const data = res.data?.data || res.data;

        if (data) {
          setTrackName(data.track_name || data.name || "");
          setDescription(data.description || "");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load track data");
        router.push("/admin/tracks");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchTrack();
  }, [id, router]);

  // 2. Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating track...");

    try {
      const payload = {
        track_name: trackName,
        description: description,
      };

      await axiosInstance.put(`/admin/tracks/${id}`, payload);
      toast.success("Track updated successfully!", { id: toastId });
      router.push("/admin/tracks");
    } catch (err: any) {
      console.error("Update error:", err);
      const msg = err.response?.data?.message || "Failed to update track";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Delete
  const handleDelete = async () => {
    setDeleting(true);
    const toastId = toast.loading("Deleting track...");

    try {
      await axiosInstance.delete(`/admin/tracks/${id}`);
      toast.success("Track deleted successfully", { id: toastId });
      setShowDeleteModal(false);
      router.push("/admin/tracks");
    } catch (error: any) {
      console.error("Delete error:", error);
      const msg = error.response?.data?.message || "Failed to delete track";
      toast.error(msg, { id: toastId });
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
                Back to List
              </button>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                Edit Track
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Manage track details and information.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              {/* Gradient Strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

              <form onSubmit={handleUpdate} className="space-y-6 mt-2">
                {/* Track Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Track Name
                  </label>
                  <input
                    type="text"
                    value={trackName}
                    onChange={(e) => setTrackName(e.target.value)}
                    required
                    placeholder="e.g. Web Development"
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe this track..."
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
                  {/* Left: Delete Button */}
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden">Delete Track</span>
                    <span className="hidden sm:inline">Delete</span>
                  </button>

                  {/* Right: Cancel & Save */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
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
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>

        {/* --- CUSTOM MODAL OVERLAY (INSTANT & CENTERED) --- */}
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
                  Delete Track?
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete this track? This might also
                  delete all associated series. This action cannot be undone.
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
