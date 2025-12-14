"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export const AdminSidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Tracks", href: "/admin/tracks" },
    { label: "Series", href: "/admin/series" },
    { label: "Submissions", href: "/admin/submissions" },
    { label: "Achievements", href: "/admin/achievements" },
    { label: "Users", href: "/admin/users" },
  ]

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-card border-r border-border p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-primary mb-8">GDGOC Admin</h1>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
