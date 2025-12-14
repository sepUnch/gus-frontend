import axiosInstance from "./axios-client"

export const authAPI = {
  register: (email, password, name) => axiosInstance.post("/auth/register", { email, password, name }),

  login: (email, password) => axiosInstance.post("/auth/login", { email, password }),
}
