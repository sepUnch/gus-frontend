import axiosInstance from "@/lib/api-client"

export const submissionsAPI = {
  submit: (data: any) => axiosInstance.post("/member/submissions", data),

  verify: (seriesId: string, code: string) => axiosInstance.post(`/member/series/${seriesId}/verify`, { code }),
}
