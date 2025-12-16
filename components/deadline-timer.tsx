"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface DeadlineTimerProps {
  deadline: string;
  onExpire: () => void; // Callback saat waktu habis
}

export const DeadlineTimer = ({ deadline, onExpire }: DeadlineTimerProps) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("EXPIRED");
        onExpire(); // Memicu fungsi parent untuk disable tombol
        return;
      }

      // Hitung hari, jam, menit, detik
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Format tampilan
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      // Ubah warna jadi merah jika sisa < 1 jam
      if (distance < 3600000) setIsUrgent(true);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, onExpire]);

  if (timeLeft === "EXPIRED") {
    return (
      <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-3 py-1 rounded-lg">
        <AlertTriangle size={16} />
        Deadline Passed
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 font-mono font-bold px-3 py-1 rounded-lg border ${
        isUrgent
          ? "text-red-600 bg-red-50 border-red-200 animate-pulse"
          : "text-blue-600 bg-blue-50 border-blue-200"
      }`}
    >
      <Clock size={16} />
      {timeLeft}
    </div>
  );
};
