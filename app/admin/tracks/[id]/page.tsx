"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminTrackDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  // --- LOGIC AVATAR ADMIN ---
  const renderAdminAvatar = (admin: any) => {
    const name = admin?.name || "Admin";
    const initials = name.substring(0, 2).toUpperCase();

    if (!admin) {
      return (
        <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-400 font-bold">
          ?
        </div>
      );
    }

    const avatarPath = admin.avatar;
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
          onError={(e) => {
            // Hide the image and show the fallback
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement?.classList.add("fallback-active");
          }}
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
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-7xl">
            {/* BACK NAV */}
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="mb-8 group flex items-center text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium"
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
            </div>

            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                  <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                </div>
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

                {/* --- SPLIT LAYOUT GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 items-stretch">
                  {/* LEFT COL: DESCRIPTION */}
                  <div className="lg:col-span-2 flex flex-col">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm h-full relative overflow-hidden flex flex-col">
                      {/* Decorative Line */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                        About Track
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed flex-1">
                        {track.description ||
                          "No description provided for this track."}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT COL: ADMIN INFO */}
                  <div className="lg:col-span-1 flex flex-col">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full relative overflow-hidden flex flex-col justify-between">
                      {/* Consistent Decorative Line */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>

                      {/* Admin Profile Section */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                          Created By
                        </h3>
                        <div className="flex items-center gap-4">
                          {/* AVATAR CONTAINER */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md flex-shrink-0 relative">
                            <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center [&.fallback-active_img]:hidden [&.fallback-active]:bg-gradient-to-br [&.fallback-active]:from-indigo-500 [&.fallback-active]:to-purple-600 [&.fallback-active]:text-white">
                              {renderAdminAvatar(
                                track.created_by || track.CreatedBy
                              )}
                              {/* Fallback Initial if img fails */}
                              <span className="hidden font-bold text-sm">
                                {(
                                  track.created_by?.name ||
                                  track.CreatedBy?.name ||
                                  "A"
                                )
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* INFO ADMIN */}
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

                      <div className="my-6 border-t border-slate-100 dark:border-slate-800"></div>

                      {/* Stats Grid Mini */}
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

                  <Link
                    href="/admin/series/create"
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
                    Add Series
                  </Link>
                </div>

                {/* --- SERIES GRID --- */}
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
                        {/* Gradient Top Line */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-75 group-hover:opacity-100 transition-opacity"></div>

                        {/* Header */}
                        <div className="flex justify-between items-start mb-4 mt-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-sm border border-slate-200 dark:border-slate-700">
                            {series.order_index || index + 1}
                          </div>
                          {series.is_active ? (
                            <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-800">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase">
                                Active
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-800">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                              <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase">
                                Closed
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 mb-4">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {series.series_name || series.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                            {series.description || "No description provided."}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Deadline:{" "}
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {series.deadline
                                ? new Date(series.deadline).toLocaleDateString()
                                : "-"}
                            </span>
                          </div>
                          {series.verification_code ? (
                            <span className="text-[10px] font-mono font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded border border-green-100 dark:border-green-800">
                              CODE: {series.verification_code}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-red-400 uppercase">
                              Missing Code
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty State Minimalist
                  <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
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
                    <p className="text-slate-900 dark:text-white font-semibold text-lg mb-2">
                      No series added yet.
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                      Get started by creating the first module for this track.
                    </p>
                    <Link
                      href="/admin/series/create"
                      className="inline-flex px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all items-center gap-2"
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
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-12 h-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Track Not Found
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  The track you are looking for does not exist or has been
                  removed.
                </p>
                <Link
                  href="/admin/tracks"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Back to Tracks
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
