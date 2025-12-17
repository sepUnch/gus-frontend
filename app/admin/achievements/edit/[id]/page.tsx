"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import { Loader2, ArrowLeft, Save, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function EditAchievementPage() {
  const router = useRouter();
  const { id } = useParams();

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [typeId, setTypeId] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  // Data States
  const [types, setTypes] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true); // Loading awal (fetch data)
  const [saving, setSaving] = useState(false); // Loading saat save

  // Modal Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 1. Fetch Initial Data (Types & Achievement Detail)
  useEffect(() => {
    const initData = async () => {
      try {
        // Parallel Fetch: Get Types & Get Detail
        const [typesRes, detailRes] = await Promise.all([
          axiosInstance.get("/admin/achievement-types"),
          axiosInstance.get(`/admin/achievements/${id}`),
        ]);

        // Set Types
        const typesData = typesRes.data?.data || typesRes.data || [];
        setTypes(Array.isArray(typesData) ? typesData : []);

        // Set Form Data from Detail
        const detail = detailRes.data?.data || detailRes.data;
        if (detail) {
          setName(detail.name || "");
          setDescription(detail.description || "");
          // Handle type_id (bisa jadi achievement_type_id atau type_id tergantung backend response)
          const tId = detail.achievement_type_id || detail.type_id || "";
          setTypeId(tId.toString());
          setIconUrl(detail.icon_url || "");
        }
      } catch (err) {
        console.error("Failed to load data", err);
        toast.error("Failed to load achievement details");
        router.push("/admin/achievements");
      } finally {
        setLoadingData(false);
      }
    };

    if (id) initData();
  }, [id, router]);

  // 2. Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!typeId) {
      toast.error("Please select an achievement type.");
      setSaving(false);
      return;
    }

    const toastId = toast.loading("Updating achievement...");

    try {
      await axiosInstance.put(`/admin/achievements/${id}`, {
        name,
        description,
        achievement_type_id: parseInt(typeId),
        icon_url: iconUrl || "🏆",
      });

      toast.success("Achievement updated successfully!", { id: toastId });
      router.push("/admin/achievements");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update achievement";
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // 3. Handle Delete
  const handleDelete = async () => {
    setDeleting(true);
    const toastId = toast.loading("Deleting achievement...");
    try {
      await axiosInstance.delete(`/admin/achievements/${id}`);
      toast.success("Achievement deleted", { id: toastId });
      router.push("/admin/achievements");
    } catch (err) {
      toast.error("Failed to delete", { id: toastId });
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loadingData) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="flex min-h-screen bg-background">
          <AdminSidebar />
          <div className="flex-1 md:ml-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background relative">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-4xl">
            {/* BACK BUTTON & HEADER */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="group flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-4 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Achievements
              </button>

              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                    Edit Achievement
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    Update badge details and criteria.
                  </p>
                </div>
                {/* ID Badge */}
                <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-xs">
                  ID: {id}
                </span>
              </div>
            </div>

            {/* FORM CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              {/* Gradient Strip (Sama seperti Create Page) */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

              <form onSubmit={handleUpdate} className="space-y-6 mt-2">
                {/* INPUT: NAME */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Achievement Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Fast Learner"
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* INPUT: TYPE (DROPDOWN) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Achievement Type
                  </label>
                  <div className="relative">
                    <select
                      value={typeId}
                      onChange={(e) => setTypeId(e.target.value)}
                      required
                      className="w-full px-5 py-3 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all capitalize"
                    >
                      <option value="">-- Select Type --</option>
                      {types.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name.replace(/_/g, " ")}
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

                {/* INPUT: DESCRIPTION */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe how users can earn this badge..."
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* INPUT: ICON */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Icon (Emoji)
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={iconUrl}
                        onChange={(e) => setIconUrl(e.target.value)}
                        placeholder="e.g. 🏆 or 🚀"
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="w-16 h-14 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-3xl shadow-sm shrink-0">
                      {iconUrl || "❓"}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row gap-4 justify-between">
                  {/* Delete Button (Left) */}
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="sm:hidden">Delete</span>
                    <span className="hidden sm:inline">Delete Achievement</span>
                  </button>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>

        {/* DELETE MODAL */}
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
                  Are you sure? This action cannot be undone.
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
