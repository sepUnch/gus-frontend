import axiosInstance from "./axios-client"

export const achievementsAPI = {
  getMy: () => axiosInstance.get("/member/me/achievements"),

  getAdminTypes: () => axiosInstance.get("/admin/achievement-types"),

  createType: (data) => axiosInstance.post("/admin/achievement-types", data),

  getAll: () => axiosInstance.get("/admin/achievements"),

  create: (data) => axiosInstance.post("/admin/achievements", data),

  update: (id, data) => axiosInstance.put(`/admin/achievements/${id}`, data),

  award: (data) => axiosInstance.post("/admin/achievements/award", data),

  revoke: (data) => axiosInstance.post("/admin/achievements/revoke", data),
}
