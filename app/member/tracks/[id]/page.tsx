"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { MemberNavbar } from "@/components/member-navbar";
import { VerificationModal } from "@/components/verification-modal";
import { DeadlineTimer } from "@/components/deadline-timer";
import { tracksAPI } from "@/lib/api/tracks";
import axiosInstance from "@/lib/api-client";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  Link as LinkIcon,
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle,
  Trophy,
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

  // --- LOGIC PERBAIKAN 1: Membaca Status ---
  const isActive = series.is_active !== false;

  // Sekarang kita baca field yang sudah di-mapping dari 'is_submitted' backend
  const isCompleted =
    series.status === "completed" || series.is_submitted === true;

  // Kita juga baca status verifikasi
  const isVerified = series.is_verified === true;

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

  // 1. UI: Completed (Jika user sudah submit, tampilkan kartu hijau)
  if (isCompleted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/10 border border-green-400 dark:border-green-800 rounded-2xl p-6 shadow-sm transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          COMPLETED
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-green-700 transition-colors">
                {series.series_name || series.name}
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {series.description || "Description not available."}
            </p>
          </div>

          <div className="w-full md:w-auto text-right">
            <div className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold text-sm bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-lg border border-green-200 dark:border-green-700">
              <CheckCircle className="w-4 h-4" />
              Task Submitted
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. UI: Series Ditutup Admin
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

  // 3. UI: Active / Pending
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
        {/* INFO SERIES */}
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

          {/* --- LOGIC PERBAIKAN 2: Tombol Verify --- */}
          {/* Hanya tampilkan tombol Verify jika belum expired DAN belum verified */}
          {!isExpired && !isVerified && (
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

          {/* Jika sudah verified tapi belum submit, beri tanda */}
          {isVerified && !isCompleted && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4" />
              Attendance Verified
            </div>
          )}
        </div>

        {/* SUBMISSION FORM */}
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
                  disabled={submitting || !isVerified} // Disable jika belum verifikasi
                  className={`w-full py-2 font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    !isVerified
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  }`}
                >
                  {submitting ? "Sending..." : "Submit Task"}
                </button>
                {/* Helper text jika belum verified */}
                {!isVerified && (
                  <p className="text-[10px] text-red-500 text-center">
                    Verify attendance first
                  </p>
                )}
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

      // --- LOGIC PERBAIKAN 3: Mapping Data dari Backend ---
      // Kita "paksa" status menjadi 'completed' jika 'is_submitted' dari backend bernilai true
      const formattedSeries = (rawData.series || []).map((s: any) => ({
        ...s,
        // Mapping boolean backend ke string status frontend
        status: s.is_submitted ? "completed" : "pending",
        is_verified: s.is_verified, // Simpan status verifikasi
      }));

      const formattedTrack = {
        ...rawData,
        name: rawData.name || rawData.track_name || "Unnamed Track",
        series: formattedSeries,
      };

      setTrack(formattedTrack);
    } catch (err: any) {
      console.error("Error detail track:", err);
      toast.error("Failed to load track details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWork = async (seriesId: number, fileUrl: string) => {
    // 1. Ganti loading biasa dengan loading yang punya ID agar bisa di-dismiss nanti
    const toastId = toast.loading("Submitting work...");

    try {
      await axiosInstance.post("/member/submissions", {
        series_id: seriesId,
        file_url: fileUrl,
      });

      // 2. Hapus loading toast sebelum memunculkan success custom toast
      toast.dismiss(toastId);

      // --- CUSTOM TOAST DESIGN (Ganti bagian toast.success lama dengan ini) ---
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white dark:bg-slate-900 shadow-xl rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-green-100 dark:border-green-900 overflow-hidden`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Excellent Job!
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Task submitted successfully. Keep pushing your limits!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-100 dark:border-slate-800">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
      // -----------------------------------------------------------------------

      // --- INSTANT UPDATE UI (Optimistic Update) ---
      setTrack((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          series: prev.series.map((s: any) =>
            s.id === seriesId
              ? { ...s, status: "completed", is_submitted: true }
              : s
          ),
        };
      });
    } catch (err: any) {
      console.error("Submission error:", err);

      // Jangan lupa dismiss loading jika error
      toast.dismiss(toastId);

      if (err.response?.status === 403) {
        const msg = err.response?.data?.message || "";
        if (msg.includes("verify")) {
          toast.error("⚠️ Please Verify Attendance First!");
        } else {
          toast.error(msg);
        }
        return;
      }

      if (err.response?.status === 409) {
        toast.error("Task already submitted");
        // Auto update UI jadi completed
        setTrack((prev: any) => ({
          ...prev,
          series: prev.series.map((s: any) =>
            s.id === seriesId
              ? { ...s, status: "completed", is_submitted: true }
              : s
          ),
        }));
        return;
      }

      const msg = err.response?.data?.message || "Failed to submit work.";
      toast.error(msg);
    }
  };

  const handleOpenVerifyModal = (seriesId: number, seriesName: string) => {
    setSelectedSeries({ id: seriesId, name: seriesName });
    setIsModalOpen(true);
  };

  const handleVerifySubmit = async (code: string) => {
    if (!selectedSeries) return;

    try {
      await axiosInstance.post(`/member/series/${selectedSeries.id}/verify`, {
        code: code,
      });
      toast.success("Attendance verified! You can now submit your work.");
      setIsModalOpen(false);

      // --- PERBAIKAN: Update UI setelah verify sukses ---
      setTrack((prev: any) => ({
        ...prev,
        series: prev.series.map((s: any) =>
          s.id === selectedSeries.id ? { ...s, is_verified: true } : s
        ),
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  // --- CALCULATION LOGIC FOR PROGRESS BAR ---
  const calculateProgress = () => {
    if (!track || !track.series || track.series.length === 0) return 0;
    // Hitung berdasarkan status 'completed' yang sudah kita mapping di atas
    const completedCount = track.series.filter(
      (s: any) => s.status === "completed"
    ).length;
    return Math.round((completedCount / track.series.length) * 100);
  };

  const progressPercentage = calculateProgress();

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
              {/* HEADER WITH PROGRESS BAR */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
                      <FileText className="w-3 h-3" />
                      Learning Track
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {track.name}
                    </h1>
                  </div>

                  {/* Progress Stats */}
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        My Progress
                      </p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                        {progressPercentage}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar Visual */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 mb-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-500">
                  {
                    track.series.filter((s: any) => s.status === "completed")
                      .length
                  }{" "}
                  of {track.series.length} series completed
                </p>
              </div>

              {/* SERIES LIST */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span>Modules & Series</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700">
                    {track.series?.length || 0}
                  </span>
                </h2>

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
                            name: s.series_name || s.name,
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
