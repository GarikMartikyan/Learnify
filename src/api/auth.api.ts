import { createApi } from "@reduxjs/toolkit/query/react";

import { apiUrls, createBaseQuery } from "./index.api.ts";
import { rtkTags } from "../constants/rtkTags.ts";
import type {
  ApplicationStatus,
  IAuthResponse,
  ICountry,
  ILoginRequest,
  IPage,
  IRegisterRequest,
  ITeacherApplication,
  IUpdateProfileRequest,
  IUser,
} from "../constants/interfaces/user.interfaces.ts";
import type { AccountStatus, UserRole } from "../constants/types/index.types.ts";

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
      // PUT, not PATCH: some browser setups refuse to send cross-origin PATCH requests.
      // The backend still treats it as a partial update (only sent fields change).
      query: (body) => ({ url: "/users/me", method: "PUT", body }),
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

    // ------------------------------------------------ admin: users

    /** All filters are optional; search matches name or email. */
    getUsers: builder.query<
      IPage<IUser>,
      {
        search?: string;
        role?: UserRole;
        status?: AccountStatus;
        page: number;
        size: number;
      }
    >({
      query: (params) => ({ url: "/admin/users", params }),
      providesTags: [{ type: rtkTags.user, id: "LIST" }],
    }),

    changeUserRole: builder.mutation<IUser, { userId: string; role: UserRole }>({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: rtkTags.user, id: "LIST" },
        { type: rtkTags.user, id: userId },
      ],
    }),

    changeUserStatus: builder.mutation<
      IUser,
      { userId: string; status: AccountStatus }
    >({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: rtkTags.user, id: "LIST" },
        { type: rtkTags.user, id: userId },
      ],
    }),

    // ------------------------------------------------ teacher applications (applicant)

    /** The logged-in user's applications, newest first. */
    getMyApplications: builder.query<ITeacherApplication[], void>({
      query: () => "/teacher-applications/mine",
      providesTags: [rtkTags.application],
    }),

    /** Motivation (20-2000 chars) + 1-3 PDF/JPG/PNG files (max 5 MB each). */
    submitApplication: builder.mutation<
      ITeacherApplication,
      { motivation: string; files: File[] }
    >({
      query: ({ motivation, files }) => {
        const formData = new FormData();
        formData.append("motivation", motivation);
        files.forEach((file) => formData.append("files", file));
        return { url: "/teacher-applications", method: "POST", body: formData };
      },
      invalidatesTags: [rtkTags.application],
    }),

    /** Temporary (1h) download link of a document. For the applicant and admins. */
    getApplicationDocumentUrl: builder.query<
      { url: string },
      { applicationId: string; documentId: string }
    >({
      query: ({ applicationId, documentId }) =>
        `/teacher-applications/${applicationId}/documents/${documentId}/url`,
      keepUnusedDataFor: 0,
    }),

    // ------------------------------------------------ teacher applications (admin)

    getApplications: builder.query<
      IPage<ITeacherApplication>,
      { status?: ApplicationStatus; page: number; size: number }
    >({
      query: ({ status, page, size }) => ({
        url: "/admin/teacher-applications",
        params: { status, page, size },
      }),
      providesTags: [rtkTags.application],
    }),

    approveApplication: builder.mutation<
      ITeacherApplication,
      { applicationId: string; adminNotes?: string }
    >({
      query: ({ applicationId, adminNotes }) => ({
        url: `/admin/teacher-applications/${applicationId}/approve`,
        method: "POST",
        body: { adminNotes },
      }),
      invalidatesTags: [rtkTags.application],
    }),

    rejectApplication: builder.mutation<
      ITeacherApplication,
      { applicationId: string; adminNotes?: string }
    >({
      query: ({ applicationId, adminNotes }) => ({
        url: `/admin/teacher-applications/${applicationId}/reject`,
        method: "POST",
        body: { adminNotes },
      }),
      invalidatesTags: [rtkTags.application],
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
  useGetUsersQuery,
  useChangeUserRoleMutation,
  useChangeUserStatusMutation,
  useGetMyApplicationsQuery,
  useSubmitApplicationMutation,
  useLazyGetApplicationDocumentUrlQuery,
  useGetApplicationsQuery,
  useApproveApplicationMutation,
  useRejectApplicationMutation,
} = authApi;
