import { apiSlice } from "../../../store/apiSlice.js";

export const resumeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    analyzeResume: builder.mutation({
      query: (body) => ({
        url: "/resume/tailor",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useAnalyzeResumeMutation } = resumeApi;
