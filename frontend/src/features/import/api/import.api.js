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
  }),
  overrideExisting: true,
});

export const { useImportJobsMutation } = importApi;
