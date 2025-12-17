"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import axiosInstance from "@/lib/api-client";
import toast from "react-hot-toast";
import {
  Search,
  Trash2,
  Shield,
  User,
  Mail,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function AdminUsersPage() {
  // --- STATE ---
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Role Change Modal State
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState("member");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/users");
      const data = response.data?.data || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS: DELETE ---
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    const toastId = toast.loading("Deleting user...");

    try {
      await axiosInstance.delete(`/admin/users/${userToDelete}`);
      toast.success("User deleted successfully", { id: toastId });

      // Update UI tanpa reload
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
      setShowDeleteModal(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete user";
      toast.error(msg, { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  // --- ACTIONS: UPDATE ROLE ---
  const openRoleModal = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role); // Set current role
    setShowRoleModal(true);
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser) return;
    setIsUpdatingRole(true);
    const toastId = toast.loading("Updating role...");

    try {
      await axiosInstance.patch(`/admin/users/${selectedUser.id}/role`, {
        role: newRole,
      });

      toast.success(`User role updated to ${newRole}`, { id: toastId });

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        )
      );

      setShowRoleModal(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update role";
      toast.error(msg, { id: toastId });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // --- HELPER: SEARCH FILTER ---
  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    const query = searchQuery.toLowerCase();
    return (
      name.toLowerCase().includes(query) || email.toLowerCase().includes(query)
    );
  });

  // --- HELPER: AVATAR RENDERER (FIXED URL) ---
  const renderUserAvatar = (user: any) => {
    const name = user?.name || "User";
    const avatarPath = user?.avatar;

    let avatarUrl = null;

    if (avatarPath && avatarPath.trim() !== "") {
      if (avatarPath.startsWith("http")) {
        // Jika URL absolut (misal Google Auth), pakai langsung
        avatarUrl = avatarPath;
      } else {
        // [PERBAIKAN UTAMA]
        // Kita paksa base URL ke root backend (http://localhost:8080)
        // Tanpa embel-embel "/api"
        const backendRoot = "http://localhost:8080";

        // Bersihkan path (hapus slash di depan jika ada, agar tidak double slash)
        const cleanPath = avatarPath.startsWith("/")
          ? avatarPath.slice(1)
          : avatarPath;

        avatarUrl = `${backendRoot}/${cleanPath}`;
      }
    }

    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            // Jika gagal load, sembunyikan gambar agar inisial terlihat
            e.currentTarget.style.display = "none";
            // Tambahkan class ke parent untuk memunculkan fallback
            e.currentTarget.parentElement?.classList.add("fallback-active");
          }}
        />
      );
    }

    return null;
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-background relative">
        <AdminSidebar />

        <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden pt-15">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-7xl">
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                Manage Users
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                View all registered users, manage roles, and permissions.
              </p>
            </div>

            {/* SEARCH BAR */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              />
            </div>

            {/* USERS TABLE LIST */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center p-12 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading
                  users...
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          User Profile
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Current Role
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Joined Date
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {/* AVATAR CONTAINER */}
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0 relative overflow-hidden group">
                                {/* Tampilkan Avatar Image */}
                                {renderUserAvatar(user)}

                                {/* Fallback Initials (Ditampilkan jika img null/error) */}
                                <span
                                  className={`absolute inset-0 flex items-center justify-center ${
                                    user.avatar
                                      ? "group-[.fallback-active]:flex hidden"
                                      : "flex"
                                  }`}
                                >
                                  {user.name
                                    ? user.name.substring(0, 2).toUpperCase()
                                    : "U"}
                                </span>
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white truncate">
                                  {user.name}
                                </p>
                                <div className="flex items-center text-xs text-slate-500 truncate">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {user.role === "admin" ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                                <Shield className="w-3 h-3 mr-1" /> Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                                <User className="w-3 h-3 mr-1" /> Member
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openRoleModal(user)}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Change Role"
                              >
                                <Shield className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setUserToDelete(user.id);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    No Users Found
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Try adjusting your search query.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* --- MODAL 1: DELETE CONFIRMATION --- */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-xl p-6 text-center scale-100 animate-in zoom-in-95">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-600 dark:text-red-500 w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Delete User?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL 2: CHANGE ROLE --- */}
        {showRoleModal && selectedUser && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-xl p-6 scale-100 animate-in zoom-in-95">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Change Role
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Update access level for{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {selectedUser.name}
                </span>
              </p>

              <div className="space-y-3 mb-6">
                {/* Option: Admin */}
                <label
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    newRole === "admin"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={newRole === "admin"}
                    onChange={() => setNewRole("admin")}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" /> Admin
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Full access to dashboard & settings
                    </span>
                  </div>
                </label>

                {/* Option: Member */}
                <label
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    newRole === "member"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="member"
                    checked={newRole === "member"}
                    onChange={() => setNewRole("member")}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" /> Member
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Standard access (User view)
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  disabled={isUpdatingRole}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoleUpdate}
                  disabled={isUpdatingRole}
                  className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isUpdatingRole ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
