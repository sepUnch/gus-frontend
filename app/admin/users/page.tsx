"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import { adminAPI } from "@/lib/api/admin";
import { User, Shield, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast"; // 1. Import Toast

export default function AdminUsersPage() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);

  // State error & success dihapus -> diganti Toast

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 2. Toast Loading
    const toastId = toast.loading("Updating user role...");

    try {
      await adminAPI.updateUserRole(userId, role);

      // 3. Toast Sukses
      toast.success(`User ID ${userId} is now a ${role}!`, { id: toastId });

      // Reset form
      setUserId("");
      setRole("member");
    } catch (err: any) {
      console.error("Update role error:", err);
      const msg = err.response?.data?.message || "Failed to update user role";

      // 4. Toast Error
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-7xl">
            {/* HEADER SECTION */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                Manage Users
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                Update user roles, permissions, and account status.
              </p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden max-w-3xl">
              {/* Decorative Top Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Update Role
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Change a user's access level (Member/Admin).
                </p>
              </div>

              <form onSubmit={handleUpdateRole} className="space-y-6">
                {/* INPUT: USER ID */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    User ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                      placeholder="e.g. 123"
                      className="w-full pl-12 pr-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* INPUT: ROLE SELECT */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Assign Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 ml-1 flex items-center gap-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Note:
                    </span>
                    Admin has full access to dashboard. Member has standard
                    access.
                  </p>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
