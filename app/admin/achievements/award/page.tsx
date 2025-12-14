"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import { Loader2, ArrowLeft, Award, Sparkles, User, CheckCircle, AlertCircle } from "lucide-react";

export default function AwardAchievementPage() {
  const router = useRouter();

  // Form States
  const [userId, setUserId] = useState("");
  const [achievementId, setAchievementId] = useState("");
  
  // Data States
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [awarding, setAwarding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axiosInstance.get("/admin/achievements");
        const data = response.data?.data || response.data || [];
        setAchievements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load achievements", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchAchievements();
  }, []);

  const handleAward = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAwarding(true);

    if (!userId || !achievementId) {
      setError("Please fill in all fields");
      setAwarding(false);
      return;
    }

    try {
      await axiosInstance.post("/admin/achievements/award", {
        user_id: parseInt(userId),
        achievement_id: parseInt(achievementId),
      });

      setSuccess("🎉 Achievement successfully awarded to the user!");
      setUserId("");
      setAchievementId("");
      
      // Auto clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 5000);

    } catch (err: any) {
      console.error("Award error:", err);
      const msg = err.response?.data?.message || "Failed to award achievement.";
      setError(msg);
    } finally {
      setAwarding(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-3xl">
            
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
                Award Achievement
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Manually grant a badge or milestone to a specific community member.
              </p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

                <form onSubmit={handleAward} className="space-y-6 mt-2">
                    
                    {/* INPUT: USER ID */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Member ID
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                required
                                placeholder="e.g. 101"
                                className="w-full pl-12 pr-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                            />
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <User className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5 ml-1">
                            Check the <b>Users</b> menu to find the correct Member ID.
                        </p>
                    </div>

                    {/* INPUT: ACHIEVEMENT SELECT */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Select Achievement
                        </label>
                        <div className="relative">
                            <select
                                value={achievementId}
                                onChange={(e) => setAchievementId(e.target.value)}
                                required
                                disabled={loadingData}
                                className="w-full px-5 py-3 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                            >
                                <option value="">-- Choose Achievement --</option>
                                {achievements.map((ach) => (
                                    <option key={ach.id} value={ach.id}>
                                        {ach.icon_url} {ach.name} (Type: {ach.type?.name?.replace(/_/g, ' ') || "General"})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                            <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
                        </div>
                    )}

                    {/* SUCCESS MESSAGE */}
                    {success && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm text-green-800 dark:text-green-200 font-medium">{success}</span>
                        </div>
                    )}

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
                            disabled={awarding || loadingData}
                            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {awarding ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Award Badge
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