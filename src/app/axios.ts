import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, AuthTokens } from '../types';
import { clearTokens, emitForcedLogout, getAccessToken, getRefreshToken, setTokens } from './tokenManager';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000/api';

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let activeRefreshRequest: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
  const storedRefreshToken = getRefreshToken();

  const response = await refreshClient.post<ApiResponse<AuthTokens>>(
    '/auth/refresh',
    storedRefreshToken ? { refreshToken: storedRefreshToken } : undefined,
  );

  const refreshedTokens = response.data.data;
  setTokens(refreshedTokens);

  return refreshedTokens.accessToken;
};

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;
    const isAuthRoute =
      originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh');

    if (!isUnauthorized || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      activeRefreshRequest ??= refreshAccessToken().finally(() => {
        activeRefreshRequest = null;
      });

      const nextAccessToken = await activeRefreshRequest;

      if (!nextAccessToken) {
        throw error;
      }

      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearTokens();
      emitForcedLogout();
      return Promise.reject(refreshError);
    }
  },
);
