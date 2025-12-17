"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import toast from "react-hot-toast";

import {
  Trophy,
  Plus,
  Search,
  Award,
  Loader2,
  Medal,
  Star,
  Target,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function ManageAchievementsPage() {
  const router = useRouter();

  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/achievements");
      const rawData = response.data?.data || response.data || [];
      setAchievements(Array.isArray(rawData) ? rawData : []);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!idToDelete) return;
    setIsDeleting(true);
    const toastId = toast.loading("Deleting achievement...");

    try {
      await axiosInstance.delete(`/admin/achievements/${idToDelete}`);
      toast.success("Achievement deleted successfully", { id: toastId });
      setAchievements((prev) => prev.filter((item) => item.id !== idToDelete));
      setShowDeleteModal(false);
    } catch (err: any) {
      toast.error("Failed to delete achievement", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter Logic
  const filteredAchievements = achievements.filter(
    (ach) =>
      (ach.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ach.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats Logic
  const stats = {
    total: achievements.length,
    types: new Set(achievements.map((a) => a.achievement_type_id)).size,
    recent:
      achievements.length > 0
        ? achievements[achievements.length - 1].name
        : "-",
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background relative">
        <AdminSidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-7xl">
            {/* HEADER SECTION */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                    Achievements
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    Gamify the experience by managing badges and milestones.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => router.push("/admin/achievements/award")}
                    className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Award className="w-5 h-5" />
                    Give to User
                  </button>

                  <button
                    onClick={() => router.push("/admin/achievements/create")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create New
                  </button>
                </div>
              </div>

              {/* STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Badges
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.total}
                    </h3>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Medal className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Badge Types
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.types}
                    </h3>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Star className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Newest
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                      {stats.recent}
                    </h3>
                  </div>
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search achievements by name or description..."
                  className="w-full px-5 py-3 pl-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* CONTENT GRID */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  Loading achievements...
                </p>
              </div>
            ) : filteredAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAchievements.map((ach) => {
                  // Tentukan warna berdasarkan tipe
                  const isTrack = ach.type?.name === "TRACK_COMPLETION";
                  const isSeries = ach.type?.name === "SERIES_COMPLETION";

                  let gradientClass = "from-slate-400 to-slate-300"; // Default
                  let badgeColor =
                    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

                  if (isTrack) {
                    gradientClass = "from-blue-400 to-cyan-300";
                    badgeColor =
                      "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
                  } else if (isSeries) {
                    gradientClass = "from-purple-400 to-pink-300";
                    badgeColor =
                      "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
                  } else {
                    gradientClass = "from-amber-400 to-orange-300"; // Special/General
                    badgeColor =
                      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
                  }

                  return (
                    <div
                      key={ach.id}
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col h-full hover:-translate-y-1"
                    >
                      {/* Decorative Top Line */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClass}`}
                      ></div>

                      {/* ID Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          ID: {ach.id}
                        </span>
                      </div>

                      {/* ICON & TITLE */}
                      <div className="flex items-start gap-4 mb-4 mt-2">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl border border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                          {ach.icon_url || "🏆"}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                            {ach.name}
                          </h3>
                          {/* Type Badge */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}
                          >
                            {isTrack && <Target className="w-3 h-3" />}
                            {isSeries && <Medal className="w-3 h-3" />}
                            {!isTrack && !isSeries && (
                              <Star className="w-3 h-3" />
                            )}
                            {ach.type?.name?.replace(/_/g, " ") || "GENERAL"}
                          </span>
                        </div>
                      </div>

                      {/* DESCRIPTION */}
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {ach.description}
                        </p>
                      </div>

                      {/* [UPDATE] FOOTER ACTION BUTTONS */}
                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/achievements/edit/${ach.id}`)
                          }
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 rounded-lg transition-colors border border-slate-100 dark:border-slate-700"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setIdToDelete(ach.id);
                            setShowDeleteModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition-colors border border-slate-100 dark:border-slate-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No achievements found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchTerm
                    ? "Try adjusting your search query."
                    : "Get started by creating your first achievement."}
                </p>

                {!searchTerm && (
                  <button
                    onClick={() => router.push("/admin/achievements/create")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Badge
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        {/* DELETE MODAL POPUP */}
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
                  Delete Achievement?
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="w-1/2 px-4 py-4 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors border-r border-slate-100 dark:border-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-1/2 px-4 py-4 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
