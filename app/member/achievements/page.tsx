"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { MemberNavbar } from "@/components/member-navbar";
import axiosInstance from "@/lib/api-client";
import { 
  Trophy, 
  Calendar, 
  Award, 
  Sparkles, 
  Lock, 
  Medal 
} from "lucide-react";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      // Fetch data dari endpoint member
      const response = await axiosInstance.get("/member/me/achievements");
      const rawData = response.data?.data || response.data || [];
      
      if (Array.isArray(rawData)) {
        setAchievements(rawData);
      } else {
        setAchievements([]);
      }

    } catch (err: any) {
      console.error("Error fetching achievements:", err);
      if (err.response?.status === 403) {
         setError("Access denied. Please login again.");
      } else {
         setError("Failed to load your achievements.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <MemberNavbar />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
          
          {/* HERO HEADER */}
          <div className="mb-12 text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Trophy className="w-3 h-3" />
                Hall of Fame
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                Your <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Achievements</span>
             </h1>
             <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Celebrating your milestones. Collect badges by completing tracks, series, and participating in events.
             </p>
          </div>

          {/* ERROR STATE */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-200">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                {error}
            </div>
          )}

          {/* CONTENT */}
          {loading ? (
             // SKELETON LOADING
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 h-64 animate-pulse flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                    </div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.isArray(achievements) && achievements.length > 0 ? (
                achievements.map((item: any) => {
                  // Normalisasi data (mengantisipasi struktur nested)
                  const ach = item.achievement || item;
                  
                  return (
                    <div 
                      key={ach.id || item.achievement_id} 
                      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      {/* Decorative Gradient Top */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>

                      {/* Icon Circle */}
                      <div className="mb-5 relative">
                          <div className="absolute inset-0 bg-yellow-100 dark:bg-yellow-900/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 border-4 border-white dark:border-slate-700 shadow-inner rounded-full flex items-center justify-center text-5xl transform group-hover:scale-110 transition-transform duration-300">
                             {ach.icon_url || "🏆"}
                          </div>
                          {/* Badge Checkmark */}
                          <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900">
                             <Sparkles className="w-3 h-3" />
                          </div>
                      </div>

                      {/* Text Content */}
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 leading-tight">
                          {ach.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                        {ach.description || "You have successfully unlocked this achievement."}
                      </p>
                      
                      {/* Footer: Date */}
                      {item.earned_at && (
                          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex justify-center">
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(item.earned_at).toLocaleDateString()}
                              </span>
                          </div>
                      )}
                    </div>
                  );
                })
              ) : (
                // EMPTY STATE
                <div className="col-span-full py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-sm border-dashed">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Lock className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      No Achievements Yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    You haven't unlocked any badges yet. Start completing tracks and series to fill up your trophy case!
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}