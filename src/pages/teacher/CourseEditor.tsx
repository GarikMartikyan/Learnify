import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  List,
  message,
  Modal,
  Popconfirm,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  theme,
  Tooltip,
  Typography,
  Upload,
  type FormInstance,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileDoneOutlined,
  InboxOutlined,
  PlusOutlined,
  SaveOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { CourseStatusTag } from "../../components/courses/CourseTags.tsx";
import { CourseLanguageSelect } from "../../components/shared/CourseLanguageSelect.tsx";
import { CourseComplexitySelect } from "../../components/shared/CourseComplexitySelect.tsx";
import { routes } from "../../constants/routes.ts";
import { applyFieldErrors } from "../../api/index.api.ts";
import {
  useAddChapterMutation,
  useAddExamMutation,
  useArchiveCourseMutation,
  useCourseCacheUpdaters,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useGetCategoriesQuery,
  useGetMyCourseQuery,
  useMoveCourseItemMutation,
  usePublishCourseMutation,
  useRemoveCourseCoverMutation,
  useRemoveCourseItemMutation,
  useUpdateCourseCoverMutation,
  useUpdateCourseMutation,
} from "../../api/course.api.ts";
import type {
  CourseLanguage,
  CourseLevel,
  ICourseDetail,
  ICourseItem,
  IExamSettings,
} from "../../constants/interfaces/courseApi.interfaces.ts";

const { Text } = Typography;

/** Value of the category select that means "Other: type a new category". */
const OTHER_CATEGORY = "__other__";
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

interface CourseFormValues {
  name: string;
  description?: string;
  categoryId: string;
  newCategoryName?: string;
  language: CourseLanguage;
  level: CourseLevel;
}

/** Request body for creating / updating a course from the details form. */
function toCourseBody(values: CourseFormValues) {
  const isOther = values.categoryId === OTHER_CATEGORY;
  return {
    name: values.name,
    description: values.description ?? "",
    categoryId: isOther ? undefined : values.categoryId,
    newCategoryName: isOther ? values.newCategoryName : undefined,
    language: values.language,
    level: values.level,
  };
}

/**
 * /create-course → empty form; after saving, continues on /my-courses/:courseId.
 * /my-courses/:courseId (teacher) → details, cover image, status and the course structure.
 */
export function CourseEditor() {
  const { courseId } = useParams();
  const { formatMessage } = useIntl();
  const { data, isLoading, isError } = useGetMyCourseQuery(courseId ?? "", {
    skip: !courseId,
  });
  // Shared by the details card and the header's "Save draft" button
  const [form] = Form.useForm<CourseFormValues>();

  if (courseId && isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (courseId && (isError || !data)) {
    return <Result status="404" title={formatMessage({ id: "course-not-found" })} />;
  }

  return (
    <div>
      <EditorHeader detail={data} form={form} />
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={14}>
          <DetailsCard detail={data} form={form} />
        </Col>
        <Col xs={24} xl={10}>
          {data && <CoverCard detail={data} />}
        </Col>
        {data && (
          <Col xs={24}>
            <StructureCard detail={data} />
          </Col>
        )}
      </Row>
    </div>
  );
}

// ------------------------------------------------------------------ header: title, status, actions

function EditorHeader({
  detail,
  form,
}: {
  detail?: ICourseDetail;
  form: FormInstance<CourseFormValues>;
}) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { setCourse } = useCourseCacheUpdaters();
  const [publish, { isLoading: isPublishing }] = usePublishCourseMutation();
  const [archive, { isLoading: isArchiving }] = useArchiveCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse, { isLoading: isSavingDraft }] = useUpdateCourseMutation();
  const course = detail?.course;

  /** Saves the details form (the structure is saved as it is edited) and goes back to My Courses. */
  const handleSaveDraft = async () => {
    if (!course) return;
    let values: CourseFormValues;
    try {
      values = await form.validateFields();
    } catch {
      return; // The form shows what is missing
    }
    try {
      setCourse(await updateCourse({ courseId: course.id, body: toCourseBody(values) }).unwrap());
      message.success(formatMessage({ id: "draft-saved" }));
      navigate(routes.myCourses);
    } catch (error) {
      applyFieldErrors(form, error);
    }
  };

  const run = async (action: () => Promise<ICourseDetail>, successId: string) => {
    try {
      setCourse(await action());
      message.success(formatMessage({ id: successId }));
    } catch {
      // The error message (e.g. why publishing is not possible) is shown as a toast
    }
  };

  const handleDelete = async () => {
    if (!course) return;
    try {
      await deleteCourse(course.id).unwrap();
      message.success(formatMessage({ id: "course-deleted" }));
      navigate(routes.myCourses);
    } catch {
      // The error message is shown as a toast by the base query
    }
  };

  return (
    <Flex justify="space-between" align="center" wrap gap={12} style={{ marginBottom: 8 }}>
      <Space align="center" wrap>
        <PageTitle showBackButton backRoute={routes.myCourses} wrapperProps={{ style: { marginBottom: 0 } }}>
          {course ? course.name : formatMessage({ id: "create-course" })}
        </PageTitle>
        {course && <CourseStatusTag status={course.status} disabled={course.disabled} />}
      </Space>
      {course && (
        <Space wrap>
          {course.status === "published" && !course.disabled && (
            <Button icon={<EyeOutlined />} onClick={() => navigate(routes.courseById(course.id))}>
              {formatMessage({ id: "view" })}
            </Button>
          )}
          {course.status === "draft" && (
            <Button icon={<SaveOutlined />} loading={isSavingDraft} onClick={handleSaveDraft}>
              {formatMessage({ id: "save-draft" })}
            </Button>
          )}
          {course.status !== "published" && (
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={isPublishing}
              onClick={() => run(() => publish(course.id).unwrap(), "course-published")}
            >
              {formatMessage({ id: "publish" })}
            </Button>
          )}
          {course.status === "published" && (
            <Popconfirm
              title={formatMessage({ id: "archive-course-confirm" })}
              okText={formatMessage({ id: "yes" })}
              cancelText={formatMessage({ id: "no" })}
              onConfirm={() => run(() => archive(course.id).unwrap(), "course-archived")}
            >
              <Button icon={<InboxOutlined />} loading={isArchiving}>
                {formatMessage({ id: "archive" })}
              </Button>
            </Popconfirm>
          )}
          {course.status === "draft" && (
            <Popconfirm
              title={formatMessage({ id: "delete-course-confirm" })}
              okText={formatMessage({ id: "yes" })}
              cancelText={formatMessage({ id: "no" })}
              onConfirm={handleDelete}
            >
              <Button danger icon={<DeleteOutlined />}>
                {formatMessage({ id: "delete" })}
              </Button>
            </Popconfirm>
          )}
        </Space>
      )}
    </Flex>
  );
}

// ------------------------------------------------------------------ details form

function DetailsCard({
  detail,
  form,
}: {
  detail?: ICourseDetail;
  form: FormInstance<CourseFormValues>;
}) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { setCourse } = useCourseCacheUpdaters();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const categoryId = Form.useWatch("categoryId", form);
  const course = detail?.course;

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        name: course.name,
        description: course.description ?? "",
        categoryId: course.category?.id,
        newCategoryName: undefined,
        language: course.language,
        level: course.level,
      });
    }
  }, [course, form]);

  // The course's own pending custom category is not in the approved list: show it too
  const categoryOptions = [
    ...categories.map((c) => ({ value: c.id, label: c.name })),
    ...(course?.category && !course.category.approved
      ? [
          {
            value: course.category.id,
            label: `${course.category.name} (${formatMessage({ id: "pending-approval" })})`,
          },
        ]
      : []),
    { value: OTHER_CATEGORY, label: formatMessage({ id: "category-other" }) },
  ];

  const handleSave = async (values: CourseFormValues) => {
    const body = toCourseBody(values);
    try {
      if (course) {
        setCourse(await updateCourse({ courseId: course.id, body }).unwrap());
        message.success(formatMessage({ id: "course-saved" }));
      } else {
        const created = await createCourse(body).unwrap();
        setCourse(created);
        message.success(formatMessage({ id: "course-created" }));
        navigate(routes.myCourseById(created.course.id), { replace: true });
      }
    } catch (error) {
      applyFieldErrors(form, error);
    }
  };

  return (
    <Card title={formatMessage({ id: "course-details" })} style={{ borderRadius: 12 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{ language: "en", level: "beginner" }}
      >
        <Form.Item
          name="name"
          label={formatMessage({ id: "course-name" })}
          rules={[
            { required: true, whitespace: true, message: formatMessage({ id: "course-name-required" }) },
            { max: 200 },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label={formatMessage({ id: "description" })}>
          <Input.TextArea rows={4} maxLength={5000} showCount />
        </Form.Item>
        <Row gutter={12}>
          <Col xs={24} md={8}>
            <Form.Item
              name="categoryId"
              label={formatMessage({ id: "category" })}
              rules={[{ required: true, message: formatMessage({ id: "category-required" }) }]}
            >
              <Select showSearch optionFilterProp="label" options={categoryOptions} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="language" label={formatMessage({ id: "language" })} rules={[{ required: true }]}>
              <CourseLanguageSelect />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="level" label={formatMessage({ id: "level" })} rules={[{ required: true }]}>
              <CourseComplexitySelect />
            </Form.Item>
          </Col>
        </Row>
        {categoryId === OTHER_CATEGORY && (
          <Form.Item
            name="newCategoryName"
            label={formatMessage({ id: "new-category" })}
            extra={formatMessage({ id: "new-category-hint" })}
            rules={[
              { required: true, whitespace: true, message: formatMessage({ id: "category-required" }) },
              { max: 100 },
            ]}
          >
            <Input />
          </Form.Item>
        )}
        <Flex justify="end">
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isCreating || isUpdating}>
            {formatMessage({ id: course ? "save-changes" : "create-course" })}
          </Button>
        </Flex>
      </Form>
    </Card>
  );
}

// ------------------------------------------------------------------ cover image

function CoverCard({ detail }: { detail: ICourseDetail }) {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  const { setCourse } = useCourseCacheUpdaters();
  const [updateCover, { isLoading: isUploading }] = useUpdateCourseCoverMutation();
  const [removeCover, { isLoading: isRemoving }] = useRemoveCourseCoverMutation();
  const { course } = detail;

  const handleUpload = async (file: File) => {
    if (!IMAGE_TYPES.includes(file.type)) {
      message.error(formatMessage({ id: "image-rules" }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      message.error(formatMessage({ id: "image-too-large" }));
      return;
    }
    try {
      setCourse(await updateCover({ courseId: course.id, file }).unwrap());
      message.success(formatMessage({ id: "cover-updated" }));
    } catch {
      // The error message is shown as a toast by the base query
    }
  };

  return (
    <Card title={formatMessage({ id: "cover-image" })} style={{ borderRadius: 12, height: "100%" }}>
      <Flex vertical gap="middle">
        {course.coverImageUrl ? (
          <Image src={course.coverImageUrl} style={{ aspectRatio: "16/9", objectFit: "cover" }} />
        ) : (
          <Flex
            align="center"
            justify="center"
            style={{ aspectRatio: "16/9", background: token.colorFillTertiary, borderRadius: 8 }}
          >
            <Text type="secondary">{formatMessage({ id: "no-cover-image" })}</Text>
          </Flex>
        )}
        <Space wrap>
          <Upload
            accept={IMAGE_TYPES.join(",")}
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} loading={isUploading}>
              {formatMessage({ id: "upload-cover" })}
            </Button>
          </Upload>
          {course.coverImageUrl && (
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={isRemoving}
              onClick={async () => {
                try {
                  setCourse(await removeCover(course.id).unwrap());
                } catch {
                  // The error message is shown as a toast by the base query
                }
              }}
            >
              {formatMessage({ id: "remove" })}
            </Button>
          )}
        </Space>
        <Text type="secondary">{formatMessage({ id: "image-rules" })}</Text>
      </Flex>
    </Card>
  );
}

// ------------------------------------------------------------------ structure: chapters and exams

function StructureCard({ detail }: { detail: ICourseDetail }) {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const { setCourse } = useCourseCacheUpdaters();
  const [moveItem] = useMoveCourseItemMutation();
  const [removeItem] = useRemoveCourseItemMutation();
  const [addChapter, { isLoading: isAddingChapter }] = useAddChapterMutation();
  const [addExam, { isLoading: isAddingExam }] = useAddExamMutation();
  const [modal, setModal] = useState<"chapter" | "exam" | null>(null);
  const [chapterForm] = Form.useForm<{ title: string }>();
  const [examForm] = Form.useForm<IExamSettings>();
  const { course, items } = detail;

  const run = async (action: () => Promise<ICourseDetail>) => {
    try {
      setCourse(await action());
      return true;
    } catch {
      // The error message is shown as a toast by the base query
      return false;
    }
  };

  const openEditor = (item: ICourseItem) => {
    if (item.itemType === "chapter" && item.chapterId) {
      navigate(routes.editChapter(item.chapterId));
    } else if (item.examId) {
      navigate(routes.editExam(item.examId));
    }
  };

  const submitChapter = async ({ title }: { title: string }) => {
    if (await run(() => addChapter({ courseId: course.id, title }).unwrap())) {
      chapterForm.resetFields();
      setModal(null);
    }
  };

  const submitExam = async (values: IExamSettings) => {
    if (await run(() => addExam({ courseId: course.id, body: values }).unwrap())) {
      examForm.resetFields();
      setModal(null);
    }
  };

  return (
    <Card
      title={formatMessage({ id: "course-content" })}
      style={{ borderRadius: 12 }}
      extra={
        <Space wrap>
          <Button icon={<PlusOutlined />} onClick={() => setModal("chapter")}>
            {formatMessage({ id: "add-chapter" })}
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => setModal("exam")}>
            {formatMessage({ id: "add-exam" })}
          </Button>
        </Space>
      }
    >
      {items.length === 0 ? (
        <Empty description={formatMessage({ id: "no-course-items-teacher" })} />
      ) : (
        <List
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Tooltip key="up" title={formatMessage({ id: "move-up" })}>
                  <Button
                    icon={<ArrowUpOutlined />}
                    disabled={index === 0}
                    onClick={() => run(() => moveItem({ itemId: item.id, direction: "up" }).unwrap())}
                  />
                </Tooltip>,
                <Tooltip key="down" title={formatMessage({ id: "move-down" })}>
                  <Button
                    icon={<ArrowDownOutlined />}
                    disabled={index === items.length - 1}
                    onClick={() => run(() => moveItem({ itemId: item.id, direction: "down" }).unwrap())}
                  />
                </Tooltip>,
                <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => openEditor(item)}>
                  {formatMessage({ id: "edit" })}
                </Button>,
                <Popconfirm
                  key="remove"
                  title={formatMessage({ id: "remove-item-confirm" })}
                  okText={formatMessage({ id: "yes" })}
                  cancelText={formatMessage({ id: "no" })}
                  onConfirm={() => run(() => removeItem(item.id).unwrap())}
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  item.itemType === "chapter" ? (
                    <BookOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
                  ) : (
                    <FileDoneOutlined style={{ fontSize: 20, color: token.colorWarning }} />
                  )
                }
                title={`${index + 1}. ${item.title}`}
                description={
                  <Space size={4}>
                    <Tag color={item.itemType === "chapter" ? "blue" : "orange"}>
                      {formatMessage({ id: item.itemType })}
                    </Tag>
                    {item.disabled && <Tag color="red">{formatMessage({ id: "disabled" })}</Tag>}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}

      <Modal
        open={modal === "chapter"}
        title={formatMessage({ id: "add-chapter" })}
        okText={formatMessage({ id: "add" })}
        cancelText={formatMessage({ id: "cancel" })}
        confirmLoading={isAddingChapter}
        onOk={() => chapterForm.submit()}
        onCancel={() => setModal(null)}
        destroyOnHidden
      >
        <Form form={chapterForm} layout="vertical" onFinish={submitChapter}>
          <Form.Item
            name="title"
            label={formatMessage({ id: "chapter-title" })}
            rules={[{ required: true, whitespace: true, message: formatMessage({ id: "title-required" }) }, { max: 200 }]}
          >
            <Input autoFocus />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={modal === "exam"}
        title={formatMessage({ id: "add-exam" })}
        okText={formatMessage({ id: "add" })}
        cancelText={formatMessage({ id: "cancel" })}
        confirmLoading={isAddingExam}
        onOk={() => examForm.submit()}
        onCancel={() => setModal(null)}
        destroyOnHidden
      >
        <Form
          form={examForm}
          layout="vertical"
          onFinish={submitExam}
          initialValues={{ durationMinutes: 30, passingPercentage: 60 }}
        >
          <Form.Item
            name="title"
            label={formatMessage({ id: "exam-title" })}
            rules={[{ required: true, whitespace: true, message: formatMessage({ id: "title-required" }) }, { max: 200 }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="durationMinutes" label={formatMessage({ id: "duration-minutes" })} rules={[{ required: true }]}>
                <InputNumber min={1} max={600} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="passingPercentage" label={formatMessage({ id: "passing-percentage" })} rules={[{ required: true }]}>
                <InputNumber min={1} max={100} addonAfter="%" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
}
