import { apiSlice } from "../../../store/apiSlice.js";

export const importApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    importJobs: builder.mutation({
      query: (formData) => ({
        url: "/jobs/import",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["JobsList", "JobsStats", "DuplicatesList"],
    }),
    deleteImportedJobs: builder.mutation({
      query: (filename) => ({
        url: `/jobs/import/${encodeURIComponent(filename)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JobsList", "JobsStats", "DuplicatesList", "JobDetails"],
    }),
  }),
  overrideExisting: true,
});

export const { useImportJobsMutation, useDeleteImportedJobsMutation } = importApi;
