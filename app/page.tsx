"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
  if (isLoading) return

  if (!user) {
    router.replace("/login")
  } else if (user.role === "admin") {
    router.replace("/admin")
  } else {
    router.replace("/member")
  }
}, [user, isLoading, router])


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
