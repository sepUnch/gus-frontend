"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Layers,
  CheckCircle,
  XCircle,
  Filter,
  AlertTriangle, // Import Icon Warning
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManageSeriesPage() {
  const router = useRouter();
  const [allSeries, setAllSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // --- MODAL STATE ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [seriesToDelete, setSeriesToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      toast.error("Failed to load series data");
    } finally {
      setLoading(false);
    }
  };

  // --- TRIGGER DELETE MODAL ---
  const openDeleteModal = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Stop navigasi ke detail
    setSeriesToDelete(id);
    setShowDeleteModal(true);
  };

  // --- EXECUTE DELETE (API CALL) ---
  const confirmDelete = async () => {
    if (!seriesToDelete) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting series...");

    try {
      await axiosInstance.delete(`/admin/series/${seriesToDelete}`);

      toast.success("Series deleted successfully", { id: toastId });

      // Hapus dari state agar UI update tanpa reload
      setAllSeries((prev) => prev.filter((item) => item.id !== seriesToDelete));

      // Reset Modal
      setShowDeleteModal(false);
      setSeriesToDelete(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error("Failed to delete series", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  // --- EDIT NAVIGATION ---
  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    router.push(`/admin/series/edit/${id}`);
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
      {/* Tambahkan relative disini untuk context modal */}
      <div className="flex min-h-screen bg-background relative">
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
                <Plus className="w-5 h-5" />
                Create New Series
              </button>
            </div>

            {/* SEARCH BAR */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search series by name or track..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* STATS SUMMARY */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <Layers className="w-4 h-4" /> Total
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : totalSeries}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1 text-green-600 dark:text-green-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Active
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : activeSeries}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  <XCircle className="w-4 h-4" /> Closed
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? "..." : closedSeries}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <Filter className="w-4 h-4" /> Filtered
                </div>
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
                    {/* Gradient Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-300 to-pink-300"></div>

                    {/* HEADER ROW: ID & STATUS */}
                    <div className="flex justify-between items-start mb-4 mt-1">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                        #{series.id}
                      </span>

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

                    {/* SERIES NAME */}
                    <h3
                      className={`text-xl font-bold mb-2 line-clamp-2 transition-colors ${
                        series.is_active
                          ? "text-slate-900 dark:text-white group-hover:text-indigo-600"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {series.series_name || series.name}
                    </h3>

                    {/* PARENT TRACK LABEL */}
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

                    {/* FOOTER INFO */}
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Code</span>
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

                    {/* ACTION BUTTONS ROW */}
                    <div className="mt-4 flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={(e) => handleEdit(e, series.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        // MENGGUNAKAN openDeleteModal
                        onClick={(e) => openDeleteModal(e, series.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  No Series Found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Try adjusting your search query or create a new series.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* --- CUSTOM DELETE MODAL OVERLAY (SAMA SEPERTI PAGE EDIT) --- */}
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
                  disabled={isDeleting}
                  className="w-1/2 px-4 py-4 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors border-r border-slate-100 dark:border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="w-1/2 px-4 py-4 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
