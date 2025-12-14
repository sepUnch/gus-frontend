"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";

export default function AdminGradeSubmissionPage() {
  const { id } = useParams();
  const router = useRouter();

  // Data States
  const [submission, setSubmission] = useState<any>(null);
  
  // Form States
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("pending");
  
  // UI States
  const [loading, setLoading] = useState(false); // For saving
  const [fetching, setFetching] = useState(true); // For initial load
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchSubmissionDetail();
  }, [id]);

  const fetchSubmissionDetail = async () => {
    try {
      setFetching(true);
      const response = await axiosInstance.get(`/admin/submissions/${id}`);
      const data = response.data?.data || response.data;

      setSubmission(data);

      if (data) {
        setScore(data.score ? String(data.score) : "");
        setFeedback(data.feedback || "");
        // Jika ada status di database, pakai itu. Jika tidak, default pending.
        setStatus(data.status || "pending");
      }
    } catch (err) {
      console.error("Error fetching submission:", err);
      setError("Failed to load submission details");
    } finally {
      setFetching(false);
    }
  };

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic Validation
    const numericScore = parseInt(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
        setError("Please enter a valid score between 0 and 100.");
        setLoading(false);
        return;
    }

    try {
      await axiosInstance.post("/admin/submissions/grade", {
        submission_id: parseInt(id as string),
        score: numericScore,
        feedback,
        status,
      });

      // Redirect back
      router.push("/admin/submissions");
    } catch (err: any) {
      console.error("Grading error:", err);
      setError("Failed to save grade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for Initials
  const getInitials = (name: string) => {
      return name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "??";
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-6xl">
            
            {/* BACK BUTTON */}
            <div className="mb-6">
                <button 
                onClick={() => router.back()}
                className="group flex items-center text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Submissions
                </button>
            </div>

            {fetching ? (
                 <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-slate-500">Loading submission details...</p>
                 </div>
            ) : submission ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* LEFT COLUMN: SUBMISSION DETAILS */}
                    <div className="space-y-6">
                        <div>
                             <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                                Grade Submission
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Review the student's work and provide feedback.
                            </p>
                        </div>

                        {/* STUDENT INFO CARD */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Student Information</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                    {getInitials(submission.user?.name)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{submission.user?.name}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{submission.user?.email}</p>
                                    <p className="text-xs text-slate-400 mt-1">ID: {submission.user?.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* SERIES INFO CARD */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Submission Context</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Series Name</label>
                                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                                        {submission.series?.series_name || "Unknown Series"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Submitted File</label>
                                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                                {submission.file_url}
                                            </p>
                                        </div>
                                        <a 
                                            href={submission.file_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                                        >
                                            Open
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: GRADING FORM */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden h-fit">
                         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
                         
                         <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Assessment Form</h2>

                         <form onSubmit={handleGrade} className="space-y-6">
                            
                            {/* Score Input */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Score (0-100)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={score}
                                        min="0"
                                        max="100"
                                        onChange={(e) => setScore(e.target.value)}
                                        required
                                        placeholder="0"
                                        className="w-full pl-5 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-mono font-medium"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <span className="text-slate-400 font-semibold">/100</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Select */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Status
                                </label>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-5 py-3 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all capitalize"
                                    >
                                        <option value="pending">⏳ Pending</option>
                                        <option value="approved">✅ Approved</option>
                                        <option value="rejected">❌ Rejected</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Textarea */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Feedback / Comments
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={5}
                                    placeholder="Write your feedback for the student here..."
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="w-full sm:w-1/2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Grade"
                                    )}
                                </button>
                            </div>

                         </form>
                    </div>

                </div>
            ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-center">
                    <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">Submission Not Found</h3>
                    <p className="text-yellow-600 dark:text-yellow-400">The submission you are trying to grade does not exist or has been removed.</p>
                </div>
            )}

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}