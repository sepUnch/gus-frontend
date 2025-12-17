"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import Link from "next/link";
import toast from "react-hot-toast";
import { Pencil, Trash2, AlertTriangle, Plus } from "lucide-react";

export default function AdminTrackDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- MODAL DELETE STATE ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchTrackDetail();
  }, [id]);

  const fetchTrackDetail = async () => {
    try {
      const response = await axiosInstance.get(`/admin/tracks/${id}`);
      setTrack(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to fetch track detail:", error);
      toast.error("Failed to load track details.");
      router.push("/admin/tracks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const toastId = toast.loading("Deleting track...");
    try {
      await axiosInstance.delete(`/admin/tracks/${id}`);
      toast.success("Track deleted successfully", { id: toastId });
      setShowDeleteModal(false);
      router.push("/admin/tracks");
    } catch (error: any) {
      toast.error("Failed to delete track", { id: toastId });
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // --- LOGIC AVATAR ADMIN ---
  const renderAdminAvatar = (admin: any) => {
    const name = admin?.name || "Admin";
    const initials = name.substring(0, 2).toUpperCase();

    // Logic avatar sama seperti code Anda ...
    // (Disingkat biar fokus ke perubahan tombol)
    const avatarPath = admin?.avatar;
    let avatarUrl = null;
    if (avatarPath && avatarPath.trim() !== "") {
      avatarUrl = avatarPath.startsWith("http")
        ? avatarPath
        : `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
          }/${avatarPath}`;
    }

    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md bg-white"
        />
      );
    }

    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white dark:border-slate-700 shadow-md">
        {initials}
      </div>
    );
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 relative">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-7xl">
            {/* BACK NAV */}
            <div className="mb-6 flex justify-between items-center">
              <button
                onClick={() => router.back()}
                className="group flex items-center text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium"
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
                Back to Tracks
              </button>

              {/* TOMBOL EDIT & DELETE TRACK (INI YANG BARU) */}
              {!loading && track && (
                <div className="flex gap-3">
                  <Link
                    href={`/admin/tracks/edit/${id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <Pencil className="w-4 h-4" /> Edit Track
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : track ? (
              <>
                {/* --- HEADER TITLE --- */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-[10px] font-extrabold uppercase tracking-widest border border-blue-200 dark:border-blue-700">
                      {track.track_type || "COURSE TRACK"}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">
                      ID: {track.id}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 tracking-tight">
                    {track.track_name || track.name}
                  </h1>
                </div>

                {/* --- GRID INFO --- */}
                {/* (Code Grid Info sama persis seperti file Anda sebelumnya, tidak saya ubah) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 items-stretch">
                  {/* Description & Admin Card logic here... (Keep your existing code) */}
                  <div className="lg:col-span-2 flex flex-col">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm h-full relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                        About Track
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed flex-1">
                        {track.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                  <div className="lg:col-span-1 flex flex-col">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full relative overflow-hidden flex flex-col justify-between">
                      {/* Admin Info logic here... (Keep your existing code) */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                          Created By
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md flex-shrink-0 relative">
                            <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                              {renderAdminAvatar(
                                track.created_by || track.CreatedBy
                              )}
                            </div>
                          </div>
                          <div className="min-w-0 overflow-hidden">
                            <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                              {track.created_by?.name ||
                                track.CreatedBy?.name ||
                                "Admin"}
                            </p>
                            <p className="text-xs text-slate-500 font-mono truncate">
                              {track.created_by?.email ||
                                track.CreatedBy?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Stats */}
                      <div className="my-6 border-t border-slate-100 dark:border-slate-800"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                            Track ID
                          </p>
                          <p className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 inline-block px-2 py-1 rounded text-sm">
                            #{track.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">
                            Total Series
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white text-xl">
                            {track.series?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- SERIES LIST HEADER --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4 border-t border-slate-200 dark:border-slate-800 pt-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      Curriculum Series
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      Manage the learning path for your students.
                    </p>
                  </div>

                  {/* Button Add Series (Sudah ada di code Anda) */}
                  <Link
                    href="/admin/series/create"
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Series
                  </Link>
                </div>

                {/* --- SERIES GRID (Code Anda sudah bagus) --- */}
                {track.series && track.series.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {track.series.map((series: any, index: number) => (
                      <div
                        key={series.id}
                        onClick={() =>
                          router.push(`/admin/series/${series.id}`)
                        }
                        className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 relative overflow-hidden flex flex-col h-full"
                      >
                        {/* ... Isi Series Card sama persis code Anda ... */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-75 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-4 mt-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-sm border border-slate-200 dark:border-slate-700">
                            {index + 1}
                          </div>
                          {/* Status Badges */}
                          {series.is_active ? (
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                              CLOSED
                            </span>
                          )}
                        </div>
                        <div className="flex-1 mb-4">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {series.series_name || series.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                            {series.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty State (Code Anda sudah bagus)
                  <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                    <p className="text-slate-500">No series added yet.</p>
                  </div>
                )}
              </>
            ) : (
              // Not Found State
              <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-2xl font-bold">Track Not Found</h2>
                <Link href="/admin/tracks" className="mt-4 text-blue-600">
                  Back to Tracks
                </Link>
              </div>
            )}
          </div>
        </main>

        {/* --- CUSTOM DELETE MODAL --- */}
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
                  Are you sure? This might delete all associated series.
                </p>
              </div>
              <div className="flex border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="w-1/2 px-4 py-4 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors border-r border-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-1/2 px-4 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
