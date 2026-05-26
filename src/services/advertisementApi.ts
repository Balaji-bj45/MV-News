import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../app/axiosBaseQuery';
import type { ApiResponse } from '../types';

export type AdvertisementPosition = 'top_banner' | 'sidebar_banner';

export interface Advertisement {
  _id: string;
  position: AdvertisementPosition;
  imageUrl: string;
  publicId?: string;
  targetUrl?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdvertisementInput {
  position: AdvertisementPosition;
  imageUrl: string;
  publicId?: string;
  targetUrl?: string;
  isActive: boolean;
  displayOrder: number;
}

export const advertisementApi = createApi({
  reducerPath: 'advertisementApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Advertisement'],
  endpoints: (builder) => ({
    getAdvertisements: builder.query<Advertisement[], AdvertisementPosition | void>({
      query: (position) => ({
        url: '/ads',
        method: 'GET',
        params: position ? { position } : {},
      }),
      transformResponse: (response: ApiResponse<Advertisement[]>) => response.data,
      providesTags: ['Advertisement'],
    }),
    createAdvertisement: builder.mutation<Advertisement, AdvertisementInput>({
      query: (payload) => ({
        url: '/ads',
        method: 'POST',
        data: payload,
      }),
      transformResponse: (response: ApiResponse<Advertisement>) => response.data,
      invalidatesTags: ['Advertisement'],
    }),
    updateAdvertisement: builder.mutation<Advertisement, { id: string; payload: Partial<AdvertisementInput> }>({
      query: ({ id, payload }) => ({
        url: `/ads/${id}`,
        method: 'PUT',
        data: payload,
      }),
      transformResponse: (response: ApiResponse<Advertisement>) => response.data,
      invalidatesTags: ['Advertisement'],
    }),
    deleteAdvertisement: builder.mutation<Advertisement, string>({
      query: (id) => ({
        url: `/ads/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<Advertisement>) => response.data,
      invalidatesTags: ['Advertisement'],
    }),
  }),
});

export const {
  useCreateAdvertisementMutation,
  useDeleteAdvertisementMutation,
  useGetAdvertisementsQuery,
  useUpdateAdvertisementMutation,
} = advertisementApi;
