import { Outlet } from "react-router-dom"
import { MemberNavbar } from "../components/MemberNavbar"

export const MemberLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <MemberNavbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
