"use client";

import { useState } from "react";
import { X, ShieldCheck, Loader2 } from "lucide-react"; // Pastikan install lucide-react

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>; // Promise untuk handling loading
  seriesName: string;
}

export const VerificationModal = ({
  isOpen,
  onClose,
  onVerify,
  seriesName,
}: VerificationModalProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the code.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await onVerify(code);
      // Jika sukses, modal akan ditutup oleh parent, atau kita reset di sini
      setCode("");
    } catch (err) {
      // Jika error, biarkan modal tetap terbuka dan tampilkan error
      console.error(err);
      setError("Verification failed. Please check the code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP BLUR */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* MODAL CONTENT */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800 scale-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Verify Attendance
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 px-4">
            Enter the token code provided by the admin for <b>{seriesName}</b>.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Verification Token
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())} // Auto uppercase biar enak
              placeholder="e.g. XY782A"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:font-sans placeholder:tracking-normal placeholder:font-normal"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs mt-2 text-center font-medium animate-pulse">
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !code}
              className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
