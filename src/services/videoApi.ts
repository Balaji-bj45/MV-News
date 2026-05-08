import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../app/axiosBaseQuery';
import { defaultPagination } from '../lib/utils';
import type { ApiResponse, PaginatedResult, Video, VideoInput } from '../types';

export const videoApi = createApi({
  reducerPath: 'videoApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Video'],
  endpoints: (builder) => ({
    getVideos: builder.query<PaginatedResult<Video>, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/videos',
        method: 'GET',
        params: params ?? {},
      }),
      transformResponse: (response: ApiResponse<Video[]>) => ({
        items: response.data,
        pagination: response.pagination ?? defaultPagination,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((video) => ({ type: 'Video' as const, id: video._id })),
              { type: 'Video' as const, id: 'LIST' },
            ]
          : [{ type: 'Video' as const, id: 'LIST' }],
    }),
    createVideo: builder.mutation<Video, VideoInput>({
      query: (payload) => ({
        url: '/videos',
        method: 'POST',
        data: payload,
      }),
      transformResponse: (response: ApiResponse<Video>) => response.data,
      invalidatesTags: [{ type: 'Video', id: 'LIST' }],
    }),
    updateVideo: builder.mutation<Video, { id: string; payload: VideoInput }>({
      query: ({ id, payload }) => ({
        url: `/videos/${id}`,
        method: 'PUT',
        data: payload,
      }),
      transformResponse: (response: ApiResponse<Video>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Video', id },
        { type: 'Video', id: 'LIST' },
      ],
    }),
    deleteVideo: builder.mutation<null, string>({
      query: (id) => ({
        url: `/videos/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<null>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: 'Video', id },
        { type: 'Video', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateVideoMutation,
  useDeleteVideoMutation,
  useGetVideosQuery,
  useUpdateVideoMutation,
} = videoApi;
