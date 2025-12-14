"use client"

import type React from "react"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { MemberNavbar } from "@/components/member-navbar"
// Gunakan axiosInstance langsung agar kita bisa kontrol URL dan Payload-nya
import axiosInstance  from "@/lib/api-client"

export default function SubmitWorkPage() {
  const [seriesId, setSeriesId] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // 1. Konversi Series ID ke Angka (Integer)
      const idNumber = parseInt(seriesId)
      if (isNaN(idNumber)) {
        throw new Error("Series ID harus berupa angka valid")
      }

      // 2. Request ke Endpoint yang BENAR (/api/member/submissions)
      // 3. Gunakan nama field yang BENAR (snake_case sesuai struct Go)
      await axiosInstance.post("/api/member/submissions", {
        series_id: idNumber, // Backend minta 'series_id' (uint)
        file_url: url        // Backend minta 'file_url' (string)
      })

      setSuccess("Work submitted successfully!")
      setSeriesId("")
      setUrl("")
    } catch (err: any) {
      console.error("Submit Error:", err)
      // Menangkap pesan error dari backend
      const msg = err.response?.data?.message || err.message || "Failed to submit work"
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
            <h1 className="text-4xl font-bold text-foreground mb-8">Submit Your Work</h1>

            <div className="bg-card border border-border rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Series ID</label>
                  <input
                    type="number" // Ubah tipe jadi number agar keyboard HP angka
                    value={seriesId}
                    onChange={(e) => setSeriesId(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter series ID (e.g. 1)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Masukkan ID Series (angka) yang ingin Anda submit.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Work URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://github.com/your-username/repo"
                  />
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
                  {loading ? "Submitting..." : "Submit Work"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}