import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { useParams } from "react-router";

const { Title } = Typography;

interface ExamQuestion {
  id: number;
  type: "true_false" | "multiple_choice";
  question: string;
  options?: string[];
  correctAnswer?: string;
}

export function CreateExamPage() {
  const { examId } = useParams();
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);

  useEffect(() => {
    if (examId) {
      // Example placeholder data
      const placeholderData = {
        title: "JavaScript Basics Exam",
        duration: 60,
        questions: [
          {
            id: Date.now() + 1,
            type: "true_false" as const,
            question: "JavaScript is a compiled language?",
            correctAnswer: "false",
          },
          {
            id: Date.now() + 2,
            type: "multiple_choice" as const,
            question: "Which of these are JavaScript data types?",
            options: ["String", "Number", "Boolean", "All of the above"],
            correctAnswer: "option4",
          },
        ],
      };

      // Set form fields
      form.setFieldsValue({
        title: placeholderData.title,
        duration: placeholderData.duration,
        questions: placeholderData.questions.map((q) => ({
          question: q.question,
          type: q.type,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
      });

      // Set questions state
      setQuestions(placeholderData.questions);
    }
  }, [examId, form]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "true_false",
        question: "",
        options: ["", "", "", ""],
      },
    ]);
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Exam data:", values);
      message.success("Exam saved successfully!");
    } catch {
      message.error("Please fill all required fields!");
    }
  };

  return (
    <Card
      title={
        <Title level={3}>{examId ? "Edit Exam" : "Create New Exam"}</Title>
      }
      style={{ borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Exam Title"
              name="title"
              rules={[{ required: true, message: "Please enter exam title" }]}
            >
              <Input placeholder="e.g. JavaScript Basics Exam" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Duration (minutes)"
              name="duration"
              rules={[{ required: true, message: "Please enter duration" }]}
            >
              <Input type="number" placeholder="e.g. 60" />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {questions.map((q, index) => (
            <Card
              key={q.id}
              type="inner"
              title={`Question ${index + 1}`}
              extra={
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeQuestion(q.id)}
                >
                  Remove
                </Button>
              }
              style={{ borderRadius: 12 }}
            >
              <Form.Item
                label="Question Text"
                name={["questions", index, "question"]}
                rules={[{ required: true, message: "Enter question text" }]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Type your question..."
                  value={q.question}
                />
              </Form.Item>

              <Form.Item
                label="Question Type"
                name={["questions", index, "type"]}
              >
                <Select
                  defaultValue={q.type}
                  onChange={(type) => {
                    setQuestions((prev) =>
                      prev.map((item) =>
                        item.id === q.id
                          ? {
                              ...item,
                              type,
                              options:
                                type === "multiple_choice"
                                  ? ["", "", "", ""]
                                  : undefined,
                              correctAnswer: undefined,
                            }
                          : item,
                      ),
                    );
                  }}
                  options={[
                    { value: "true_false", label: "True / False" },
                    {
                      value: "multiple_choice",
                      label: "Multiple Choice (4 options)",
                    },
                  ]}
                />
              </Form.Item>

              {q.type === "true_false" ? (
                <Form.Item
                  label="Correct Answer"
                  name={["questions", index, "correctAnswer"]}
                  rules={[{ required: true, message: "Select correct answer" }]}
                >
                  <Radio.Group>
                    <Radio value="true">True</Radio>
                    <Radio value="false">False</Radio>
                  </Radio.Group>
                </Form.Item>
              ) : (
                <>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Form.Item
                      key={i}
                      label={`Option ${i + 1}`}
                      name={["questions", index, "options", i]}
                      rules={[{ required: true, message: "Enter option text" }]}
                    >
                      <Input placeholder={`Option ${i + 1}`} />
                    </Form.Item>
                  ))}
                  <Form.Item
                    label="Correct Answer"
                    name={["questions", index, "correctAnswer"]}
                    rules={[
                      { required: true, message: "Select correct option" },
                    ]}
                  >
                    <Select
                      placeholder="Select correct option"
                      options={Array.from({ length: 4 }).map((_, i) => ({
                        value: `option${i + 1}`,
                        label: `Option ${i + 1}`,
                      }))}
                    />
                  </Form.Item>
                </>
              )}
            </Card>
          ))}

          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={addQuestion}
            style={{ borderRadius: 8 }}
          >
            Add Question
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
            Save Exam
          </Button>
        </Space>
      </Form>
    </Card>
  );
}
