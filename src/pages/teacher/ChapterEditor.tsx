import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Empty,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Result,
  Segmented,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
  Upload,
  type FormInstance,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { ContentBlockView } from "../../components/courses/ContentBlockView.tsx";
import { routes } from "../../constants/routes.ts";
import {
  useAddTextBlockMutation,
  useCourseCacheUpdaters,
  useGetChapterQuery,
  useMoveBlockMutation,
  useRemoveBlockMutation,
  useRenameChapterMutation,
  useUpdateBlockMutation,
  useUploadBlockMutation,
} from "../../api/course.api.ts";
import type {
  ContentBlockType,
  IChapter,
  IContentBlock,
} from "../../constants/interfaces/courseApi.interfaces.ts";

const { Text } = Typography;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const BLOCK_TYPES: ContentBlockType[] = ["heading", "text", "image", "file", "youtube", "external_link"];

const isTextType = (type: ContentBlockType) => type === "heading" || type === "text";
const isUploadType = (type: ContentBlockType) => type === "image" || type === "file";

/** /edit-chapter/:chapterId — the chapter title and its ordered content blocks. */
export function ChapterEditor() {
  const { chapterId = "" } = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { data: chapter, isLoading, isError } = useGetChapterQuery(chapterId);

  if (isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (isError || !chapter || !chapter.canEdit) {
    return <Result status="404" title={formatMessage({ id: "chapter-not-found" })} />;
  }

  return (
    <div>
      <Flex justify="space-between" align="center" wrap gap={12}>
        <PageTitle showBackButton backRoute={routes.myCourseById(chapter.courseId)}>
          {chapter.courseName}
        </PageTitle>
        <Button icon={<EyeOutlined />} onClick={() => navigate(routes.chapterById(chapter.id))}>
          {formatMessage({ id: "preview" })}
        </Button>
      </Flex>
      <Flex vertical gap="large">
        <TitleCard chapter={chapter} />
        <BlocksCard chapter={chapter} />
      </Flex>
    </div>
  );
}

function TitleCard({ chapter }: { chapter: IChapter }) {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm<{ title: string }>();
  const { setChapter } = useCourseCacheUpdaters();
  const [rename, { isLoading }] = useRenameChapterMutation();

  useEffect(() => {
    form.setFieldsValue({ title: chapter.title });
  }, [chapter.title, form]);

  return (
    <Card style={{ borderRadius: 12 }}>
      <Form
        form={form}
        layout="inline"
        onFinish={async ({ title }) => {
          try {
            setChapter(await rename({ chapterId: chapter.id, title }).unwrap());
            message.success(formatMessage({ id: "chapter-saved" }));
          } catch {
            // The error message is shown as a toast by the base query
          }
        }}
        style={{ width: "100%" }}
      >
        <Form.Item
          name="title"
          label={formatMessage({ id: "chapter-title" })}
          rules={[{ required: true, whitespace: true, message: formatMessage({ id: "title-required" }) }, { max: 200 }]}
          style={{ flex: 1 }}
        >
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
          {formatMessage({ id: "save" })}
        </Button>
      </Form>
    </Card>
  );
}

function BlocksCard({ chapter }: { chapter: IChapter }) {
  const { formatMessage } = useIntl();
  const { setChapter } = useCourseCacheUpdaters();
  const [moveBlock] = useMoveBlockMutation();
  const [removeBlock] = useRemoveBlockMutation();
  const [editing, setEditing] = useState<IContentBlock | null>(null);
  const [adding, setAdding] = useState(false);
  const blocks = chapter.blocks;

  const run = async (action: () => Promise<IChapter>) => {
    try {
      setChapter(await action());
      return true;
    } catch {
      // The error message is shown as a toast by the base query
      return false;
    }
  };

  return (
    <Card
      title={formatMessage({ id: "chapter-content" })}
      style={{ borderRadius: 12 }}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAdding(true)}>
          {formatMessage({ id: "add-block" })}
        </Button>
      }
    >
      {blocks.length === 0 ? (
        <Empty description={formatMessage({ id: "no-blocks" })} />
      ) : (
        <Flex vertical gap="middle">
          {blocks.map((block, index) => (
            <Card
              key={block.id}
              size="small"
              type="inner"
              title={
                <Space>
                  <Tag>{formatMessage({ id: `block-type-${block.blockType}` })}</Tag>
                  {block.disabled && <Tag color="red">{formatMessage({ id: "disabled" })}</Tag>}
                </Space>
              }
              extra={
                <Space>
                  <Tooltip title={formatMessage({ id: "move-up" })}>
                    <Button
                      size="small"
                      icon={<ArrowUpOutlined />}
                      disabled={index === 0}
                      onClick={() => run(() => moveBlock({ blockId: block.id, direction: "up" }).unwrap())}
                    />
                  </Tooltip>
                  <Tooltip title={formatMessage({ id: "move-down" })}>
                    <Button
                      size="small"
                      icon={<ArrowDownOutlined />}
                      disabled={index === blocks.length - 1}
                      onClick={() => run(() => moveBlock({ blockId: block.id, direction: "down" }).unwrap())}
                    />
                  </Tooltip>
                  {!isUploadType(block.blockType) && (
                    <Button size="small" icon={<EditOutlined />} onClick={() => setEditing(block)} />
                  )}
                  <Popconfirm
                    title={formatMessage({ id: "remove-block-confirm" })}
                    okText={formatMessage({ id: "yes" })}
                    cancelText={formatMessage({ id: "no" })}
                    onConfirm={() => run(() => removeBlock(block.id).unwrap())}
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              }
            >
              <ContentBlockView block={block} />
            </Card>
          ))}
        </Flex>
      )}

      {adding && (
        <AddBlockModal chapterId={chapter.id} onDone={(c) => { setChapter(c); setAdding(false); }} onCancel={() => setAdding(false)} />
      )}
      {editing && (
        <EditBlockModal block={editing} onDone={(c) => { setChapter(c); setEditing(null); }} onCancel={() => setEditing(null)} />
      )}
    </Card>
  );
}

/** Pick a block type, then enter its text / link, or choose its file. */
function AddBlockModal({
  chapterId,
  onDone,
  onCancel,
}: {
  chapterId: string;
  onDone: (chapter: IChapter) => void;
  onCancel: () => void;
}) {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm<{ textContent?: string; externalUrl?: string }>();
  const [type, setType] = useState<ContentBlockType>("text");
  const [file, setFile] = useState<File | null>(null);
  const [addTextBlock, { isLoading: isAdding }] = useAddTextBlockMutation();
  const [uploadBlock, { isLoading: isUploading }] = useUploadBlockMutation();

  const accept = type === "image" ? IMAGE_TYPES : FILE_TYPES;
  const maxSize = type === "image" ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;

  const submit = async () => {
    try {
      if (isUploadType(type)) {
        if (!file) {
          message.error(formatMessage({ id: "choose-file" }));
          return;
        }
        onDone(await uploadBlock({ chapterId, blockType: type as "image" | "file", file }).unwrap());
      } else {
        const values = await form.validateFields();
        onDone(await addTextBlock({ chapterId, blockType: type, ...values }).unwrap());
      }
    } catch {
      // Validation errors are shown under the fields; server errors as a toast
    }
  };

  return (
    <Modal
      open
      title={formatMessage({ id: "add-block" })}
      okText={formatMessage({ id: "add" })}
      cancelText={formatMessage({ id: "cancel" })}
      confirmLoading={isAdding || isUploading}
      onOk={submit}
      onCancel={onCancel}
      width={640}
    >
      <Segmented
        block
        value={type}
        onChange={(value) => {
          setType(value as ContentBlockType);
          setFile(null);
          form.resetFields();
        }}
        options={BLOCK_TYPES.map((t) => ({ value: t, label: formatMessage({ id: `block-type-${t}` }) }))}
        style={{ marginBottom: 16 }}
      />
      {isUploadType(type) ? (
        <Flex vertical gap="small">
          <Upload
            accept={accept.join(",")}
            maxCount={1}
            beforeUpload={(chosen) => {
              if (!accept.includes(chosen.type)) {
                message.error(formatMessage({ id: type === "image" ? "image-rules" : "file-rules" }));
                return Upload.LIST_IGNORE;
              }
              if (chosen.size > maxSize) {
                message.error(formatMessage({ id: type === "image" ? "image-too-large" : "file-too-large" }));
                return Upload.LIST_IGNORE;
              }
              setFile(chosen);
              return false;
            }}
            onRemove={() => setFile(null)}
          >
            <Button icon={<UploadOutlined />}>{formatMessage({ id: "choose-file" })}</Button>
          </Upload>
          <Text type="secondary">{formatMessage({ id: type === "image" ? "image-rules" : "file-rules" })}</Text>
        </Flex>
      ) : (
        <BlockFields type={type} form={form} />
      )}
    </Modal>
  );
}

function EditBlockModal({
  block,
  onDone,
  onCancel,
}: {
  block: IContentBlock;
  onDone: (chapter: IChapter) => void;
  onCancel: () => void;
}) {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm<{ textContent?: string; externalUrl?: string }>();
  const [updateBlock, { isLoading }] = useUpdateBlockMutation();

  return (
    <Modal
      open
      title={formatMessage({ id: "edit-block" })}
      okText={formatMessage({ id: "save" })}
      cancelText={formatMessage({ id: "cancel" })}
      confirmLoading={isLoading}
      onCancel={onCancel}
      onOk={async () => {
        try {
          const values = await form.validateFields();
          onDone(await updateBlock({ blockId: block.id, ...values }).unwrap());
        } catch {
          // Validation errors are shown under the fields; server errors as a toast
        }
      }}
      width={640}
    >
      <BlockFields
        type={block.blockType}
        form={form}
        initialValues={{ textContent: block.textContent ?? undefined, externalUrl: block.externalUrl ?? undefined }}
      />
    </Modal>
  );
}

/** The text field (heading / text) or the link field (youtube / external_link) of a block. */
function BlockFields({
  type,
  form,
  initialValues,
}: {
  type: ContentBlockType;
  form: FormInstance<{ textContent?: string; externalUrl?: string }>;
  initialValues?: { textContent?: string; externalUrl?: string };
}) {
  const { formatMessage } = useIntl();
  return (
    <Form form={form} layout="vertical" initialValues={initialValues}>
      {isTextType(type) ? (
        <Form.Item
          name="textContent"
          label={formatMessage({ id: type === "heading" ? "heading" : "text" })}
          rules={[
            { required: true, whitespace: true, message: formatMessage({ id: "text-required" }) },
            { max: type === "heading" ? 200 : 20000 },
          ]}
        >
          {type === "heading" ? <Input /> : <Input.TextArea rows={6} />}
        </Form.Item>
      ) : (
        <Form.Item
          name="externalUrl"
          label={formatMessage({ id: type === "youtube" ? "youtube-link" : "link" })}
          rules={[
            { required: true, message: formatMessage({ id: "link-required" }) },
            { type: "url", message: formatMessage({ id: "link-invalid" }) },
          ]}
        >
          <Input
            placeholder={type === "youtube" ? "https://www.youtube.com/watch?v=…" : "https://…"}
          />
        </Form.Item>
      )}
    </Form>
  );
}
