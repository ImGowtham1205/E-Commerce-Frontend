import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    const publicEndpoints = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password"
    ];

    const isPublic = publicEndpoints.some((url) =>
      config.url?.includes(url)
    );

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => {
    // 🔁 Refresh token if backend sends one
    const authHeader = response.headers["authorization"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const newToken = authHeader.replace("Bearer ", "");
      localStorage.setItem("token", newToken);
    }

    return response;
  },
  (error) => {
    const originalUrl = error.config?.url || "";

    const publicEndpoints = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password"
    ];

    const isPublic = publicEndpoints.some(url =>
      originalUrl.includes(url)
    );

    // 🔴 Auto logout ONLY for protected API calls
    if (error.response?.status === 401 && !isPublic) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }

    // ❗Let Login.jsx handle 401 errors
    return Promise.reject(error);
  }
);

export default api;
