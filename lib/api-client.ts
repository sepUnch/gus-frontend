import axios, { type AxiosInstance } from "axios"

// Pastikan port backend benar (biasanya 8000 atau 8080)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  // headers: {
  //   "Content-Type": "application/json",
  // },
})

// 1. Request Interceptor (Ini sudah benar)
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 2. Response Interceptor (Update sedikit)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika error 401 (Unauthorized)
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Cek agar tidak redirect berulang jika sudah di halaman login
        if (!window.location.pathname.includes("/login")) {
           localStorage.removeItem("token")
           localStorage.removeItem("user")
           window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance