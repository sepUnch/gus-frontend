"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { MemberNavbar } from "@/components/member-navbar";
import axiosInstance from "@/lib/api-client";
import {
  User,
  Mail,
  Save,
  Loader2,
  Settings,
  CheckCircle,
  AlertCircle,
  Camera, // Tambah icon Camera
} from "lucide-react";
import Image from "next/image"; // Import Image dari Next.js

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // 1. STATE UNTUK GAMBAR
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ISI FORM DENGAN DATA USER SAAT INI
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // 2. FUNGSI HANDLE GANTI FOTO
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Buat URL sementara agar user bisa lihat preview gambar yg dipilih
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 3. FUNGSI UPDATE KE BACKEND (PAKAI FORMDATA)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      
      if (avatarFile) {
        formData.append("avatar", avatarFile); 
      }

      // --- PERBAIKAN: HAPUS CONFIG HEADER MANUAL ---
      // Biarkan Axios yang mengatur Content-Type otomatis saat mendeteksi FormData
      const response = await axiosInstance.put("/member/me", formData);

      // 2. Cek apakah backend mengirim token baru? (Fitur Smart Update)
      // Jika response backend menyertakan token baru, kita pakai itu.
      if (response.data?.data?.token) {
         // Gunakan fungsi login dari context untuk update token tanpa refresh
         // Pastikan kamu import { useAuth } dan destructure { login } di atas
         const { token, user } = response.data.data;
         // Kita asumsikan fungsi login kamu sudah diupdate untuk menerima (token, user)
         // Jika belum, update token manual di localStorage:
         localStorage.setItem("token", token);
         axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
         if (checkAuth) await checkAuth(); 
      } else {
         // Jika tidak ada token baru, refresh data user biasa
         if (checkAuth) await checkAuth();
      }

    } catch (err: any) {
      console.error("Update error:", err);
      // Cek spesifik jika error 401
      if (err.response?.status === 401) {
          setError("Session expired or email changed. Please login again.");
          // Jangan set error state lain agar user tau kenapa dia logout
      } else {
          const msg = err.response?.data?.message || "Failed to update profile.";
          setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <MemberNavbar />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
          {/* HEADER */}
          <div className="mb-8 flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Account Settings
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Manage your personal information.
              </p>
            </div>
          </div>

          {/* PROFILE CARD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Banner Dekoratif */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative"></div>

            <div className="px-8 pb-8 relative">
              
              {/* 4. AVATAR UPLOAD SECTION */}
              <div className="relative -mt-16 mb-6 inline-block group">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-200 dark:bg-slate-800 relative shadow-md">
                  
                  {/* LOGIKA TAMPILAN GAMBAR: Preview -> Gambar User -> Inisial */}
                  {previewUrl ? (
                     // Tampilkan Preview jika user baru pilih file
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : user?.avatar ? (
                     // Tampilkan Avatar dari Backend jika ada (pastikan URL lengkap)
                     // Jika backend cuma kasih nama file, tambahkan base URL backend di depannya
                    <img 
                      src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:8080/${user.avatar}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    // Tampilkan Inisial jika belum ada foto
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-500">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Overlay Hitam saat Hover (Klik untuk ganti) */}
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </label>
                </div>
                
                {/* Input File Tersembunyi */}
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* INPUT NAME */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* INPUT EMAIL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-200 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* SUCCESS MESSAGE */}
                {success && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start gap-3 text-green-700 dark:text-green-200 animate-in fade-in">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                {/* SAVE BUTTON */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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