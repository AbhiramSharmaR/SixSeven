import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {

        // Try to get token from localStorage (key might change based on what I find in Login.tsx)
        // I recall Login.tsx storing user under "pg_user". Let's assume we'll store token separately or in it.
        // For now, I'll standardize on "pg_token" for the token.
        const token = localStorage.getItem("pg_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear storage and redirect if needed
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
    analyze: (formData: FormData) => api.post("/api/analyze", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }),
    getHistory: () => api.get("/api/results"),
    getResult: (id: string) => api.get(`/api/results/${id}`),
};

export default api;
