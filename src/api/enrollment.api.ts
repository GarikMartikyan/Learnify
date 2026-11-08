import { createApi } from "@reduxjs/toolkit/query/react";

import { apiUrls, createBaseQuery } from "./index.api.ts";
import type { IPage } from "../constants/interfaces/user.interfaces.ts";
import type {
  EnrollmentStatus,
  IAdminReport,
  IAdminReportsQuery,
  ICreateReportRequest,
  IMyRating,
  IRatingSummary,
  IAttempt,
  IEnrollment,
  IEnrollmentDetail,
  IExamOverview,
  ISaveAnswerRequest,
  IStudentChapter,
} from "../constants/interfaces/enrollment.interfaces.ts";

/** Everything about progress changes together when the student makes progress, so one tag is enough. */
const ENROLLMENT_TAG = "Enrollment";
const RATING_TAG = "Rating";
const REPORT_TAG = "Report";

/** Endpoints of the Enrollment & Grading service (port 8083). */
export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: createBaseQuery(apiUrls.enrollment),
  tagTypes: [ENROLLMENT_TAG, RATING_TAG, REPORT_TAG],
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

    /** Reads an unlocked chapter (does not complete it). */
    openChapter: builder.query<
      IStudentChapter,
      { enrollmentId: string; chapterId: string }
    >({
      query: ({ enrollmentId, chapterId }) =>
        `/enrollments/${enrollmentId}/chapters/${chapterId}`,
      providesTags: [ENROLLMENT_TAG],
    }),

    /** The student clicks "Mark as finished" at the end of a chapter. Returns the updated progress. */
    finishChapter: builder.mutation<
      IEnrollment,
      { enrollmentId: string; chapterId: string }
    >({
      query: ({ enrollmentId, chapterId }) => ({
        url: `/enrollments/${enrollmentId}/chapters/${chapterId}/finish`,
        method: "POST",
      }),
      invalidatesTags: [ENROLLMENT_TAG],
    }),

    // ------------------------------------------------ exams

    getExamOverview: builder.query<
      IExamOverview,
      { enrollmentId: string; examId: string }
    >({
      query: ({ enrollmentId, examId }) =>
        `/enrollments/${enrollmentId}/exams/${examId}`,
      providesTags: [ENROLLMENT_TAG],
    }),

    /** Starts an attempt, or resumes the open one. */
    startAttempt: builder.mutation<
      IAttempt,
      { enrollmentId: string; examId: string }
    >({
      query: ({ enrollmentId, examId }) => ({
        url: `/enrollments/${enrollmentId}/exams/${examId}/attempts`,
        method: "POST",
      }),
      invalidatesTags: [ENROLLMENT_TAG],
    }),

    getAttempt: builder.query<IAttempt, string>({
      query: (attemptId) => `/attempts/${attemptId}`,
      providesTags: [ENROLLMENT_TAG],
    }),

    /** Saves one answer. Nothing is refetched: the page keeps its own copy of the answers. */
    saveAnswer: builder.mutation<void, ISaveAnswerRequest>({
      query: ({ attemptId, questionId, optionIds, text }) => ({
        url: `/attempts/${attemptId}/answers/${questionId}`,
        method: "PUT",
        body: { optionIds, text },
      }),
    }),

    submitAttempt: builder.mutation<IAttempt, string>({
      query: (attemptId) => ({
        url: `/attempts/${attemptId}/submit`,
        method: "POST",
      }),
      invalidatesTags: [ENROLLMENT_TAG],
    }),

    // ------------------------------------------------ ratings

    /** Public: average and count per course (unrated courses are left out). */
    getRatingSummaries: builder.query<IRatingSummary[], string[]>({
      query: (courseIds) => ({ url: "/ratings", params: { courseIds: courseIds.join(",") } }),
      providesTags: [RATING_TAG],
    }),

    getMyRating: builder.query<IMyRating, string>({
      query: (courseId) => `/courses/${courseId}/rating`,
      providesTags: [RATING_TAG, ENROLLMENT_TAG],
    }),

    rateCourse: builder.mutation<IMyRating, { courseId: string; rating: number }>({
      query: ({ courseId, rating }) => ({
        url: `/courses/${courseId}/rating`,
        method: "PUT",
        body: { rating },
      }),
      invalidatesTags: [RATING_TAG],
    }),

    // ------------------------------------------------ content reports

    reportContent: builder.mutation<void, ICreateReportRequest>({
      query: (body) => ({ url: "/reports", method: "POST", body }),
      invalidatesTags: [REPORT_TAG],
    }),

    getAdminReports: builder.query<IPage<IAdminReport>, IAdminReportsQuery>({
      query: (params) => ({ url: "/admin/reports", params }),
      providesTags: [REPORT_TAG],
    }),

    /** action: resolve (hide the item), dismiss (the item is fine) or restore-content (show it again). */
    reviewReport: builder.mutation<
      void,
      { reportId: string; action: "resolve" | "dismiss" | "restore-content"; notes?: string }
    >({
      query: ({ reportId, action, notes }) => ({
        url: `/admin/reports/${reportId}/${action}`,
        method: "POST",
        body: { notes },
      }),
      invalidatesTags: [REPORT_TAG],
    }),

    // ------------------------------------------------ enrollments

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
  useFinishChapterMutation,
  useGetExamOverviewQuery,
  useStartAttemptMutation,
  useGetAttemptQuery,
  useSaveAnswerMutation,
  useSubmitAttemptMutation,
  useGetRatingSummariesQuery,
  useGetMyRatingQuery,
  useRateCourseMutation,
  useReportContentMutation,
  useGetAdminReportsQuery,
  useReviewReportMutation,
  useEnrollMutation,
  useAbandonEnrollmentMutation,
  useRestoreEnrollmentMutation,
} = enrollmentApi;
