import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL
});

let unauthorizedHandler: (() => void) | null = null;

export const setAuthToken = (token: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common.Authorization;
};

export const setUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);
