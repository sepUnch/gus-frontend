"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { MemberNavbar } from "@/components/member-navbar";
import { tracksAPI } from "@/lib/api/tracks";
import axiosInstance from "@/lib/api-client";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  Link as LinkIcon,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

// --- SUB COMPONENT UNTUK SERIES ITEM ---
// Kita buat di sini agar logic input URL per-series terisolasi dan styling terkontrol
const SeriesItem = ({ series, onVerify, onSubmit }: { series: any, onVerify: () => void, onSubmit: (url: string) => void }) => {
    const [url, setUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitClick = async () => {
        if (!url) {
            alert("Please enter a file URL first.");
            return;
        }
        setSubmitting(true);
        await onSubmit(url);
        setSubmitting(false);
        setUrl(""); // Reset field after submit if needed
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            {/* Decorative Side Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>

            <div className="flex flex-col md:flex-row gap-6">
                
                {/* 1. INFO SERIES */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Series #{series.id}
                        </span>
                        {series.deadline && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600 border border-red-100">
                                <Calendar className="w-3 h-3" />
                                Due: {new Date(series.deadline).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                        {series.series_name || series.name || series.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                        {series.description || "No description provided for this series."}
                    </p>

                    {/* Action: Verify Attendance */}
                    <div className="mt-4">
                        <button 
                            onClick={onVerify}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Verify Attendance
                        </button>
                        <p className="text-[10px] text-slate-500 mt-1.5 ml-1">
                            *Required before submitting work.
                        </p>
                    </div>
                </div>

                {/* 2. SUBMISSION FORM */}
                <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4" />
                        Submit Your Work
                    </h4>
                    
                    <div className="space-y-3">
                        <div className="relative">
                            <input 
                                type="url" 
                                placeholder="https://github.com/..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>

                        <button
                            onClick={handleSubmitClick}
                            disabled={submitting}
                            className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? "Sending..." : "Submit Task"}
                            {!submitting && <ArrowRightIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icon Helper
const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
);


export default function TrackDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchTrackDetail();
  }, [id]);

  const fetchTrackDetail = async () => {
    try {
      setLoading(true);
      const response = await tracksAPI.getDetail(id as string);
      const rawData = response.data?.data || response.data || {};
      
      const formattedTrack = {
        ...rawData,
        name: rawData.name || rawData.track_name || "Unnamed Track",
        series: rawData.series || rawData.Series || []
      };

      setTrack(formattedTrack);
    } catch (err: any) {
      console.error("Error detail track:", err);
      setError("Failed to load track details.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC: SUBMIT ---
  const handleSubmitWork = async (seriesId: number, fileUrl: string) => {
    try {
      await axiosInstance.post("/member/submissions", { 
        series_id: seriesId, 
        file_url: fileUrl   
      });
      alert("✅ Submission successful! Your work has been recorded.");
    } catch (err: any) {
      console.error("Submission error:", err);
      if (err.response?.status === 403) {
        alert("⚠️ ATTENDANCE REQUIRED!\n\nPlease click the 'Verify Attendance' button and enter the code provided by the admin.");
        return;
      }
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to submit work.";
      alert(`❌ ${msg}`);
    }
  };

  // --- LOGIC: VERIFY ---
  const handleVerifyAttendance = async (seriesId: number) => {
    const code = prompt("Please enter the Verification Code (Token) for this series:");
    if (!code) return;

    try {
      await axiosInstance.post(`/member/series/${seriesId}/verify`, {
        code: code
      });
      alert("✅ Attendance verified successfully! You can now submit your work.");
    } catch (err: any) {
      console.error("Verification error:", err);
      const msg = err.response?.data?.message || err.response?.data?.error || "Invalid token or verification failed.";
      alert(`❌ ${msg}`);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <MemberNavbar />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
          
          {/* BACK BUTTON */}
          <button 
            onClick={() => router.back()}
            className="group flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Tracks
          </button>

          {loading ? (
             // SKELETON LOADING
             <div className="space-y-6">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 animate-pulse"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse"></div>
                <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse mt-8"></div>
             </div>
          ) : !track ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Track Not Found</h2>
                <p className="text-slate-500">The track you are looking for does not exist.</p>
            </div>
          ) : (
            <>
              {/* HERO HEADER */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                   <FileText className="w-3 h-3" />
                   Learning Track
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                  {track.name}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                  {track.description || "Master the concepts in this track by completing the series below."}
                </p>
              </div>

              {/* ERROR ALERT */}
              {error && (
                <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-200 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
              )}

              {/* SERIES LIST */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Modules & Series
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700">
                        {track.series?.length || 0}
                    </span>
                </div>
                
                {track.series && track.series.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                       <p className="text-slate-500 italic">No series available in this track yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {Array.isArray(track.series) && track.series.map((s: any) => (
                            <SeriesItem 
                                key={s.id} 
                                series={{
                                    ...s,
                                    name: s.series_name || s.name || s.title // Fallback naming
                                }} 
                                onSubmit={(fileUrl) => handleSubmitWork(s.id, fileUrl)}
                                onVerify={() => handleVerifyAttendance(s.id)}
                            />
                        ))}
                    </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}