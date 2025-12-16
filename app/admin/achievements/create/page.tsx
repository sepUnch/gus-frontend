"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import toast from "react-hot-toast"; // 1. Import Toast

export default function CreateAchievementPage() {
  const router = useRouter();

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [typeId, setTypeId] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  // Data States
  const [types, setTypes] = useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axiosInstance.get("/admin/achievement-types");
        const data = res.data?.data || res.data || [];
        setTypes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch types", err);
        toast.error("Failed to load achievement types");
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    if (!typeId) {
      toast.error("Please select an achievement type.");
      setCreating(false);
      return;
    }

    // 2. Toast Loading
    const toastId = toast.loading("Creating achievement...");

    try {
      await axiosInstance.post("/admin/achievements", {
        name,
        description,
        achievement_type_id: parseInt(typeId),
        icon_url: iconUrl || "🏆",
      });

      // 3. Toast Sukses & Redirect
      toast.success("Achievement created successfully!", { id: toastId });
      router.push("/admin/achievements");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create achievement";
      // 4. Toast Error
      toast.error(msg, { id: toastId });
    } finally {
      setCreating(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
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

              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                Create New Achievement
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Design a new badge to reward user milestones and engagement.
              </p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

              <form onSubmit={handleCreate} className="space-y-6 mt-2">
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
                    placeholder="e.g. Fast Learner, Weekend Warrior"
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
                      <p className="text-xs text-slate-500 mt-1.5 ml-1">
                        You can paste an emoji or short text here.
                      </p>
                    </div>

                    <div className="w-16 h-14 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-3xl shadow-sm shrink-0">
                      {iconUrl || "❓"}
                    </div>
                  </div>
                </div>

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
                    disabled={creating}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Create Achievement
                      </>
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
