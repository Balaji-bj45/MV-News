import type { AxiosError, Method } from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { apiClient } from './axios';

export interface AxiosQueryArgs {
  url: string;
  method: Method;
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
}

export interface ApiError {
  status?: number;
  data: unknown;
}

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosQueryArgs, unknown, ApiError> =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await apiClient({
        url,
        method,
        data,
        params,
        headers,
      });

      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data ?? axiosError.message,
        },
      };
    }
  };
