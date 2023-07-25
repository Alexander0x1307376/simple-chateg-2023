/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { type AxiosRequestConfig } from "axios";
import { ACCESS_TOKEN_STORAGE_KEY } from "../../config/config";

export const BASE_URL = "/api";

const httpClientWithAuth = axios.create({
  baseURL: BASE_URL,
});

export const httpClient = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
});

httpClientWithAuth.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${
    localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || ""
  }`;
  return config;
});

httpClientWithAuth.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _isRetry?: boolean } =
      error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get(`${BASE_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem(
          ACCESS_TOKEN_STORAGE_KEY,
          response.data.accessToken as string
        );
        return httpClientWithAuth.request(originalRequest);
      } catch (e) {
        console.error("Unauthorized!!!");
      }
    }
    throw error;
  }
);

export default httpClientWithAuth;
