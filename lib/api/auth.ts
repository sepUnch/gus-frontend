import axiosInstance from "@/lib/api-client"

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    axiosInstance.post("/auth/register", { email, password, name }),

  login: (email: string, password: string) => axiosInstance.post("/auth/login", { email, password }),
}
