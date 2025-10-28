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
} from "antd";
import type { IExam } from "../constants/interfaces/exam.interfaces.ts";
import { PageTitle } from "../components/shared/PageTitle.tsx";

const { Title, Paragraph } = Typography;

interface ExamPageProps {
  exam: IExam;
}

export function ExamPage({ exam }: ExamPageProps) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    // console.log("Exam answers:", values);
    message.success("Your answers have been submitted!");
  };

  return (
    <div>
      <PageTitle showBackButton>{exam.title}</PageTitle>
      <Paragraph>Duration: {exam.durationMinutes} minutes</Paragraph>
      <Divider />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {exam.questions.map((q, index) => (
          <Card
            key={index}
            style={{ marginBottom: 24, borderRadius: 12 }}
            type="inner"
          >
            <Title level={5}>
              {index + 1}. {q.question}
            </Title>

            {q.type === "multiple-choice" && q.options && (
              <Form.Item
                name={`q-${index}`}
                rules={[{ required: true, message: "Please select an answer" }]}
              >
                <Radio.Group>
                  <Space>
                    {q.options.map((opt, i) => (
                      <Radio key={i} value={opt}>
                        {opt}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>
            )}

            {q.type === "true-false" && (
              <Form.Item
                name={`q-${index}`}
                rules={[
                  { required: true, message: "Please select True or False" },
                ]}
              >
                <Radio.Group>
                  <Radio value="true">True</Radio>
                  <Radio value="false">False</Radio>
                </Radio.Group>
              </Form.Item>
            )}

            {q.type === "text" && (
              <Form.Item
                name={`q-${index}`}
                rules={[
                  { required: true, message: "Please provide your answer" },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Type your answer here..."
                />
              </Form.Item>
            )}
          </Card>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" htmlType="submit" style={{ minWidth: 140 }}>
            Submit Exam
          </Button>
        </div>
      </Form>
    </div>
  );
}
