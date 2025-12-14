"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { MemberNavbar } from "@/components/member-navbar"
// Gunakan axiosInstance yang sudah kita perbaiki sebelumnya
// Pastikan nama file sesuai: api-client atau axios
import axiosInstance from "@/lib/api-client" 

export default function VerifyAttendancePage() {
  const [seriesId, setSeriesId] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // 1. Validasi ID harus angka
      const idNumber = parseInt(seriesId)
      if (isNaN(idNumber)) {
        throw new Error("Series ID harus berupa angka")
      }

      // 2. Kirim Request ke Endpoint yang BENAR
      // URL Backend: /api/member/series/:id/verify
      // Body JSON: { "code": "..." }
      
      await axiosInstance.post(`/member/series/${idNumber}/verify`, {
        code: code
      })

      setSuccess("Attendance verified successfully!")
      setSeriesId("")
      setCode("")
    } catch (err: any) {
      console.error("Verification Error:", err)
      const msg = err.response?.data?.message || err.message || "Verification failed"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <MemberNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Verify Attendance</h1>

            <div className="bg-card border border-border rounded-lg p-8">
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Series ID</label>
                  <input
                    type="number" // Ubah jadi number agar input angka lebih mudah
                    value={seriesId}
                    onChange={(e) => setSeriesId(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter series ID (e.g. 1)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                    maxLength={10} // Backend varchar(10), jadi aman diset 10
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                    placeholder="TOKEN123"
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    Masukkan kode token yang diberikan oleh mentor/admin.
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify Attendance"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}