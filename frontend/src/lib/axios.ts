import axios from "axios";
import { useUserStore } from "@/store/user-store";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to attach token if available
axiosInstance.interceptors.request.use(
    (config) => {
        const state = useUserStore.getState();
        const token = state.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh (TODO)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 errors for token refresh logic here later
        return Promise.reject(error);
    }
);
