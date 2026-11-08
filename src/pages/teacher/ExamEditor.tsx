import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Modal,
  Popconfirm,
  Radio,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
  type FormInstance,
} from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useParams } from "react-router";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { routes } from "../../constants/routes.ts";
import {
  useAddQuestionMutation,
  useCourseCacheUpdaters,
  useGetExamEditorQuery,
  useRemoveQuestionMutation,
  useUpdateExamConfigurationMutation,
  useUpdateExamSettingsMutation,
  useUpdateQuestionMutation,
} from "../../api/course.api.ts";
import type {
  IDifficultyCounts,
  IExamEditor,
  IExamSettings,
  IQuestion,
  IQuestionOption,
  IQuestionRequest,
  QuestionDifficulty,
  QuestionType,
} from "../../constants/interfaces/courseApi.interfaces.ts";

const { Text, Paragraph } = Typography;

const DIFFICULTIES: QuestionDifficulty[] = ["easy", "medium", "hard"];
const QUESTION_TYPES: QuestionType[] = ["true_false", "single_choice", "multiple_choice", "short_answer"];
const difficultyColors: Record<QuestionDifficulty, string> = { easy: "green", medium: "gold", hard: "red" };

/** /edit-exam/:examId — exam settings, the question pool and how many questions an attempt gets. */
export function ExamEditor() {
  const { examId = "" } = useParams();
  const { formatMessage } = useIntl();
  const { data: exam, isLoading, isError } = useGetExamEditorQuery(examId);

  if (isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (isError || !exam) {
    return <Result status="404" title={formatMessage({ id: "exam-not-found" })} />;
  }

  return (
    <div>
      <PageTitle showBackButton backRoute={routes.myCourseById(exam.courseId)}>
        {exam.courseName}
      </PageTitle>
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={12}>
          <SettingsCard exam={exam} />
        </Col>
        <Col xs={24} xl={12}>
          <ConfigurationCard exam={exam} />
        </Col>
        <Col xs={24}>
          <QuestionsCard exam={exam} />
        </Col>
      </Row>
    </div>
  );
}

// ------------------------------------------------------------------ settings

function SettingsCard({ exam }: { exam: IExamEditor }) {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm<IExamSettings>();
  const { setExam } = useCourseCacheUpdaters();
  const [updateSettings, { isLoading }] = useUpdateExamSettingsMutation();

  useEffect(() => {
    form.setFieldsValue({
      title: exam.title,
      durationMinutes: exam.durationMinutes,
      passingPercentage: exam.passingPercentage,
    });
  }, [exam.title, exam.durationMinutes, exam.passingPercentage, form]);

  return (
    <Card title={formatMessage({ id: "exam-settings" })} style={{ borderRadius: 12, height: "100%" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          try {
            setExam(await updateSettings({ examId: exam.id, body: values }).unwrap());
            message.success(formatMessage({ id: "exam-saved" }));
          } catch {
            // The error message is shown as a toast by the base query
          }
        }}
      >
        <Form.Item
          name="title"
          label={formatMessage({ id: "exam-title" })}
          rules={[{ required: true, whitespace: true, message: formatMessage({ id: "title-required" }) }, { max: 200 }]}
        >
          <Input />
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
        <Flex justify="end">
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
            {formatMessage({ id: "save" })}
          </Button>
        </Flex>
      </Form>
    </Card>
  );
}

// ------------------------------------------------------------------ configuration

function ConfigurationCard({ exam }: { exam: IExamEditor }) {
  const { formatMessage } = useIntl();
  const { setExam } = useCourseCacheUpdaters();
  const [updateConfiguration, { isLoading }] = useUpdateExamConfigurationMutation();
  const [counts, setCounts] = useState<IDifficultyCounts>(exam.configuration);

  useEffect(() => {
    setCounts(exam.configuration);
  }, [exam.configuration]);

  const total = DIFFICULTIES.reduce((sum, d) => sum + (counts[d] ?? 0), 0);

  return (
    <Card title={formatMessage({ id: "exam-configuration" })} style={{ borderRadius: 12, height: "100%" }}>
      <Paragraph type="secondary">{formatMessage({ id: "exam-configuration-hint" })}</Paragraph>
      <Flex vertical gap="middle">
        {DIFFICULTIES.map((difficulty) => (
          <Flex key={difficulty} align="center" justify="space-between" gap={12}>
            <Tag color={difficultyColors[difficulty]} style={{ minWidth: 80, textAlign: "center" }}>
              {formatMessage({ id: `difficulty-${difficulty}` })}
            </Tag>
            <InputNumber
              min={0}
              max={exam.availableQuestions[difficulty]}
              value={counts[difficulty]}
              onChange={(value) => setCounts({ ...counts, [difficulty]: value ?? 0 })}
            />
            <Text type="secondary" style={{ flex: 1 }}>
              {formatMessage({ id: "of-available" }, { count: exam.availableQuestions[difficulty] })}
            </Text>
          </Flex>
        ))}
        <Flex justify="space-between" align="center">
          <Text strong>{formatMessage({ id: "questions-per-attempt" }, { count: total })}</Text>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isLoading}
            disabled={total === 0}
            onClick={async () => {
              try {
                setExam(await updateConfiguration({ examId: exam.id, body: counts }).unwrap());
                message.success(formatMessage({ id: "configuration-saved" }));
              } catch {
                // The error message is shown as a toast by the base query
              }
            }}
          >
            {formatMessage({ id: "save" })}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}

// ------------------------------------------------------------------ question pool

function QuestionsCard({ exam }: { exam: IExamEditor }) {
  const { formatMessage } = useIntl();
  const { setExam } = useCourseCacheUpdaters();
  const [removeQuestion] = useRemoveQuestionMutation();
  const [editing, setEditing] = useState<IQuestion | "new" | null>(null);

  return (
    <Card
      title={formatMessage({ id: "question-pool" }, { count: exam.questions.length })}
      style={{ borderRadius: 12 }}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setEditing("new")}>
          {formatMessage({ id: "add-question" })}
        </Button>
      }
    >
      {exam.questions.length === 0 ? (
        <Empty description={formatMessage({ id: "no-questions" })} />
      ) : (
        <List
          dataSource={exam.questions}
          renderItem={(question, index) => (
            <List.Item
              actions={[
                <Button key="edit" icon={<EditOutlined />} onClick={() => setEditing(question)} />,
                <Popconfirm
                  key="remove"
                  title={formatMessage({ id: "remove-question-confirm" })}
                  okText={formatMessage({ id: "yes" })}
                  cancelText={formatMessage({ id: "no" })}
                  onConfirm={async () => {
                    try {
                      setExam(await removeQuestion(question.id).unwrap());
                    } catch {
                      // The error message is shown as a toast by the base query
                    }
                  }}
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space wrap>
                    <Text strong>{`${index + 1}. ${question.questionText}`}</Text>
                  </Space>
                }
                description={
                  <Flex vertical gap={6}>
                    <Space size={4} wrap>
                      <Tag>{formatMessage({ id: `question-type-${question.questionType}` })}</Tag>
                      <Tag color={difficultyColors[question.difficulty]}>
                        {formatMessage({ id: `difficulty-${question.difficulty}` })}
                      </Tag>
                      <Tag>{formatMessage({ id: "marks-count" }, { count: question.marks })}</Tag>
                    </Space>
                    {question.questionType === "short_answer" ? (
                      <Text>
                        {formatMessage({ id: "correct-answer" })}: <Text code>{question.correctAnswer}</Text>
                      </Text>
                    ) : (
                      <Space size={4} wrap>
                        {question.options.map((option) => (
                          <Tag key={option.id} color={option.correct ? "green" : undefined} icon={option.correct ? <CheckOutlined /> : undefined}>
                            {option.optionText}
                          </Tag>
                        ))}
                      </Space>
                    )}
                  </Flex>
                }
              />
            </List.Item>
          )}
        />
      )}

      {editing && (
        <QuestionModal
          examId={exam.id}
          question={editing === "new" ? null : editing}
          onDone={(updated) => {
            setExam(updated);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </Card>
  );
}

interface QuestionFormValues {
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  marks: number;
  questionText: string;
  correctAnswer?: string;
  /** For true/false questions. */
  trueIsCorrect?: boolean;
  /** For single / multiple choice questions. */
  options?: IQuestionOption[];
}

function toFormValues(question: IQuestion | null): QuestionFormValues {
  if (!question) {
    return {
      questionType: "single_choice",
      difficulty: "easy",
      marks: 1,
      questionText: "",
      trueIsCorrect: true,
      options: [
        { optionText: "", correct: true },
        { optionText: "", correct: false },
      ],
    };
  }
  return {
    questionType: question.questionType,
    difficulty: question.difficulty,
    marks: question.marks,
    questionText: question.questionText,
    correctAnswer: question.correctAnswer ?? undefined,
    trueIsCorrect: question.options.find((o) => o.optionText === "True")?.correct ?? true,
    options: question.options,
  };
}

/** Builds the request the backend expects for each question type. */
function toRequest(values: QuestionFormValues, question: IQuestion | null): IQuestionRequest {
  const base = {
    questionType: values.questionType,
    difficulty: values.difficulty,
    marks: values.marks,
    questionText: values.questionText,
  };
  switch (values.questionType) {
    case "short_answer":
      return { ...base, correctAnswer: values.correctAnswer, options: [] };
    case "true_false": {
      // Keep the ids of an existing True/False pair so old answers still point to them
      const existing = (text: string) =>
        question?.questionType === "true_false"
          ? question.options.find((o) => o.optionText === text)?.id
          : undefined;
      return {
        ...base,
        options: [
          { id: existing("True"), optionText: "True", correct: values.trueIsCorrect ?? true },
          { id: existing("False"), optionText: "False", correct: !(values.trueIsCorrect ?? true) },
        ],
      };
    }
    default:
      return {
        ...base,
        options: (values.options ?? []).map((o) => ({
          id: o.id,
          optionText: o.optionText,
          correct: Boolean(o.correct),
        })),
      };
  }
}

function QuestionModal({
  examId,
  question,
  onDone,
  onCancel,
}: {
  examId: string;
  question: IQuestion | null;
  onDone: (exam: IExamEditor) => void;
  onCancel: () => void;
}) {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm<QuestionFormValues>();
  const [addQuestion, { isLoading: isAdding }] = useAddQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();
  const questionType = Form.useWatch("questionType", form) ?? question?.questionType ?? "single_choice";

  const submit = async () => {
    try {
      const values = await form.validateFields();
      const body = toRequest(values, question);
      onDone(
        question
          ? await updateQuestion({ questionId: question.id, body }).unwrap()
          : await addQuestion({ examId, body }).unwrap(),
      );
    } catch {
      // Validation errors are shown under the fields; server errors (e.g. "needs exactly 1 correct") as a toast
    }
  };

  return (
    <Modal
      open
      title={formatMessage({ id: question ? "edit-question" : "add-question" })}
      okText={formatMessage({ id: "save" })}
      cancelText={formatMessage({ id: "cancel" })}
      confirmLoading={isAdding || isUpdating}
      onOk={submit}
      onCancel={onCancel}
      width={720}
    >
      <Form form={form} layout="vertical" initialValues={toFormValues(question)}>
        <Row gutter={12}>
          <Col xs={24} md={10}>
            <Form.Item name="questionType" label={formatMessage({ id: "question-type" })}>
              <Select
                options={QUESTION_TYPES.map((t) => ({ value: t, label: formatMessage({ id: `question-type-${t}` }) }))}
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item name="difficulty" label={formatMessage({ id: "difficulty" })}>
              <Select
                options={DIFFICULTIES.map((d) => ({ value: d, label: formatMessage({ id: `difficulty-${d}` }) }))}
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item name="marks" label={formatMessage({ id: "marks" })} rules={[{ required: true }]}>
              <InputNumber min={1} max={100} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="questionText"
          label={formatMessage({ id: "question-text" })}
          rules={[{ required: true, whitespace: true, message: formatMessage({ id: "question-text-required" }) }, { max: 5000 }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        {questionType === "short_answer" && (
          <Form.Item
            name="correctAnswer"
            label={formatMessage({ id: "correct-answer" })}
            extra={formatMessage({ id: "short-answer-hint" })}
            rules={[{ required: true, whitespace: true, message: formatMessage({ id: "correct-answer-required" }) }, { max: 500 }]}
          >
            <Input />
          </Form.Item>
        )}

        {questionType === "true_false" && (
          <Form.Item name="trueIsCorrect" label={formatMessage({ id: "correct-answer" })}>
            <Radio.Group>
              <Radio value={true}>{formatMessage({ id: "true" })}</Radio>
              <Radio value={false}>{formatMessage({ id: "false" })}</Radio>
            </Radio.Group>
          </Form.Item>
        )}

        {(questionType === "single_choice" || questionType === "multiple_choice") && (
          <OptionsField form={form} single={questionType === "single_choice"} />
        )}
      </Form>
    </Modal>
  );
}

/** The editable answer options; for single choice, ticking one option un-ticks the others. */
function OptionsField({ form, single }: { form: FormInstance<QuestionFormValues>; single: boolean }) {
  const { formatMessage } = useIntl();

  const onCorrectChange = (index: number, checked: boolean) => {
    if (!single || !checked) return;
    const options = form.getFieldValue("options") as IQuestionOption[];
    form.setFieldValue(
      "options",
      options.map((option, i) => ({ ...option, correct: i === index })),
    );
  };

  return (
    <>
      <Text strong>{formatMessage({ id: single ? "options-single-hint" : "options-multiple-hint" })}</Text>
      <Form.List name="options">
        {(fields, { add, remove }) => (
          <Flex vertical gap={8} style={{ marginTop: 8 }}>
            {fields.map((field, index) => (
              <Flex key={field.key} gap={8} align="center">
                <Form.Item name={[field.name, "correct"]} valuePropName="checked" noStyle>
                  <Checkbox onChange={(e) => onCorrectChange(index, e.target.checked)} />
                </Form.Item>
                <Form.Item
                  name={[field.name, "optionText"]}
                  noStyle
                  rules={[{ required: true, whitespace: true, message: formatMessage({ id: "option-required" }) }]}
                >
                  <Input placeholder={formatMessage({ id: "option-n" }, { n: index + 1 })} />
                </Form.Item>
                <Button
                  type="text"
                  icon={<MinusCircleOutlined />}
                  disabled={fields.length <= 2}
                  onClick={() => remove(field.name)}
                />
              </Flex>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              disabled={fields.length >= 10}
              onClick={() => add({ optionText: "", correct: false })}
            >
              {formatMessage({ id: "add-option" })}
            </Button>
          </Flex>
        )}
      </Form.List>
    </>
  );
}
