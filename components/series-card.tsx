"use client"

import { useState } from "react"

interface SeriesCardProps {
  series: any
  // Update tipe onSubmit agar menerima URL dan mengembalikan Promise (untuk loading)
  onSubmit: (fileUrl: string) => Promise<void>
  onVerify: () => Promise<void>
}

export const SeriesCard = ({ series, onSubmit, onVerify }: SeriesCardProps) => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [submissionUrl, setSubmissionUrl] = useState("")
  const [loading, setLoading] = useState(false)

  // Handler untuk tombol Submit (Simpan)
  const handleSubmit = async () => {
    if (!submissionUrl.trim()) return alert("Please enter a URL")
    
    try {
      setLoading(true)
      await onSubmit(submissionUrl) // Kirim URL ke parent
      setIsSubmitOpen(false) // Tutup form setelah sukses
      setSubmissionUrl("") // Reset input
    } catch (error) {
      console.error(error)
      // Error handling bisa ditambahkan di sini
    } finally {
      setLoading(false)
    }
  }

  // Handler untuk tombol Verify
  const handleVerify = async () => {
    try {
      setLoading(true)
      await onVerify()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col h-full">
      <div className="flex-1">
        <h4 className="text-lg font-bold text-foreground mb-2">{series.name || series.series_name}</h4>
        <p className="text-muted-foreground text-sm mb-4">{series.description}</p>
        
        {/* Tampilkan Deadline jika ada */}
        {series.deadline && (
           <p className="text-xs text-red-500 mb-4">
             Deadline: {new Date(series.deadline).toLocaleDateString()}
           </p>
        )}
      </div>

      <div className="mt-4">
        {/* LOGIKA TAMPILAN: Jika mode input aktif, tampilkan form. Jika tidak, tampilkan tombol biasa */}
        {isSubmitOpen ? (
          <div className="space-y-3">
            <input
              type="url"
              placeholder="https://github.com/..."
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Confirm"}
              </button>
              <button
                onClick={() => setIsSubmitOpen(false)}
                disabled={loading}
                className="px-3 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Submit Work
            </button>
            <button
              onClick={handleVerify}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Attendance"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}