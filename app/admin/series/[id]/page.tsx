"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import toast from "react-hot-toast"; // Pastikan install react-hot-toast

export default function AdminSeriesDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [series, setSeries] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSeriesDetail();
      fetchSeriesSubmissions();
    }
  }, [id]);

  const fetchSeriesDetail = async () => {
    try {
      const response = await axiosInstance.get(`/admin/series/${id}`);
      const data = response.data?.data || response.data;
      setSeries(data);
    } catch (error) {
      console.error("Failed to fetch series:", error);
      toast.error("Failed to load series details");
    }
  };

  const fetchSeriesSubmissions = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/submissions/series/${id}`
      );
      const data = response.data?.data || response.data || [];
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC BARU: TOGGLE STATUS ---
  const handleToggleStatus = async () => {
    setToggleLoading(true);
    try {
      await axiosInstance.patch(`/admin/series/${id}/toggle`);
      await fetchSeriesDetail(); // Refresh data untuk update UI
      toast.success(
        series.is_active
          ? "Series closed successfully"
          : "Series re-opened successfully"
      );
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to update series status");
    } finally {
      setToggleLoading(false);
    }
  };

  // Helper Variables
  const isExpired = series?.deadline
    ? new Date(series.deadline) < new Date()
    : false;
  // Admin close override status
  const isManuallyClosed = series && !series.is_active;

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-7xl">
            {/* BACK BUTTON */}
            <div className="mb-6">
              <button
                onClick={() => router.push("/admin/series")}
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
                Back to Series List
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : series ? (
              <div className="space-y-8">
                {/* HEADER & INFO CARDS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* LEFT: TITLE & DESC */}
                  <div className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        {series.series_name}
                      </h1>

                      {/* STATUS BADGES */}
                      <div className="flex gap-2">
                        {isManuallyClosed ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                            CLOSED BY ADMIN
                          </span>
                        ) : isExpired ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            EXPIRED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-6 leading-relaxed">
                      {series.description || "No description provided."}
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap gap-4 mb-6">
                      {/* TOGGLE BUTTON */}
                      <button
                        onClick={handleToggleStatus}
                        disabled={toggleLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-bold text-white shadow-sm transition-all flex items-center gap-2 ${
                          series.is_active
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {toggleLoading ? (
                          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : series.is_active ? (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                            Close Series
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Re-open Series
                          </>
                        )}
                      </button>
                    </div>

                    {/* DETAILS */}
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 shadow-sm">
                        <svg
                          className="w-4 h-4 text-blue-500"
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
                        <span>
                          Track ID:{" "}
                          <span className="font-semibold">
                            {series.track_id}
                          </span>
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-lg text-sm shadow-sm ${
                          isExpired
                            ? "border-red-200 text-red-600"
                            : "border-slate-200 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <svg
                          className="w-4 h-4 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          Deadline:{" "}
                          <span className="font-semibold">
                            {series.deadline
                              ? new Date(series.deadline).toLocaleString()
                              : "-"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: STATS CARDS */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                        Total Submissions
                      </p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {submissions.length}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center overflow-hidden relative">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                        Verification Code
                      </p>
                      {series.verification_code ? (
                        <code className="text-medium font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 tracking-widest select-all">
                          {series.verification_code}
                        </code>
                      ) : (
                        <span className="text-sm font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                          Not Set
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* SUBMISSION LIST SECTION (SAMA SEPERTI SEBELUMNYA) */}
                <div className="mt-12">
                  {/* ... (Tabel Submissions tetap sama, tidak perlu diubah) ... */}
                  {/* Pastikan bagian mapping user.avatar yang sudah kita perbaiki sebelumnya tetap ada */}

                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                      Student Submissions
                    </h2>
                  </div>

                  {submissions.length > 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-sm min-w-[700px]">
                          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                            <tr>
                              <th className="px-6 py-4">Student</th>
                              <th className="px-6 py-4">Submitted File</th>
                              <th className="px-6 py-4">Status & Score</th>
                              <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {submissions.map((sub: any) => {
                              const name = sub.user?.name || "Unknown";
                              const initials = name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase();
                              const avatarPath = sub.user?.avatar;
                              const avatarUrl = avatarPath
                                ? avatarPath.startsWith("http")
                                  ? avatarPath
                                  : `http://localhost:8080/${avatarPath}`
                                : null;

                              return (
                                <tr
                                  key={sub.id}
                                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden flex-shrink-0">
                                        {avatarUrl ? (
                                          <img
                                            src={avatarUrl}
                                            alt={name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          initials
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-semibold text-slate-900 dark:text-white">
                                          {name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                          {sub.user?.email || "No email"}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <a
                                      href={sub.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                                    >
                                      <span className="truncate max-w-[150px]">
                                        {sub.file_url}
                                      </span>
                                    </a>
                                  </td>
                                  <td className="px-6 py-4">
                                    {sub.score > 0 ? (
                                      <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                        Scored: {sub.score}
                                      </span>
                                    ) : (
                                      <span className="text-yellow-600 font-bold text-xs bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() =>
                                        router.push(
                                          `/admin/submissions/${sub.id}`
                                        )
                                      }
                                      className="text-blue-600 hover:underline text-xs font-bold"
                                    >
                                      Grade
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                      No submissions yet.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 font-bold text-2xl">
                Series not found
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
