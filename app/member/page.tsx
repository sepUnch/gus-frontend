"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { MemberNavbar } from "@/components/member-navbar";
import { tracksAPI } from "@/lib/api/tracks";
import { Search, BookOpen, ArrowRight, Sparkles, Layers } from "lucide-react";

export default function MemberTracksPage() {
  const router = useRouter();
  
  // State
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const response = await tracksAPI.getAll();
      // Pastikan akses data sesuai struktur backend Anda (response.data.data)
      const tracksData = response.data?.data || response.data || [];
      setTracks(Array.isArray(tracksData) ? tracksData : []);
    } catch (err: any) {
      console.error("Error loading tracks:", err);
      setError("Failed to load learning tracks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredTracks = tracks.filter((track) => {
    const name = track.track_name || track.name || "";
    const desc = track.description || "";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <MemberNavbar />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
          
          {/* HERO SECTION */}
          <div className="relative mb-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3 h-3" />
                        Learning Journey
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                        Explore Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Learning Tracks</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        Master new skills with our structured learning paths. Choose a track and start building your future today.
                    </p>
                </div>

                {/* SEARCH BAR */}
                <div className="w-full md:w-auto min-w-[300px]">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-30 group-hover:opacity-100 transition duration-200 blur"></div>
                        <div className="relative bg-white dark:bg-slate-900 rounded-xl flex items-center">
                             <Search className="w-5 h-5 text-slate-400 ml-4" />
                             <input 
                                type="text"
                                placeholder="Search tracks..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-3 px-4 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400"
                             />
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-200">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
            </div>
          )}

          {/* CONTENT GRID */}
          {loading ? (
             // SKELETON LOADING
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 h-64 animate-pulse">
                   <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
                   <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
                   <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2"></div>
                   <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredTracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTracks.map((track) => {
                 // Hitung jumlah series jika ada datanya
                 const seriesCount = track.series?.length || track.Series?.length || 0;

                 return (
                  <div
                    key={track.id}
                    onClick={() => router.push(`/member/tracks/${track.id}`)}
                    className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                  >
                    {/* Decorative Gradient Top */}
                    <div className="h-2 w-full bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-400"></div>

                    <div className="p-6 md:p-8">
                        {/* Icon & Badge Row */}
                        <div className="flex justify-between items-start mb-6">
                            {/* <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="w-7 h-7" />
                            </div> */}
                            
                            {seriesCount > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    <Layers className="w-3.5 h-3.5" />
                                    {seriesCount} Series
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {track.track_name || track.name}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 line-clamp-3">
                            {track.description || "Start your journey in this track to master new skills and concepts."}
                        </p>

                        {/* Footer Action */}
                        <div className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform duration-300">
                            Start Learning
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // EMPTY STATE
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                   <BookOpen className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No tracks found</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
                    {searchQuery 
                        ? `We couldn't find any tracks matching "${searchQuery}". Try a different keyword.` 
                        : "There are no learning tracks available at the moment. Please check back later."}
                </p>
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
                    >
                        Clear Search
                    </button>
                )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}