"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminSidebar } from "@/components/admin-sidebar"
import { adminAPI } from "@/lib/api/admin"

export default function CreateTrackPage() {
  const router = useRouter()
  const [trackName, setTrackName] = useState("")
  const [trackDescription, setTrackDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // State untuk Mobile Sidebar
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleCreateTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await adminAPI.createTrack({
        track_name: trackName, 
        description: trackDescription,
      })
      alert("✅ Track created successfully!")
      router.push("/admin/tracks")
    } catch (err: any) {
      console.error("Create Track Error:", err)
      setError(err.response?.data?.message || "Failed to create track")
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        
        {/* =========================================
            1. DESKTOP SIDEBAR (Hidden on Mobile) 
           ========================================= */}
        <div className="hidden md:block fixed top-0 left-0 bottom-0 w-64 z-30 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <AdminSidebar />
        </div>

        {/* =========================================
            2. MOBILE HEADER & NAVIGATION 
           ========================================= */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 flex items-center px-4 justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="font-bold text-lg text-slate-800 dark:text-white">Create Track</span>
            </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
                <div className="relative w-64 bg-white dark:bg-slate-900 h-full shadow-2xl animate-in slide-in-from-left duration-200">
                    <button 
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="h-full overflow-y-auto">
                        <AdminSidebar />
                    </div>
                </div>
            </div>
        )}

        {/* =========================================
            3. MAIN CONTENT AREA 
           ========================================= */}
        <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-w-0">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8">
            
            {/* Back Button */}
            <div className="mb-6">
                <button 
                  onClick={() => router.back()}
                  className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Tracks
                </button>
            </div>

            <div className="max-w-2xl mx-auto md:mx-0">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Create New Track
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    Add a new learning path for your members.
                  </p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
                  <form onSubmit={handleCreateTrack} className="space-y-6">
                    
                    {/* Input Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Track Name
                      </label>
                      <input
                        type="text"
                        value={trackName}
                        onChange={(e) => setTrackName(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        placeholder="e.g., Web Development"
                      />
                    </div>

                    {/* Input Description */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Description
                      </label>
                      <textarea
                        value={trackDescription}
                        onChange={(e) => setTrackDescription(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                        placeholder="Explain what users will learn in this track..."
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-start gap-2">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Creating...</span>
                            </div>
                          ) : (
                            "Create Track"
                          )}
                        </button>
                    </div>
                  </form>
                </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}