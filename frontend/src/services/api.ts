import axios from "axios";

/**
 * Development:
 *   -> calls http://localhost:8000
 *
 * Production (Render):
 *   -> calls deployed backend
 */
const API_BASE_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:8000"
        : "https://sixseven-wcz0.onrender.com"; // <-- your backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token if present
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("pg_token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("pg_token");
            localStorage.removeItem("pg_user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const auth = {
    login: (data: any) => api.post("/api/login", data),
    signup: (data: any) => api.post("/api/signup", data),
};

export const analysis = {
    analyze: (data: any) =>
        api.post("/api/analyze", data, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    getHistory: () => api.get("/api/results"),
};

export default api;