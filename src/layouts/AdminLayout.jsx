import { Outlet } from "react-router-dom"
import { AdminSidebar } from "../components/AdminSidebar"

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        <div className="container mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
