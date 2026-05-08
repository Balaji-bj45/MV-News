import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../app/axiosBaseQuery';
import type { ApiResponse, Candidate, CandidateInput } from '../types';

export const candidateApi = createApi({
  reducerPath: 'candidateApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Candidate'],
  endpoints: (builder) => ({
    getCandidates: builder.query<Candidate[], void>({
      query: () => ({
        url: '/candidates',
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<Candidate[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((candidate) => ({ type: 'Candidate' as const, id: candidate._id })),
              { type: 'Candidate' as const, id: 'LIST' },
            ]
          : [{ type: 'Candidate' as const, id: 'LIST' }],
    }),
    getCandidateById: builder.query<Candidate, string>({
      query: (id) => ({
        url: `/candidates/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ApiResponse<Candidate>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Candidate', id }],
    }),
    createCandidate: builder.mutation<Candidate, CandidateInput>({
      query: (payload) => ({
        url: '/candidates',
        method: 'POST',
        data: payload,
      }),
      transformResponse: (response: ApiResponse<Candidate>) => response.data,
      invalidatesTags: [{ type: 'Candidate', id: 'LIST' }],
    }),
    updateCandidate: builder.mutation<Candidate, { id: string; payload: CandidateInput }>({
      query: ({ id, payload }) => ({
        url: `/candidates/${id}`,
        method: 'PUT',
        data: payload,
      }),
      transformResponse: (response: ApiResponse<Candidate>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Candidate', id },
        { type: 'Candidate', id: 'LIST' },
      ],
    }),
    deleteCandidate: builder.mutation<null, string>({
      query: (id) => ({
        url: `/candidates/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: ApiResponse<null>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: 'Candidate', id },
        { type: 'Candidate', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateCandidateMutation,
  useDeleteCandidateMutation,
  useGetCandidateByIdQuery,
  useGetCandidatesQuery,
  useUpdateCandidateMutation,
} = candidateApi;
