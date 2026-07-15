import { apiSlice } from "../../../store/apiSlice.js";

export const duplicateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDuplicates: builder.query({
      query: () => "/duplicates",
      providesTags: ["DuplicatesList"],
    }),

    resolveDuplicate: builder.mutation({
      query: ({ id, action }) => ({
        url: `/duplicates/${id}`,
        method: "PATCH",
        body: { action },
      }),
      invalidatesTags: ["DuplicatesList", "JobsList", "JobsStats", "JobDetails"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetDuplicatesQuery, useResolveDuplicateMutation } = duplicateApi;
