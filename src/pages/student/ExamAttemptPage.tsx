import { useEffect, useRef, useState } from "react";
import {
  Affix,
  Button,
  Card,
  Checkbox,
  Flex,
  Input,
  Popconfirm,
  Radio,
  Result,
  Space,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { PageTitle } from "../../components/shared/PageTitle.tsx";
import { routes } from "../../constants/routes.ts";
import {
  useGetAttemptQuery,
  useSaveAnswerMutation,
  useSubmitAttemptMutation,
} from "../../api/enrollment.api.ts";
import type {
  IAttempt,
  IAttemptQuestion,
} from "../../constants/interfaces/enrollment.interfaces.ts";

const { Text, Title, Paragraph } = Typography;

interface Answer {
  optionIds: string[];
  text: string;
}

/**
 * /learning/:courseId/attempts/:attemptId — taking an exam (answers are saved as they are given,
 * the attempt is submitted automatically when the time runs out), or its result once submitted.
 */
export function ExamAttemptPage() {
  const { courseId = "", attemptId = "" } = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { data: attempt, isLoading, isError, refetch } = useGetAttemptQuery(attemptId, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }
  if (isError || !attempt) {
    return (
      <Result
        status="warning"
        title={formatMessage({ id: "exam-not-available" })}
        extra={
          <Button onClick={() => navigate(routes.learning(courseId))}>
            {formatMessage({ id: "back-to-course" })}
          </Button>
        }
      />
    );
  }

  return attempt.submittedAt ? (
    <AttemptResult attempt={attempt} courseId={courseId} />
  ) : (
    // key: a fresh form for every attempt
    <AttemptForm key={attempt.id} attempt={attempt} onTimeUp={refetch} />
  );
}

/** The open attempt: questions, a countdown and the submit button. */
function AttemptForm({
  attempt,
  onTimeUp,
}: {
  attempt: IAttempt;
  onTimeUp: () => void;
}) {
  const { formatMessage } = useIntl();
  const { token } = theme.useToken();
  const [saveAnswer] = useSaveAnswerMutation();
  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();

  const [answers, setAnswers] = useState<Record<string, Answer>>(() =>
    Object.fromEntries(
      attempt.questions.map((q) => [
        q.questionId,
        { optionIds: q.selectedOptionIds, text: q.answerText ?? "" },
      ]),
    ),
  );
  // Typed answers not saved yet (they are saved when the field loses focus, and before submitting)
  const unsavedTexts = useRef(new Set<string>());
  // Latest answers for the timer's automatic submit (its callback was created on the first render)
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // The server's time limit decides; the countdown starts from the seconds it reported
  const [deadline] = useState(() => Date.now() + attempt.secondsLeft * 1000);
  const [secondsLeft, setSecondsLeft] = useState(attempt.secondsLeft);
  const submitted = useRef(false);

  const submit = async () => {
    if (submitted.current) return;
    submitted.current = true;
    for (const questionId of unsavedTexts.current) {
      save(questionId, answersRef.current[questionId], true);
    }
    unsavedTexts.current.clear();
    // Wait until every answer has reached the server
    await saveQueue.current;
    const result = await submitAttempt(attempt.id);
    if (result.error) {
      submitted.current = false;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        clearInterval(timer);
        // Time is up: submit what has been answered
        submit().then(onTimeUp);
      }
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

  // Saves are sent one after another, so quick clicks reach the server in the order they were made
  const saveQueue = useRef<Promise<unknown>>(Promise.resolve());

  const save = (questionId: string, answer: Answer, isText: boolean) => {
    saveQueue.current = saveQueue.current.then(async () => {
      const result = await saveAnswer({
        attemptId: attempt.id,
        questionId,
        ...(isText ? { text: answer.text } : { optionIds: answer.optionIds }),
      });
      if (result.error) {
        // e.g. the time ran out: reload, which shows the result
        onTimeUp();
      }
    });
    return saveQueue.current;
  };

  const choose = (question: IAttemptQuestion, optionIds: string[]) => {
    const answer = { ...answers[question.questionId], optionIds };
    setAnswers((prev) => ({ ...prev, [question.questionId]: answer }));
    save(question.questionId, answer, false);
  };

  const type = (questionId: string, text: string) => {
    unsavedTexts.current.add(questionId);
    setAnswers((prev) => ({ ...prev, [questionId]: { ...prev[questionId], text } }));
  };

  const saveText = (questionId: string) => {
    if (unsavedTexts.current.delete(questionId)) {
      save(questionId, answers[questionId], true);
    }
  };

  const unanswered = attempt.questions.filter((q) => {
    const answer = answers[q.questionId];
    return q.questionType === "short_answer" ? !answer.text.trim() : answer.optionIds.length === 0;
  }).length;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isRunningOut = secondsLeft <= 60;

  return (
    <div>
      <Affix offsetTop={8}>
        <Card
          variant="borderless"
          style={{ borderRadius: 12, boxShadow: token.boxShadowSecondary, marginBottom: 16 }}
          styles={{ body: { padding: "12px 20px" } }}
        >
          <Flex justify="space-between" align="center" wrap gap={12}>
            <Title level={4} style={{ margin: 0 }}>
              {attempt.examTitle}
            </Title>
            <Space size="large" wrap>
              <Text strong style={{ fontSize: 18, color: isRunningOut ? token.colorError : undefined }}>
                <ClockCircleOutlined /> {minutes}:{String(seconds).padStart(2, "0")}
              </Text>
              <Popconfirm
                title={formatMessage({ id: "submit-exam" })}
                description={
                  unanswered > 0
                    ? formatMessage({ id: "submit-exam-unanswered" }, { count: unanswered })
                    : formatMessage({ id: "submit-exam-confirm" })
                }
                okText={formatMessage({ id: "submit-exam" })}
                cancelText={formatMessage({ id: "cancel" })}
                onConfirm={submit}
              >
                <Button type="primary" loading={isSubmitting}>
                  {formatMessage({ id: "submit-exam" })}
                </Button>
              </Popconfirm>
            </Space>
          </Flex>
        </Card>
      </Affix>

      <Flex vertical gap={16}>
        {attempt.questions.map((question) => (
          <Card
            key={question.questionId}
            variant="borderless"
            style={{ borderRadius: 12 }}
            title={formatMessage({ id: "question-number" }, { number: question.position })}
            extra={
              <Text type="secondary">
                {formatMessage({ id: "marks-count" }, { count: question.marks })}
              </Text>
            }
          >
            <Paragraph style={{ fontSize: 16, whiteSpace: "pre-wrap" }}>{question.questionText}</Paragraph>
            {question.questionType === "multiple_choice" && (
              <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                {formatMessage({ id: "pick-all-correct" })}
              </Text>
            )}
            <AnswerInput
              question={question}
              answer={answers[question.questionId]}
              onChoose={(optionIds) => choose(question, optionIds)}
              onType={(text) => type(question.questionId, text)}
              onTypeDone={() => saveText(question.questionId)}
            />
          </Card>
        ))}
      </Flex>
    </div>
  );
}

/** Radio buttons, checkboxes or a text field depending on the question type. */
function AnswerInput({
  question,
  answer,
  disabled = false,
  onChoose,
  onType,
  onTypeDone,
}: {
  question: IAttemptQuestion;
  answer: Answer;
  disabled?: boolean;
  onChoose?: (optionIds: string[]) => void;
  onType?: (text: string) => void;
  onTypeDone?: () => void;
}) {
  const { formatMessage } = useIntl();

  if (question.questionType === "short_answer") {
    return (
      <Input
        value={answer.text}
        disabled={disabled}
        maxLength={1000}
        placeholder={formatMessage({ id: "your-answer" })}
        onChange={(e) => onType?.(e.target.value)}
        onBlur={onTypeDone}
      />
    );
  }
  if (question.questionType === "multiple_choice") {
    return (
      <Checkbox.Group
        value={answer.optionIds}
        disabled={disabled}
        onChange={(values) => onChoose?.(values as string[])}
      >
        <Space direction="vertical">
          {question.options.map((option) => (
            <Checkbox key={option.id} value={option.id}>
              {option.optionText}
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    );
  }
  return (
    <Radio.Group
      value={answer.optionIds[0]}
      disabled={disabled}
      onChange={(e) => onChoose?.([e.target.value])}
    >
      <Space direction="vertical">
        {question.options.map((option) => (
          <Radio key={option.id} value={option.id}>
            {option.optionText}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
}

/** A graded attempt: score, pass / fail, and right / wrong per question (correct answers are not shown). */
function AttemptResult({ attempt, courseId }: { attempt: IAttempt; courseId: string }) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const resultTag = (question: IAttemptQuestion) => {
    if (question.correct) {
      return <Tag color="success">{formatMessage({ id: "answer-correct" })}</Tag>;
    }
    if (question.marksAwarded && question.marksAwarded > 0) {
      return <Tag color="warning">{formatMessage({ id: "answer-partly-correct" })}</Tag>;
    }
    return <Tag color="error">{formatMessage({ id: "answer-wrong" })}</Tag>;
  };

  return (
    <div>
      <PageTitle showBackButton backRoute={routes.learningExam(courseId, attempt.examId)}>
        {attempt.examTitle}
      </PageTitle>

      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <Result
          status={attempt.passed ? "success" : "error"}
          title={formatMessage({ id: attempt.passed ? "exam-passed-title" : "exam-failed-title" })}
          subTitle={formatMessage(
            { id: "exam-score" },
            {
              score: attempt.score,
              total: attempt.totalMarks,
              percent: attempt.percent,
              passing: attempt.passingPercentage,
            },
          )}
          extra={[
            <Button key="course" onClick={() => navigate(routes.learning(courseId))}>
              {formatMessage({ id: "back-to-course" })}
            </Button>,
            !attempt.passed && (
              <Button
                key="retry"
                type="primary"
                onClick={() => navigate(routes.learningExam(courseId, attempt.examId))}
              >
                {formatMessage({ id: "retake-exam" })}
              </Button>
            ),
          ]}
        />
      </Card>

      <Flex vertical gap={16} style={{ marginTop: 24 }}>
        {attempt.questions.map((question) => (
          <Card
            key={question.questionId}
            variant="borderless"
            style={{ borderRadius: 12 }}
            title={
              <Space>
                {formatMessage({ id: "question-number" }, { number: question.position })}
                {resultTag(question)}
              </Space>
            }
            extra={
              <Text type="secondary">
                {question.marksAwarded} / {question.marks}
              </Text>
            }
          >
            <Paragraph style={{ fontSize: 16, whiteSpace: "pre-wrap" }}>{question.questionText}</Paragraph>
            <AnswerInput
              question={question}
              answer={{ optionIds: question.selectedOptionIds, text: question.answerText ?? "" }}
              disabled
            />
          </Card>
        ))}
      </Flex>
    </div>
  );
}
