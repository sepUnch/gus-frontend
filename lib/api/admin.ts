import axiosInstance from "@/lib/api-client"

export const adminAPI = {
  // Tracks
  createTrack: (data: any) => axiosInstance.post("/admin/tracks", data),

  // Series
  createSeries: (data: any) => axiosInstance.post("/admin/series", data),

  updateSeriesCode: (id: string, code: string) => axiosInstance.patch(`/admin/series/${id}/code`, { code }),

  // Submissions
  getSubmissions: (seriesId: string) => axiosInstance.get(`/admin/submissions/series/${seriesId}`),

  gradeSubmission: (data: any) => axiosInstance.post("/admin/submissions/grade", data),

  // Users
  updateUserRole: (id: string, role: string) => axiosInstance.patch(`/admin/users/${id}/role`, { role }),
}
