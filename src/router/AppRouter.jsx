import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute, RoleRoute } from "../components/ProtectedRoute"
import { MemberLayout } from "../layouts/MemberLayout"
import { AdminLayout } from "../layouts/AdminLayout"

// Auth Pages
import { Login } from "../pages/auth/Login"
import { Register } from "../pages/auth/Register"

// Member Pages
import { MemberTracks } from "../pages/member/Tracks"
import { MemberTrackDetail } from "../pages/member/TrackDetail"
import { MemberSubmitWork } from "../pages/member/SubmitWork"
import { MemberVerifyAttendance } from "../pages/member/VerifyAttendance"
import { MemberAchievements } from "../pages/member/MyAchievements"
import { MemberLeaderboard } from "../pages/member/Leaderboard"

// Admin Pages
import { AdminDashboard } from "../pages/admin/Dashboard"
import { AdminManageTracks } from "../pages/admin/ManageTracks"
import { AdminManageSeries } from "../pages/admin/ManageSeries"
import { AdminManageSubmissions } from "../pages/admin/ManageSubmissions"
import { AdminGradeSubmission } from "../pages/admin/GradeSubmission"
import { AdminAchievements } from "../pages/admin/Achievements"
import { AdminUsers } from "../pages/admin/Users"

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Member Routes */}
        <Route
          path="/member"
          element={
            <ProtectedRoute>
              <MemberLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MemberTracks />} />
          <Route path="tracks/:id" element={<MemberTrackDetail />} />
          <Route path="submit" element={<MemberSubmitWork />} />
          <Route path="verify" element={<MemberVerifyAttendance />} />
          <Route path="achievements" element={<MemberAchievements />} />
          <Route path="leaderboard/:trackId" element={<MemberLeaderboard />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RoleRoute requiredRole="admin">
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="tracks" element={<AdminManageTracks />} />
          <Route path="series" element={<AdminManageSeries />} />
          <Route path="submissions" element={<AdminManageSubmissions />} />
          <Route path="submissions/grade/:id" element={<AdminGradeSubmission />} />
          <Route path="achievements" element={<AdminAchievements />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}
