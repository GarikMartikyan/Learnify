import { createApi } from "@reduxjs/toolkit/query/react";

import { apiUrls, createBaseQuery } from "./index.api.ts";
import type {
  EnrollmentStatus,
  IEnrollment,
  IEnrollmentDetail,
  IStudentChapter,
} from "../constants/interfaces/enrollment.interfaces.ts";

/** Everything here changes together when the student makes progress, so one tag is enough. */
const ENROLLMENT_TAG = "Enrollment";

/** Endpoints of the Enrollment & Grading service (port 8083). */
export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: createBaseQuery(apiUrls.enrollment),
  tagTypes: [ENROLLMENT_TAG],
  endpoints: (builder) => ({
    /** The user's latest enrollment in a course; null if they never enrolled. */
    getCourseEnrollment: builder.query<IEnrollment | null, string>({
      query: (courseId) => `/courses/${courseId}/enrollment`,
      providesTags: [ENROLLMENT_TAG],
    }),

    getMyEnrollments: builder.query<IEnrollment[], EnrollmentStatus | void>({
      query: (status) => ({
        url: "/enrollments/me",
        params: status ? { status } : undefined,
      }),
      providesTags: [ENROLLMENT_TAG],
    }),

    getEnrollment: builder.query<IEnrollmentDetail, string>({
      query: (enrollmentId) => `/enrollments/${enrollmentId}`,
      providesTags: [ENROLLMENT_TAG],
    }),

    /** Opening a chapter also marks it as viewed, so the progress queries are refreshed afterwards. */
    openChapter: builder.query<
      IStudentChapter,
      { enrollmentId: string; chapterId: string }
    >({
      query: ({ enrollmentId, chapterId }) =>
        `/enrollments/${enrollmentId}/chapters/${chapterId}`,
      keepUnusedDataFor: 0,
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(enrollmentApi.util.invalidateTags([ENROLLMENT_TAG]));
        } catch {
          // the error toast is shown by the base query
        }
      },
    }),

    /** Enrolls, or continues an abandoned enrollment. */
    enroll: builder.mutation<IEnrollment, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/enroll`,
        method: "POST",
      }),
      invalidatesTags: [ENROLLMENT_TAG],
    }),

    abandonEnrollment: builder.mutation<IEnrollment, string>({
      query: (enrollmentId) => ({
        url: `/enrollments/${enrollmentId}/abandon`,
        method: "POST",
      }),
      invalidatesTags: [ENROLLMENT_TAG],
    }),

    restoreEnrollment: builder.mutation<IEnrollment, string>({
      query: (enrollmentId) => ({
        url: `/enrollments/${enrollmentId}/restore`,
        method: "POST",
      }),
      invalidatesTags: [ENROLLMENT_TAG],
    }),
  }),
});

export const {
  useGetCourseEnrollmentQuery,
  useGetMyEnrollmentsQuery,
  useGetEnrollmentQuery,
  useOpenChapterQuery,
  useEnrollMutation,
  useAbandonEnrollmentMutation,
  useRestoreEnrollmentMutation,
} = enrollmentApi;
