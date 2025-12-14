import axiosInstance from "./axios-client"

export const submissionsAPI = {
  submit: (data) => axiosInstance.post("/member/submissions", data),

  verify: (seriesId, code) => axiosInstance.post(`/member/series/${seriesId}/verify`, { code }),
}
