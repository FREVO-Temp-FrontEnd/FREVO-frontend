import axios, { type AxiosResponse } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim();

export const isDemoMode = !baseURL;

const agent = axios.create({
  baseURL: baseURL || undefined,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

agent.interceptors.request.use((config) => {
  // In the future, attach Authorization token here if present
  // const token = localStorage.getItem("token");
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

agent.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn("Unauthorized request");
      }
    }
    return Promise.reject(error);
  }
);

export default agent;
