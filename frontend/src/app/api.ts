import axios, { AxiosError } from "axios";

// instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor -> add token jwt
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function getApiErrorMessage(err: unknown): string {
  const e = err as AxiosError<any>;
  const data = e?.response?.data;

  // FastAPI validation error
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0].msg;
  }

  // FastAPI HTTP error
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  // Generic backend message
  if (typeof data?.message === "string") {
    return data.message;
  }

  // Raw string response
  if (typeof data === "string") {
    return data;
  }

  // Fallback
  return e?.message || "Unexpected error occurred.";
}

export default api;
