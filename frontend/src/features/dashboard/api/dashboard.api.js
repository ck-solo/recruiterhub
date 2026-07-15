import { apiSlice } from "../../../store/apiSlice.js";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard",
      providesTags: ["JobsStats"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetDashboardStatsQuery } = dashboardApi;
