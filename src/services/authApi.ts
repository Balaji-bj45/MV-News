import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../app/axiosBaseQuery';
import { applyRefreshedTokens, clearSession, setSession } from '../app/authSlice';
import { getRefreshToken } from '../app/tokenManager';
import type { ApiResponse, AuthTokens, LoginRequest, LoginResponseData } from '../types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseData, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
      transformResponse: (response: ApiResponse<LoginResponseData>) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setSession(data));
      },
    }),
    refresh: builder.mutation<AuthTokens, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
        data: getRefreshToken() ? { refreshToken: getRefreshToken() } : undefined,
      }),
      transformResponse: (response: ApiResponse<AuthTokens>) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(applyRefreshedTokens(data));
      },
    }),
    logout: builder.mutation<null, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<null>) => response.data,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearSession());
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRefreshMutation } = authApi;
