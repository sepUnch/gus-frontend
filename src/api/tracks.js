import axiosInstance from "./axios-client"

export const tracksAPI = {
  getAll: () => axiosInstance.get("/tracks"),

  getDetail: (id) => axiosInstance.get(`/tracks/${id}`),

  getLeaderboard: (trackId) => axiosInstance.get(`/leaderboard/track/${trackId}`),
}
