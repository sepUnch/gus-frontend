"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { MemberNavbar } from "@/components/member-navbar";
import { VerificationModal } from "@/components/verification-modal"; // Pastikan path ini benar
import { DeadlineTimer } from "@/components/deadline-timer"; // Pastikan path ini benar
import { tracksAPI } from "@/lib/api/tracks";
import axiosInstance from "@/lib/api-client";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  Link as LinkIcon,
  ShieldCheck,
  AlertCircle,
  Lock,
  Clock,
} from "lucide-react";

// --- COMPONENT: SERIES ITEM ---
const SeriesItem = ({
  series,
  onVerify,
  onSubmit,
}: {
  series: any;
  onVerify: () => void;
  onSubmit: (url: string) => void;
}) => {
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Cek status aktif (Default true jika backend belum kirim field ini)
  const isActive = series.is_active !== false;

  const handleSubmitClick = async () => {
    if (!url) {
      toast.error("Please enter a file URL first.");
      return;
    }
    setSubmitting(true);
    await onSubmit(url);
    setSubmitting(false);
    setUrl("");
  };

  // UI jika Series Ditutup Admin
  if (!isActive) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 opacity-75 relative overflow-hidden">
        <div className="flex items-center gap-3 text-red-600 mb-2">
          <Lock className="w-5 h-5" />
          <span className="font-bold uppercase tracking-wider text-xs">
            Closed by Admin
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
          {series.series_name || series.name}
        </h3>
        <p className="text-sm text-slate-500">
          Submissions are no longer accepted for this series.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      {/* Indikator Samping */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isExpired
            ? "bg-slate-400"
            : "bg-gradient-to-b from-blue-500 to-indigo-600"
        }`}
      ></div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 1. INFO SERIES */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Series #{series.order_index || series.id}
            </span>

            {/* TIMER COMPONENT */}
            {series.deadline && (
              <DeadlineTimer
                deadline={series.deadline}
                onExpire={() => setIsExpired(true)}
              />
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
            {series.series_name || series.name}
          </h3>

          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            {series.description || "No description provided."}
          </p>

          {/* Action: Verify Attendance */}
          {/* Hanya tampil jika belum expired */}
          {!isExpired && (
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
          )}
        </div>

        {/* 2. SUBMISSION FORM */}
        <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center">
          {isExpired ? (
            <div className="text-center text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="font-bold text-sm">Deadline Passed</p>
              <p className="text-xs">You can no longer submit work.</p>
            </div>
          ) : (
            <>
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
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function TrackDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // STATE UNTUK MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<{
    id: number;
    name: string;
  } | null>(null);

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
        series: rawData.series || rawData.Series || [],
      };

      setTrack(formattedTrack);
    } catch (err: any) {
      console.error("Error detail track:", err);
      setError("Failed to load track details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWork = async (seriesId: number, fileUrl: string) => {
    const toastId = toast.loading("Submitting work...");

    try {
      await axiosInstance.post("/member/submissions", {
        series_id: seriesId,
        file_url: fileUrl,
      });
      toast.success("Submission successful!", { id: toastId });
    } catch (err: any) {
      console.error("Submission error:", err);

      // 1. Handle Belum Absen (403)
      if (err.response?.status === 403) {
        const msg = err.response?.data?.message || "";
        if (msg.includes("verify")) {
          toast.error("⚠️ Please Verify Attendance First!", { id: toastId });
        } else if (msg.includes("Deadline")) {
          toast.error("⏰ Deadline has passed!", { id: toastId });
        } else {
          toast.error("🚫 Submission Closed.", { id: toastId });
        }
        return;
      }

      // 2. Handle Duplikat (409 Conflict) - UBAH JADI MERAH DI SINI
      if (err.response?.status === 409) {
        toast.error("You have already submitted this task!", { id: toastId });

        return;
      }

      // Error Umum Lainnya
      const msg = err.response?.data?.message || "Failed to submit work.";
      toast.error(msg, { id: toastId });
    }
  };

  // --- LOGIC: OPEN MODAL ---
  const handleOpenVerifyModal = (seriesId: number, seriesName: string) => {
    setSelectedSeries({ id: seriesId, name: seriesName });
    setIsModalOpen(true);
  };

  // --- LOGIC: PROCESS VERIFY (Dipanggil oleh Modal) ---
  const handleVerifySubmit = async (code: string) => {
    if (!selectedSeries) return;

    // Axios call akan di-handle di sini, tapi error handling spesifik bisa di dalam modal atau di sini.
    // Di sini saya biarkan Modal menangani UI loading, tapi kita panggil API-nya.
    await axiosInstance.post(`/member/series/${selectedSeries.id}/verify`, {
      code: code,
    });

    toast.success("Attendance verified! You can now submit your work.");
    setIsModalOpen(false);
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
            <div className="space-y-6">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse"></div>
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse mt-8"></div>
            </div>
          ) : !track ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Track Not Found
              </h2>
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
                  {track.description ||
                    "Master the concepts in this track by completing the series below."}
                </p>
              </div>

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
                    <p className="text-slate-500 italic">
                      No series available in this track yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {Array.isArray(track.series) &&
                      track.series.map((s: any) => (
                        <SeriesItem
                          key={s.id}
                          series={{
                            ...s,
                            name: s.series_name || s.name, // Normalize name
                          }}
                          onSubmit={(fileUrl) =>
                            handleSubmitWork(s.id, fileUrl)
                          }
                          onVerify={() =>
                            handleOpenVerifyModal(s.id, s.series_name || s.name)
                          }
                        />
                      ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* CUSTOM VERIFICATION MODAL */}
          <VerificationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onVerify={handleVerifySubmit}
            seriesName={selectedSeries?.name || "Series"}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}
