"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Agar bisa auto-fill dari URL
import { ProtectedRoute } from "@/components/protected-route";
import { MemberNavbar } from "@/components/member-navbar";
import { DeadlineTimer } from "@/components/deadline-timer"; // Pastikan komponen ini sudah dibuat
import axiosInstance from "@/lib/api-client";
import toast from "react-hot-toast"; // Pakai Toast

export default function SubmitWorkPage() {
  const searchParams = useSearchParams();

  // State Input
  // Ambil ID dari URL jika ada (?seriesId=1)
  const [seriesId, setSeriesId] = useState(searchParams.get("seriesId") || "");
  const [url, setUrl] = useState("");

  // State Status
  const [loading, setLoading] = useState(false);
  const [seriesData, setSeriesData] = useState<any>(null); // Data series untuk cek deadline/status
  const [checkingSeries, setCheckingSeries] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // 1. AUTO-CHECK SERIES STATUS
  // Setiap kali Series ID berubah (dan valid), kita cek ke backend
  useEffect(() => {
    const checkSeriesStatus = async () => {
      const idNum = parseInt(seriesId);
      if (isNaN(idNum) || idNum <= 0) {
        setSeriesData(null);
        return;
      }

      setCheckingSeries(true);
      try {
        // Asumsi ada endpoint public/member untuk get detail series
        // Sesuaikan endpoint ini dengan backend Anda (misal: /member/series/:id atau /series/:id)
        const res = await axiosInstance.get(`/series/${idNum}`);
        const data = res.data?.data || res.data;
        setSeriesData(data);

        // Reset expired state berdasarkan data baru
        if (data.deadline && new Date(data.deadline) < new Date()) {
          setIsExpired(true);
        } else {
          setIsExpired(false);
        }
      } catch (error) {
        console.error("Series not found");
        setSeriesData(null);
      } finally {
        setCheckingSeries(false);
      }
    };

    // Debounce sedikit agar tidak spam request saat ngetik
    const timeoutId = setTimeout(() => {
      if (seriesId) checkSeriesStatus();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [seriesId]);

  // 2. HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Submitting your work...");

    try {
      const idNumber = parseInt(seriesId);
      if (isNaN(idNumber)) throw new Error("Invalid Series ID");

      // Validasi Frontend (Double Protection)
      if (seriesData) {
        if (!seriesData.is_active)
          throw new Error("This series is closed by Admin.");
        if (isExpired) throw new Error("Deadline has passed.");
      }

      await axiosInstance.post("/api/member/submissions", {
        series_id: idNumber,
        file_url: url,
      });

      toast.success("Work submitted successfully!", { id: toastId });

      // Reset form (kecuali ID biar ga bingung)
      setUrl("");
    } catch (err: any) {
      console.error("Submit Error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to submit work";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk disable tombol
  // Tombol disable jika: Loading, Lagi Cek Series, Series Tidak Aktif, atau Expired
  const isButtonDisabled =
    loading ||
    checkingSeries ||
    (seriesData && (!seriesData.is_active || isExpired));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <MemberNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Submit Your Work
            </h1>
            <p className="text-slate-500 mb-8">
              Paste your repository or file link below.
            </p>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* INPUT SERIES ID */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Series ID
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={seriesId}
                      onChange={(e) => setSeriesId(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="e.g. 1"
                    />
                    {checkingSeries && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* INFO BOX SERIES (MUNCUL OTOMATIS) */}
                  {seriesData && (
                    <div
                      className={`mt-3 p-4 rounded-xl border ${
                        !seriesData.is_active
                          ? "bg-red-50 border-red-200 text-red-700"
                          : isExpired
                          ? "bg-orange-50 border-orange-200 text-orange-700"
                          : "bg-blue-50 border-blue-200 text-blue-700"
                      }`}
                    >
                      <p className="font-bold text-sm">
                        {seriesData.series_name}
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-xs font-mono">
                        {/* INDIKATOR STATUS */}
                        {!seriesData.is_active ? (
                          <span className="font-bold">⛔ CLOSED BY ADMIN</span>
                        ) : (
                          // Deadline Timer Component
                          <DeadlineTimer
                            deadline={seriesData.deadline}
                            onExpire={() => setIsExpired(true)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* INPUT URL */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Work URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    disabled={isButtonDisabled && !loading} // Disable input juga kalau series closed
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="https://github.com/your-username/repo"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className={`w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    isButtonDisabled
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30"
                  }`}
                >
                  {loading
                    ? "Submitting..."
                    : !seriesData
                    ? "Enter Valid Series ID"
                    : !seriesData.is_active
                    ? "Submission Closed"
                    : isExpired
                    ? "Deadline Passed"
                    : "Submit Work"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
