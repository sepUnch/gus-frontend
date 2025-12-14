"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "member"
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // ⛔ Tunggu auth selesai
    if (isLoading) return

    // ❌ Belum login
    if (!user) {
      router.replace("/login")
      return
    }

    // ❌ Role tidak sesuai
    if (requiredRole && user.role !== requiredRole) {
      router.replace(user.role === "admin" ? "/admin" : "/member")
    }
  }, [user, isLoading, requiredRole, router])

  // ⏳ Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  // ⛔ Jangan render apa pun jika belum valid
  if (!user) return null
  if (requiredRole && user.role !== requiredRole) return null

  return <>{children}</>
}
