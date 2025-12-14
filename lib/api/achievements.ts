import axiosInstance from "@/lib/api-client"

export const achievementsAPI = {
  getMy: () => axiosInstance.get("/member/me/achievements"),

  getAdminTypes: () => axiosInstance.get("/admin/achievement-types"),

  createType: (data: any) => axiosInstance.post("/admin/achievement-types", data),

  getAll: () => axiosInstance.get("/admin/achievements"),

  create: (data: any) => axiosInstance.post("/admin/achievements", data),

  update: (id: string, data: any) => axiosInstance.put(`/admin/achievements/${id}`, data),

  award: (data: any) => axiosInstance.post("/admin/achievements/award", data),

  revoke: (data: any) => axiosInstance.post("/admin/achievements/revoke", data),
}
