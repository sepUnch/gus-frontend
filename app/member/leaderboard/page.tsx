"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { MemberNavbar } from "@/components/member-navbar";
import { tracksAPI } from "@/lib/api/tracks";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Search, 
  User, 
  BarChart3, 
  ChevronDown 
} from "lucide-react";

// --- KOMPONEN UTAMA ---
function LeaderboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State Data
  const [tracks, setTracks] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  
  // State UI
  const [selectedTrackId, setSelectedTrackId] = useState(searchParams.get("trackId") || "");
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [error, setError] = useState("");

  // 1. Fetch List Tracks (untuk Dropdown)
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await tracksAPI.getAll();
        const data = res.data?.data || res.data || [];
        setTracks(Array.isArray(data) ? data : []);
        
        // Jika tidak ada trackId di URL tapi tracks ada, set default ke track pertama
        if (!selectedTrackId && Array.isArray(data) && data.length > 0) {
           setSelectedTrackId(String(data[0].id));
        }
      } catch (err) {
        console.error("Failed to fetch tracks", err);
      } finally {
        setLoadingTracks(false);
      }
    };
    fetchTracks();
  }, []);

  // 2. Fetch Leaderboard ketika selectedTrackId berubah
  useEffect(() => {
    if (!selectedTrackId) return;

    const fetchLeaderboard = async () => {
      try {
        setLoadingBoard(true);
        setError("");
        
        // Update URL tanpa refresh halaman agar bisa di-share
        router.replace(`/member/leaderboard?trackId=${selectedTrackId}`, { scroll: false });

        const { data } = await tracksAPI.getLeaderboard(selectedTrackId);
        setLeaderboard(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Leaderboard error:", err);
        setError("Failed to load leaderboard data.");
        setLeaderboard([]);
      } finally {
        setLoadingBoard(false);
      }
    };

    fetchLeaderboard();
  }, [selectedTrackId]);

  // Helper untuk mendapatkan nama track yang sedang dipilih
  const currentTrackName = tracks.find(t => String(t.id) === String(selectedTrackId))?.name || "Unknown Track";

  // Pisahkan Top 3 dan Sisanya
  const topThree = leaderboard.slice(0, 3);
  const restOfList = leaderboard.slice(3);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider mb-4">
             <Trophy className="w-3 h-3" />
             Hall of Fame
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
             Leaderboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
             See who's topping the charts in the <b>{currentTrackName}</b> track. Keep learning to climb the ranks!
          </p>
        </div>

        {/* TRACK SELECTOR (DROPDOWN) */}
        <div className="w-full md:w-72">
             <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Select Track
             </label>
             <div className="relative">
                <select
                    value={selectedTrackId}
                    onChange={(e) => setSelectedTrackId(e.target.value)}
                    disabled={loadingTracks}
                    className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-900 dark:text-white py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all font-medium cursor-pointer"
                >
                    {loadingTracks ? (
                        <option>Loading tracks...</option>
                    ) : (
                        tracks.map(track => (
                            <option key={track.id} value={track.id}>
                                {track.track_name || track.name}
                            </option>
                        ))
                    )}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
             </div>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-200 flex items-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            {error}
        </div>
      )}

      {/* LOADING SKELETON */}
      {loadingBoard ? (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
                {[1,2,3].map(i => (
                    <div key={i} className={`bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse ${i===2 ? 'h-64' : 'h-48'}`}></div>
                ))}
            </div>
            <div className="space-y-3">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse"></div>
                ))}
            </div>
        </div>
      ) : leaderboard.length === 0 ? (
        // EMPTY STATE
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Data Yet</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                There are no rankings available for this track yet. Be the first to submit a task!
            </p>
        </div>
      ) : (
        <>
            {/* --- PODIUM SECTION (TOP 3) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                
                {/* RANK 2 (Silver) */}
                {topThree[1] && (
                    <div className="order-2 md:order-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-slate-400"></div>
                        <div className="mb-4 relative">
                             <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-slate-300 flex items-center justify-center text-2xl font-bold text-slate-600">
                                {topThree[1].user?.name?.charAt(0).toUpperCase()}
                             </div>
                             <div className="absolute -bottom-2 -right-2 bg-slate-300 text-slate-800 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-slate-900 shadow-sm">
                                2
                             </div>
                        </div>
                        <h3 className="font-bold text-lg text-center text-slate-900 dark:text-white line-clamp-1">
                            {topThree[1].user?.name}
                        </h3>
                        <p className="text-slate-500 text-sm mb-3">
                            {topThree[1].total_score} pts
                        </p>
                    </div>
                )}

                {/* RANK 1 (Gold) - Ditengah & Lebih Besar */}
                {topThree[0] && (
                    <div className="order-1 md:order-2 bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-900/10 dark:to-slate-900 border border-yellow-200 dark:border-yellow-900/50 rounded-2xl p-8 flex flex-col items-center shadow-lg relative overflow-hidden transform md:-translate-y-4">
                         <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300"></div>
                         <div className="mb-4 relative">
                             <Crown className="w-8 h-8 text-yellow-500 absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce" />
                             <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border-4 border-yellow-400 flex items-center justify-center text-3xl font-bold text-yellow-700 dark:text-yellow-400 shadow-md">
                                {topThree[0].user?.name?.charAt(0).toUpperCase()}
                             </div>
                             <div className="absolute -bottom-3 -right-0 bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white dark:border-slate-900 shadow-sm">
                                1
                             </div>
                        </div>
                        <h3 className="font-bold text-xl text-center text-slate-900 dark:text-white line-clamp-1">
                            {topThree[0].user?.name}
                        </h3>
                        <p className="text-yellow-600 dark:text-yellow-400 font-bold text-lg mb-3">
                            {topThree[0].total_score} Points
                        </p>
                    </div>
                )}

                {/* RANK 3 (Bronze) */}
                {topThree[2] && (
                    <div className="order-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-orange-400"></div>
                        <div className="mb-4 relative">
                             <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-900/20 border-4 border-orange-300 flex items-center justify-center text-2xl font-bold text-orange-700 dark:text-orange-400">
                                {topThree[2].user?.name?.charAt(0).toUpperCase()}
                             </div>
                             <div className="absolute -bottom-2 -right-2 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-slate-900 shadow-sm">
                                3
                             </div>
                        </div>
                        <h3 className="font-bold text-lg text-center text-slate-900 dark:text-white line-clamp-1">
                            {topThree[2].user?.name}
                        </h3>
                        <p className="text-slate-500 text-sm mb-3">
                            {topThree[2].total_score} pts
                        </p>
                    </div>
                )}
            </div>

            {/* --- LIST TABLE SECTION (Rank 4+) --- */}
            {restOfList.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Rest of the Leaderboard
                        </h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 w-20 text-center">Rank</th>
                                <th className="px-6 py-4">Member</th>
                                <th className="px-6 py-4 text-right">Total Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {restOfList.map((entry, index) => (
                                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 text-center font-mono font-bold text-slate-500">
                                        #{index + 4}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                                {entry.user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {entry.user?.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {entry.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-700 dark:text-slate-300">
                                        {entry.total_score} pts
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
      )}
    </div>
  );
}

// Default Export Halaman Utama
export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <MemberNavbar />
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
          <LeaderboardContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}