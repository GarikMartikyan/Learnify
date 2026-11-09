import { createApi } from "@reduxjs/toolkit/query/react";

import { apiUrls, createBaseQuery } from "./index.api.ts";
import { useAppDispatch } from "../hooks/useAppDispatch.ts";
import type { IPage } from "../constants/interfaces/user.interfaces.ts";
import type {
  IAdminCoursesQuery,
  ICatalogQuery,
  ICategory,
  IChapter,
  ICourseDetail,
  ICourseSummary,
  ICreateCourseRequest,
  ContentBlockType,
  IDifficultyCounts,
  IExamEditor,
  IExamSettings,
  IQuestionRequest,
  IUpdateCourseRequest,
} from "../constants/interfaces/courseApi.interfaces.ts";

const tags = {
  catalog: "Catalog",
  myCourses: "MyCourses",
  course: "Course",
  chapter: "Chapter",
  exam: "Exam",
  adminCourses: "AdminCourses",
} as const;

/** Endpoints of the Course & Assessment service (port 8082). */
export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: createBaseQuery(apiUrls.course),
  tagTypes: Object.values(tags),
  endpoints: (builder) => ({
    // ------------------------------------------------ public catalog

    getCategories: builder.query<ICategory[], void>({
      query: () => "/categories",
      keepUnusedDataFor: 60 * 60,
    }),

    getCatalog: builder.query<IPage<ICourseSummary>, ICatalogQuery>({
      query: (params) => ({ url: "/courses", params }),
      providesTags: [tags.catalog],
    }),

    getPublicCourse: builder.query<ICourseDetail, string>({
      query: (courseId) => `/courses/${courseId}`,
      providesTags: (_r, _e, id) => [{ type: tags.course, id }],
    }),

    /**
     * Same as getPublicCourse, but without an error toast: used for extra details (cover, teacher,
     * level...) on enrolled course cards, where a 404 (archived / disabled course) is expected.
     */
    getCourseOverview: builder.query<ICourseSummary, string>({
      query: (courseId) => `/courses/${courseId}`,
      extraOptions: { silent: true },
      transformResponse: (detail: ICourseDetail) => detail.course,
      keepUnusedDataFor: 10 * 60,
    }),

    getChapter: builder.query<IChapter, string>({
      query: (chapterId) => `/chapters/${chapterId}`,
      providesTags: (_r, _e, id) => [{ type: tags.chapter, id }],
    }),

    // ------------------------------------------------ teacher: courses and structure

    getMyCourses: builder.query<ICourseSummary[], void>({
      query: () => "/teacher/courses",
      providesTags: [tags.myCourses],
    }),

    getMyCourse: builder.query<ICourseDetail, string>({
      query: (courseId) => `/teacher/courses/${courseId}`,
      providesTags: (_r, _e, id) => [{ type: tags.course, id }],
    }),

    createCourse: builder.mutation<ICourseDetail, ICreateCourseRequest>({
      query: (body) => ({ url: "/teacher/courses", method: "POST", body }),
      invalidatesTags: [tags.myCourses],
    }),

    updateCourse: builder.mutation<
      ICourseDetail,
      { courseId: string; body: IUpdateCourseRequest }
    >({
      // PUT, not PATCH: some browser setups refuse cross-origin PATCH (partial update either way)
      query: ({ courseId, body }) => ({
        url: `/teacher/courses/${courseId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [tags.myCourses, tags.catalog],
    }),

    updateCourseCover: builder.mutation<
      ICourseDetail,
      { courseId: string; file: File }
    >({
      query: ({ courseId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/teacher/courses/${courseId}/cover`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: [tags.myCourses, tags.catalog],
    }),

    removeCourseCover: builder.mutation<ICourseDetail, string>({
      query: (courseId) => ({
        url: `/teacher/courses/${courseId}/cover`,
        method: "DELETE",
      }),
      invalidatesTags: [tags.myCourses, tags.catalog],
    }),

    publishCourse: builder.mutation<ICourseDetail, string>({
      query: (courseId) => ({
        url: `/teacher/courses/${courseId}/publish`,
        method: "POST",
      }),
      invalidatesTags: [tags.myCourses, tags.catalog],
    }),

    archiveCourse: builder.mutation<ICourseDetail, string>({
      query: (courseId) => ({
        url: `/teacher/courses/${courseId}/archive`,
        method: "POST",
      }),
      invalidatesTags: [tags.myCourses, tags.catalog],
    }),

    deleteCourse: builder.mutation<void, string>({
      query: (courseId) => ({
        url: `/teacher/courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tags.myCourses],
    }),

    addChapter: builder.mutation<
      ICourseDetail,
      { courseId: string; title: string }
    >({
      query: ({ courseId, title }) => ({
        url: `/teacher/courses/${courseId}/chapters`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: [tags.myCourses],
    }),

    addExam: builder.mutation<
      ICourseDetail,
      { courseId: string; body: IExamSettings }
    >({
      query: ({ courseId, body }) => ({
        url: `/teacher/courses/${courseId}/exams`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tags.myCourses],
    }),

    moveCourseItem: builder.mutation<
      ICourseDetail,
      { itemId: string; direction: "up" | "down" }
    >({
      query: ({ itemId, direction }) => ({
        url: `/teacher/course-items/${itemId}/move`,
        method: "POST",
        body: { direction },
      }),
    }),

    removeCourseItem: builder.mutation<ICourseDetail, string>({
      query: (itemId) => ({
        url: `/teacher/course-items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tags.myCourses],
    }),

    // ------------------------------------------------ teacher: chapter editor

    renameChapter: builder.mutation<
      IChapter,
      { chapterId: string; title: string }
    >({
      query: ({ chapterId, title }) => ({
        url: `/teacher/chapters/${chapterId}`,
        method: "PUT",
        body: { title },
      }),
    }),

    addTextBlock: builder.mutation<
      IChapter,
      {
        chapterId: string;
        blockType: ContentBlockType;
        textContent?: string;
        externalUrl?: string;
      }
    >({
      query: ({ chapterId, ...body }) => ({
        url: `/teacher/chapters/${chapterId}/blocks`,
        method: "POST",
        body,
      }),
    }),

    uploadBlock: builder.mutation<
      IChapter,
      { chapterId: string; blockType: "image" | "file"; file: File }
    >({
      query: ({ chapterId, blockType, file }) => {
        const formData = new FormData();
        formData.append("blockType", blockType);
        formData.append("file", file);
        return {
          url: `/teacher/chapters/${chapterId}/blocks/upload`,
          method: "POST",
          body: formData,
        };
      },
    }),

    updateBlock: builder.mutation<
      IChapter,
      { blockId: string; textContent?: string; externalUrl?: string }
    >({
      query: ({ blockId, ...body }) => ({
        url: `/teacher/content-blocks/${blockId}`,
        method: "PUT",
        body,
      }),
    }),

    moveBlock: builder.mutation<
      IChapter,
      { blockId: string; direction: "up" | "down" }
    >({
      query: ({ blockId, direction }) => ({
        url: `/teacher/content-blocks/${blockId}/move`,
        method: "POST",
        body: { direction },
      }),
    }),

    removeBlock: builder.mutation<IChapter, string>({
      query: (blockId) => ({
        url: `/teacher/content-blocks/${blockId}`,
        method: "DELETE",
      }),
    }),

    // ------------------------------------------------ teacher: exam editor

    getExamEditor: builder.query<IExamEditor, string>({
      query: (examId) => `/teacher/exams/${examId}`,
      providesTags: (_r, _e, id) => [{ type: tags.exam, id }],
    }),

    updateExamSettings: builder.mutation<
      IExamEditor,
      { examId: string; body: Partial<IExamSettings> }
    >({
      query: ({ examId, body }) => ({
        url: `/teacher/exams/${examId}`,
        method: "PUT",
        body,
      }),
    }),

    updateExamConfiguration: builder.mutation<
      IExamEditor,
      { examId: string; body: IDifficultyCounts }
    >({
      query: ({ examId, body }) => ({
        url: `/teacher/exams/${examId}/configuration`,
        method: "PUT",
        body,
      }),
    }),

    addQuestion: builder.mutation<
      IExamEditor,
      { examId: string; body: IQuestionRequest }
    >({
      query: ({ examId, body }) => ({
        url: `/teacher/exams/${examId}/questions`,
        method: "POST",
        body,
      }),
    }),

    updateQuestion: builder.mutation<
      IExamEditor,
      { questionId: string; body: IQuestionRequest }
    >({
      query: ({ questionId, body }) => ({
        url: `/teacher/questions/${questionId}`,
        method: "PUT",
        body,
      }),
    }),

    removeQuestion: builder.mutation<IExamEditor, string>({
      query: (questionId) => ({
        url: `/teacher/questions/${questionId}`,
        method: "DELETE",
      }),
    }),

    // ------------------------------------------------ admin

    getAdminCourses: builder.query<IPage<ICourseSummary>, IAdminCoursesQuery>({
      query: (params) => ({ url: "/admin/courses", params }),
      providesTags: [tags.adminCourses],
    }),

    getAdminCourse: builder.query<ICourseDetail, string>({
      query: (courseId) => `/admin/courses/${courseId}`,
      providesTags: (_r, _e, id) => [{ type: tags.course, id }],
    }),

    setCourseDisabled: builder.mutation<
      ICourseDetail,
      { courseId: string; disabled: boolean }
    >({
      query: ({ courseId, disabled }) => ({
        url: `/admin/courses/${courseId}/disabled`,
        method: "PUT",
        body: { disabled },
      }),
      invalidatesTags: (_r, _e, { courseId }) => [
        tags.adminCourses,
        tags.catalog,
        { type: tags.course, id: courseId },
      ],
    }),
  }),
});

/**
 * The teacher's change endpoints return the updated course / chapter / exam.
 * These helpers put that result into the matching cached query, so editors update without another request.
 */
export function useCourseCacheUpdaters() {
  const dispatch = useAppDispatch();
  return {
    setCourse: (detail: ICourseDetail) =>
      dispatch(
        courseApi.util.upsertQueryData("getMyCourse", detail.course.id, detail),
      ),
    setChapter: (chapter: IChapter) =>
      dispatch(courseApi.util.upsertQueryData("getChapter", chapter.id, chapter)),
    setExam: (exam: IExamEditor) =>
      dispatch(courseApi.util.upsertQueryData("getExamEditor", exam.id, exam)),
  };
}

export const {
  useGetCategoriesQuery,
  useGetCatalogQuery,
  useGetPublicCourseQuery,
  useGetCourseOverviewQuery,
  useGetChapterQuery,
  useGetMyCoursesQuery,
  useGetMyCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useUpdateCourseCoverMutation,
  useRemoveCourseCoverMutation,
  usePublishCourseMutation,
  useArchiveCourseMutation,
  useDeleteCourseMutation,
  useAddChapterMutation,
  useAddExamMutation,
  useMoveCourseItemMutation,
  useRemoveCourseItemMutation,
  useRenameChapterMutation,
  useAddTextBlockMutation,
  useUploadBlockMutation,
  useUpdateBlockMutation,
  useMoveBlockMutation,
  useRemoveBlockMutation,
  useGetExamEditorQuery,
  useUpdateExamSettingsMutation,
  useUpdateExamConfigurationMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useRemoveQuestionMutation,
  useGetAdminCoursesQuery,
  useGetAdminCourseQuery,
  useSetCourseDisabledMutation,
} = courseApi;
