"use client";

import type React from "react";
import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { MemberNavbar } from "@/components/member-navbar";
import axiosInstance from "@/lib/api-client";
import toast from "react-hot-toast"; // 1. Import Toast

export default function VerifyAttendancePage() {
  const [seriesId, setSeriesId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // State 'error' dan 'success' dihapus karena diganti Toast

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 2. Tampilkan Toast Loading
    const toastId = toast.loading("Verifying code...");

    try {
      // Validasi Input
      const idNumber = parseInt(seriesId);
      if (isNaN(idNumber)) {
        throw new Error("Series ID must be a valid number");
      }

      // Request ke Backend
      await axiosInstance.post(`/member/series/${idNumber}/verify`, {
        code: code,
      });

      // 3. Toast Sukses
      toast.success("Attendance verified successfully!", { id: toastId });

      // Reset Form
      setSeriesId("");
      setCode("");
    } catch (err: any) {
      console.error("Verification Error:", err);
      const msg =
        err.response?.data?.message || err.message || "Verification failed";

      // 4. Toast Error
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <MemberNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Verify Attendance
            </h1>
            <p className="text-slate-500 mb-8">
              Enter the Series ID and the unique token provided by your mentor.
            </p>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <form onSubmit={handleVerify} className="space-y-6">
                {/* Input Series ID */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Series ID
                  </label>
                  <input
                    type="number"
                    value={seriesId}
                    onChange={(e) => setSeriesId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. 1"
                  />
                </div>

                {/* Input Token Code */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                    maxLength={10}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono uppercase transition-all"
                    placeholder="TOKEN123"
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Make sure the code matches the one displayed on the
                    screen/slide.
                  </p>
                </div>

                {/* Tombol Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Verify Attendance"
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
