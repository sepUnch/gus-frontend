"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { MemberNavbar } from "@/components/member-navbar";
import { LeaderboardTable, LeaderboardItem } from "@/components/leaderboard-table"; 
import axiosInstance from "@/lib/api-client";
import { 
  Trophy, 
  Crown, 
  BarChart3, 
  ChevronDown 
} from "lucide-react";

// --- KOMPONEN HELPER UNTUK AVATAR PODIUM ---
const PodiumAvatar = ({ url, name, sizeClass }: { url: string, name: string, sizeClass: string }) => {
  if (url) {
    const fullUrl = url.startsWith("http") ? url : `http://localhost:8080/${url}`;
    return <img src={fullUrl} alt={name} className={`w-full h-full object-cover ${sizeClass}`} />;
  }
  return (
    <div className={`w-full h-full flex items-center justify-center font-bold text-slate-500 ${sizeClass.includes('w-24') ? 'text-3xl' : 'text-xl'}`}>
      {name?.charAt(0).toUpperCase()}
    </div>
  );
};

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State Data
  const [tracks, setTracks] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  
  // State UI
  const [selectedTrackId, setSelectedTrackId] = useState(searchParams.get("trackId") || "");
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [error, setError] = useState("");

  // 1. Fetch List Tracks
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await axiosInstance.get("/tracks");
        // Backend Go biasanya mengirim data dalam field "track_name" atau "name"
        // Frontend sebelumnya memakai "title" yang salah.
        const data = res.data?.data || [];
        setTracks(data);
        
        // Auto select track pertama jika belum ada yang dipilih
        if (!selectedTrackId && data.length > 0) {
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

  // 2. Fetch Leaderboard
  useEffect(() => {
    if (!selectedTrackId) return;

    const fetchLeaderboard = async () => {
      try {
        setLoadingBoard(true);
        setError("");
        
        // Update URL
        router.replace(`/member/leaderboard?trackId=${selectedTrackId}`, { scroll: false });

        const res = await axiosInstance.get(`/leaderboard/track/${selectedTrackId}`);
        setLeaderboard(res.data.data || []);
      } catch (err: any) {
        console.error("Leaderboard error:", err);
        // Jangan set error full screen jika hanya data kosong, cukup kosongkan array
        setLeaderboard([]);
      } finally {
        setLoadingBoard(false);
      }
    };

    fetchLeaderboard();
  }, [selectedTrackId]);

  // --- PERBAIKAN 1: Gunakan track_name atau name ---
  const currentTrack = tracks.find(t => String(t.id) === String(selectedTrackId));
  const currentTrackName = currentTrack?.track_name || currentTrack?.name || "Unknown Track";

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
             See who's topping the charts in the <b>{currentTrackName}</b> track.
          </p>
        </div>

        {/* TRACK SELECTOR */}
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
                        // --- PERBAIKAN 2: Mapping menggunakan track_name ---
                        tracks.map(track => (
                            <option key={track.id} value={track.id}>
                                {track.track_name || track.name || `Track ${track.id}`}
                            </option>
                        ))
                    )}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
             </div>
        </div>
      </div>

      {loadingBoard ? (
        <div className="space-y-6">
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Data Yet</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                No rankings available for this track yet.
            </p>
        </div>
      ) : (
        <>
            {/* --- PODIUM SECTION (TOP 3) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                {/* RANK 2, 1, 3 CODE TETAP SAMA SEPERTI SEBELUMNYA ... */}
                {/* Kode Podium tidak berubah dari versi sebelumnya yang sudah benar */}
                
                {/* RANK 2 (Silver) */}
                {topThree[1] && (
                    <div className="order-2 md:order-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-slate-400"></div>
                        <div className="mb-4 relative">
                             <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-slate-300 flex items-center justify-center overflow-hidden">
                                <PodiumAvatar url={topThree[1].avatar} name={topThree[1].name} sizeClass="" />
                             </div>
                             <div className="absolute -bottom-2 -right-2 bg-slate-300 text-slate-800 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-slate-900 shadow-sm">2</div>
                        </div>
                        <h3 className="font-bold text-lg text-center text-slate-900 dark:text-white line-clamp-1">{topThree[1].name}</h3>
                        <p className="text-slate-500 text-sm mb-3">{topThree[1].total_score} pts</p>
                    </div>
                )}

                {/* RANK 1 (Gold) */}
                {topThree[0] && (
                    <div className="order-1 md:order-2 bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-900/10 dark:to-slate-900 border border-yellow-200 dark:border-yellow-900/50 rounded-2xl p-8 flex flex-col items-center shadow-lg relative overflow-hidden transform md:-translate-y-4">
                         <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300"></div>
                         <div className="mb-4 relative">
                             <Crown className="w-8 h-8 text-yellow-500 absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce" />
                             <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border-4 border-yellow-400 flex items-center justify-center overflow-hidden shadow-md">
                                <PodiumAvatar url={topThree[0].avatar} name={topThree[0].name} sizeClass="w-24 h-24" />
                             </div>
                             <div className="absolute -bottom-3 -right-0 bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white dark:border-slate-900 shadow-sm">1</div>
                        </div>
                        <h3 className="font-bold text-xl text-center text-slate-900 dark:text-white line-clamp-1">{topThree[0].name}</h3>
                        <p className="text-yellow-600 dark:text-yellow-400 font-bold text-lg mb-3">{topThree[0].total_score} Points</p>
                    </div>
                )}

                {/* RANK 3 (Bronze) */}
                {topThree[2] && (
                    <div className="order-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-orange-400"></div>
                        <div className="mb-4 relative">
                             <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-900/20 border-4 border-orange-300 flex items-center justify-center overflow-hidden">
                                <PodiumAvatar url={topThree[2].avatar} name={topThree[2].name} sizeClass="" />
                             </div>
                             <div className="absolute -bottom-2 -right-2 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-slate-900 shadow-sm">3</div>
                        </div>
                        <h3 className="font-bold text-lg text-center text-slate-900 dark:text-white line-clamp-1">{topThree[2].name}</h3>
                        <p className="text-slate-500 text-sm mb-3">{topThree[2].total_score} pts</p>
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
                    <LeaderboardTable data={restOfList} />
                </div>
            )}
        </>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <MemberNavbar />
        <Suspense fallback={<div>Loading...</div>}>
          <LeaderboardContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}