import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../app/axiosBaseQuery';
import { defaultPagination } from '../lib/utils';
import type { ApiResponse, News, NewsInput, NewsQueryParams, PaginatedResult } from '../types';

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['News'],
  endpoints: (builder) => ({
    getNews: builder.query<PaginatedResult<News>, NewsQueryParams | void>({
      query: (params) => ({
        url: '/news',
        method: 'GET',
        params: params ?? {},
      }),
      transformResponse: (response: ApiResponse<News[]>) => ({
        items: response.data,
        pagination: response.pagination ?? defaultPagination,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((item) => ({ type: 'News' as const, id: item._id })),
              { type: 'News' as const, id: 'LIST' },
            ]
          : [{ type: 'News' as const, id: 'LIST' }],
    }),
    getNewsBySlug: builder.query<News, string>({
      query: (slug) => ({
        url: `/news/${slug}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<News>) => response.data,
      providesTags: (_result, _error, slug) => [{ type: 'News', id: slug }],
    }),
    createNews: builder.mutation<News, NewsInput>({
      query: (payload) => ({
        url: '/news',
        method: 'POST',
        data: payload,
      }),
      transformResponse: (response: ApiResponse<News>) => response.data,
      invalidatesTags: [{ type: 'News', id: 'LIST' }],
    }),
    updateNews: builder.mutation<News, { id: string; payload: Partial<NewsInput> }>({
      query: ({ id, payload }) => ({
        url: `/news/${id}`,
        method: 'PUT',
        data: payload,
      }),
      transformResponse: (response: ApiResponse<News>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'News', id },
        { type: 'News', id: 'LIST' },
      ],
    }),
    deleteNews: builder.mutation<null, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<null>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: 'News', id },
        { type: 'News', id: 'LIST' },
      ],
    }),
    toggleFeatureNews: builder.mutation<News, string>({
      query: (id) => ({
        url: `/news/${id}/feature`,
        method: 'PATCH',
      }),
      transformResponse: (response: ApiResponse<News>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: 'News', id },
        { type: 'News', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetNewsBySlugQuery,
  useGetNewsQuery,
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useToggleFeatureNewsMutation,
  useUpdateNewsMutation,
} = newsApi;
