import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "react-hot-toast" // <--- 1. IMPORT INI
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans", // Tambahkan variable agar bisa dipakai Tailwind
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "GDGOC Submission Portal",
  description: "Google Developer Groups On Campus Esa Unggul",
  generator: "wartech.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {/* 2. PASANG TOASTER DI SINI */}
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            // Konfigurasi khusus untuk success/error (Opsional)
            success: {
              style: {
                background: '#10B981', // Hijau
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#EF4444', // Merah
                color: 'white',
              },
            },
          }} 
        />
        
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}