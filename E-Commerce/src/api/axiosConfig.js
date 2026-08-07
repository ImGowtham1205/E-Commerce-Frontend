import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8765",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= PUBLIC ENDPOINTS ================= */
const publicEndpoints = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

/* ================= REFRESH HANDLING ================= */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

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
    // 🔥 Read token from gateway (X-Auth-Token preferred)
    const authHeader =
      response.headers["x-auth-token"] ||
      response.headers["authorization"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const newToken = authHeader.replace("Bearer ", "");
      localStorage.setItem("token", newToken);
      console.log("✅ Token updated:", newToken);
    }

    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    const isPublic = publicEndpoints.some((url) =>
      originalRequest.url?.includes(url)
    );

    // ❌ Do not retry public APIs
    if (isPublic) {
      return Promise.reject(error);
    }

    // 🔥 Handle 401 with retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // ⏳ Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        // 🔥 Get latest token from storage (set by previous response)
        const newToken = localStorage.getItem("token");

        if (!newToken) {
          throw new Error("No token available");
        }

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // 🛡 Guard: avoid a redundant hard redirect if we're already
        // navigating away (e.g. DeleteAccount flow already redirecting
        // to /login). Prevents two navigations racing and blanking the page.
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;