/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AuthStore } from "./AuthStore";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type { AuthResponse as AuthData } from "../auth/authTypes";

export class HttpClient {
  private axios: AxiosInstance;

  private baseUrl: string;

  constructor(
    baseUrl: string,
    private authStore: AuthStore
  ) {
    this.baseUrl = baseUrl;
    this.authStore = authStore;
    this.axios = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
    });

    this.axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${
        authStore.authData?.accessToken || ""
      }`;
      return config;
    });

    this.axios.interceptors.response.use(
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
            const response = await axios.get<AuthData>(
              `${this.baseUrl}/refresh`,
              {
                withCredentials: true,
              }
            );
            this.authStore.set(response.data);
            return this.axios.request(originalRequest);
          } catch (e) {
            this.authStore.clear();
            console.error("Unauthorized!!!");
          }
        }
        throw error;
      }
    );
  }

  async get<Response>(
    url: string,
    config?: AxiosRequestConfig<any> | undefined
  ) {
    return this.axios.get<Response>(url, config);
  }

  async post<Response, Request>(
    url: string,
    data?: Request,
    config?: AxiosRequestConfig<any> | undefined
  ) {
    return this.axios.post<Response>(url, data, config);
  }

  async put<Response, Request>(
    url: string,
    data?: Request,
    config?: AxiosRequestConfig<any> | undefined
  ) {
    return this.axios.put<Response>(url, data, config);
  }

  async delete<Response>(
    url: string,
    config?: AxiosRequestConfig<any> | undefined
  ) {
    return this.axios.delete<Response>(url, config);
  }
}
