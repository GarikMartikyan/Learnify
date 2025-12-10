import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Radio,
  Space,
  Typography,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router";

const { Title } = Typography;

type ChapterElementType = "youtube" | "paragraph" | "image";

interface ChapterElement {
  id: number;
  type: ChapterElementType;
  content?: string;
  imageFile?: any;
  imageUrl?: string;
}

export function CreateChapter() {
  const { chapterId } = useParams();
  const [form] = Form.useForm();
  const [elements, setElements] = useState<ChapterElement[]>([]);

  useEffect(() => {
    if (chapterId) {
      const placeholderData = {
        title: "Introduction to React",
        elements: [
          {
            id: Date.now() + 1,
            type: "paragraph" as const,
            content:
              "React is a JavaScript library for building user interfaces.",
          },
          {
            id: Date.now() + 2,
            type: "youtube" as const,
            content: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
          },
          {
            id: Date.now() + 3,
            type: "image" as const,
            imageUrl: "https://reactjs.org/logo-og.png",
          },
        ],
      };

      form.setFieldsValue({
        title: placeholderData.title,
        elements: placeholderData.elements.map((el) => ({
          type: el.type,
          content: el.content,
          imageUrl: el.imageUrl,
        })),
      });

      // Set elements state
      setElements(placeholderData.elements);
    }
  }, [chapterId, form]);

  const addElement = () => {
    setElements((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "paragraph",
        content: "",
      },
    ]);
  };

  const removeElement = (id: number) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Chapter data:", values);
      message.success("Chapter saved successfully!");
    } catch {
      message.error("Please fill all required fields!");
    }
  };

  return (
    <Card
      title={
        <Title level={3}>{chapterId ? "Edit Chapter" : "Create Chapter"}</Title>
      }
      style={{ borderRadius: 16 }}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Chapter Title"
          name="title"
          rules={[{ required: true, message: "Please enter chapter title" }]}
        >
          <Input placeholder="e.g. Introduction to React" />
        </Form.Item>

        <Divider />

        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {elements.map((el, index) => (
            <Card
              key={el.id}
              type="inner"
              title={`Element ${index + 1}`}
              extra={
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeElement(el.id)}
                >
                  Remove
                </Button>
              }
              style={{ borderRadius: 12 }}
            >
              <Form.Item
                label="Element Type"
                name={["elements", index, "type"]}
              >
                <Radio.Group
                  value={el.type}
                  onChange={(e) => {
                    const type = e.target.value as ChapterElementType;
                    setElements((prev) =>
                      prev.map((item) =>
                        item.id === el.id
                          ? {
                              ...item,
                              type,
                              content: "",
                              imageFile: undefined,
                              imageUrl: "",
                            }
                          : item,
                      ),
                    );
                  }}
                >
                  <Radio value="paragraph">Paragraph</Radio>
                  <Radio value="youtube">YouTube Link</Radio>
                  <Radio value="image">Image</Radio>
                </Radio.Group>
              </Form.Item>

              {el.type === "paragraph" && (
                <Form.Item
                  label="Paragraph Text"
                  name={["elements", index, "content"]}
                  rules={[{ required: true, message: "Enter paragraph text" }]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Type your paragraph..."
                  />
                </Form.Item>
              )}

              {el.type === "youtube" && (
                <Form.Item
                  label="YouTube Link"
                  name={["elements", index, "content"]}
                  rules={[{ required: true, message: "Enter YouTube link" }]}
                >
                  <Input placeholder="https://www.youtube.com/watch?v=..." />
                </Form.Item>
              )}

              {el.type === "image" && (
                <>
                  <Form.Item
                    label="Image Link"
                    name={["elements", index, "imageUrl"]}
                  >
                    <Input placeholder="https://example.com/image.jpg" />
                  </Form.Item>

                  <Form.Item
                    label="Or Upload Image"
                    name={["elements", index, "imageFile"]}
                  >
                    <Upload
                      beforeUpload={(file) => {
                        setElements((prev) =>
                          prev.map((item) =>
                            item.id === el.id
                              ? { ...item, imageFile: file }
                              : item,
                          ),
                        );
                        return false; // Prevent auto upload
                      }}
                      maxCount={1}
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>
                </>
              )}
            </Card>
          ))}

          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={addElement}
            style={{ borderRadius: 8 }}
          >
            Add Element
          </Button>
        </Space>

        <Divider />

        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={() => form.resetFields()}>Cancel</Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            style={{ borderRadius: 8 }}
          >
            Save Chapter
          </Button>
        </Space>
      </Form>
    </Card>
  );
}
