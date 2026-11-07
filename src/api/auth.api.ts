import { createApi } from "@reduxjs/toolkit/query/react";

import { apiUrls, createBaseQuery } from "./index.api.ts";
import { rtkTags } from "../constants/rtkTags.ts";
import type {
  IAuthResponse,
  ICountry,
  ILoginRequest,
  IRegisterRequest,
  IUpdateProfileRequest,
  IUser,
} from "../constants/interfaces/user.interfaces.ts";

/** Endpoints of the Auth & User service (port 8081). */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: createBaseQuery(apiUrls.auth),
  tagTypes: Object.values(rtkTags),
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, ILoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),

    register: builder.mutation<IAuthResponse, IRegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),

    /** The logged-in user. */
    getMe: builder.query<IUser, void>({
      query: () => "/users/me",
      providesTags: [rtkTags.me],
    }),

    updateMe: builder.mutation<IUser, IUpdateProfileRequest>({
      query: (body) => ({ url: "/users/me", method: "PATCH", body }),
      // Put the updated user straight into the getMe cache
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(authApi.util.upsertQueryData("getMe", undefined, data));
      },
    }),

    /** JPG/PNG/WEBP, max 2 MB. */
    updateAvatar: builder.mutation<IUser, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return { url: "/users/me/avatar", method: "PUT", body: formData };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(authApi.util.upsertQueryData("getMe", undefined, data));
      },
    }),

    removeAvatar: builder.mutation<IUser, void>({
      query: () => ({ url: "/users/me/avatar", method: "DELETE" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(authApi.util.upsertQueryData("getMe", undefined, data));
      },
    }),

    getCountries: builder.query<ICountry[], void>({
      query: () => "/countries",
      // The list never changes while the app runs
      keepUnusedDataFor: 60 * 60,
    }),

    /** Admin only: any user's profile. */
    getUserById: builder.query<IUser, string>({
      query: (userId) => `/admin/users/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: rtkTags.user, id: userId },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateAvatarMutation,
  useRemoveAvatarMutation,
  useGetCountriesQuery,
  useGetUserByIdQuery,
} = authApi;
