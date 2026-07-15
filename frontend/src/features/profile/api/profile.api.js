import { apiSlice } from "../../../store/apiSlice.js";

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        body,
      }),
    }),

    setNewPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/new-password",
        method: "PATCH",
        body,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useResetPasswordMutation, useSetNewPasswordMutation } = profileApi;
