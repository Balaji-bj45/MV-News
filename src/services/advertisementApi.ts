import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../app/axiosBaseQuery';
import type { ApiResponse } from '../types';

export interface Advertisement {
  _id: string;
  position: 'top_banner' | 'sidebar_banner';
  imageUrl: string;
  targetUrl?: string;
  isActive: boolean;
}

export const advertisementApi = createApi({
  reducerPath: 'advertisementApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Advertisement'],
  endpoints: (builder) => ({
    getAdvertisements: builder.query<Advertisement[], string | void>({
      query: (position) => ({
        url: '/ads',
        method: 'GET',
        params: position ? { position } : {},
      }),
      transformResponse: (response: ApiResponse<Advertisement[]>) => response.data,
      providesTags: ['Advertisement'],
    }),
    updateAdvertisement: builder.mutation<Advertisement, { position: string; payload: Partial<Advertisement> }>({
      query: ({ position, payload }) => ({
        url: `/ads/${position}`,
        method: 'PUT',
        data: payload,
      }),
      transformResponse: (response: ApiResponse<Advertisement>) => response.data,
      invalidatesTags: ['Advertisement'],
    }),
  }),
});

export const { useGetAdvertisementsQuery, useUpdateAdvertisementMutation } = advertisementApi;
