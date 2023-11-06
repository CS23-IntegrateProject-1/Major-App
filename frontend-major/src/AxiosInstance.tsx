import axios, { AxiosInstance } from 'axios';

export const Axios: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "",
    withCredentials: true,
})