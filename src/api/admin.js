import axiosInstance from "./axios-client"

export const adminAPI = {
  // Tracks
  createTrack: (data) => axiosInstance.post("/admin/tracks", data),

  // Series
  createSeries: (data) => axiosInstance.post("/admin/series", data),

  updateSeriesCode: (id, code) => axiosInstance.patch(`/admin/series/${id}/code`, { code }),

  // Submissions
  getSubmissions: (seriesId) => axiosInstance.get(`/admin/submissions/series/${seriesId}`),

  gradeSubmission: (data) => axiosInstance.post("/admin/submissions/grade", data),

  // Users
  updateUserRole: (id, role) => axiosInstance.patch(`/admin/users/${id}/role`, { role }),
}
