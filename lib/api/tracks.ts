import axiosInstance from "@/lib/api-client"

export const tracksAPI = {
  getAll: () => axiosInstance.get("/tracks"),

  getDetail: (id: string) => axiosInstance.get(`/tracks/${id}`),

  getLeaderboard: (trackId: string) => axiosInstance.get(`/leaderboard/track/${trackId}`),
}
