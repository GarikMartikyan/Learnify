import { Button, Card, Flex, Input, List, Space, Tag, Typography } from "antd";
import {
  BookOutlined,
  EditOutlined,
  FileDoneOutlined,
  LockOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router";
import { routes } from "../constants/routes.ts";
import { PageTitle } from "../components/shared/PageTitle.tsx";
import { useIntl } from "react-intl";
import { isStudent } from "../utils/index.utils.ts";
import { CourseLanguageSelect } from "../components/shared/CourseLanguageSelect.tsx";
import { CourseComplexitySelect } from "../components/shared/CourseComplexitySelect.tsx";
import { CourseLevel } from "../placeholder/courses.ts";

const { Title } = Typography;

interface CourseStep {
  id: number;
  type: "chapter" | "exam";
  title: string;
  passed?: boolean;
  viewed?: boolean;
}

export default function ParticipatedCoursePage() {
  const location = useLocation();
  const isNewCourse = location.pathname.startsWith(routes.createCourse);
  const { formatMessage } = useIntl();

  // -------------------------
  // NEW LOGIC FOR NEW COURSE
  // -------------------------

  const courseSteps: CourseStep[] = isNewCourse
    ? []
    : [
        { id: 1, type: "chapter", title: "Introduction to JS", viewed: true },
        { id: 2, type: "chapter", title: "Variables & Types", viewed: true },
        { id: 3, type: "exam", title: "Basics Exam", passed: true },
        { id: 4, type: "chapter", title: "Functions", viewed: false },
        { id: 5, type: "exam", title: "Functions Exam", passed: false },
      ];

  const courseName = isNewCourse ? "" : "Complete JavaScript Course";

  const courseDescription = isNewCourse
    ? ""
    : "This course covers the fundamentals of JavaScript, from basic syntax and data types to DOM manipulation and ES6 features. Perfect for beginners!";

  // -------------------------
  // EXAM LOCK LOGIC
  // -------------------------
  const isExamLocked = (index: number): boolean => {
    const step = courseSteps[index];

    if (step?.type !== "exam") return false;

    for (let i = index - 1; i >= 0; i--) {
      if (courseSteps[i].type === "exam") {
        return !courseSteps[i].passed;
      }
    }

    return false;
  };

  return (
    <div style={{ margin: "auto" }}>
      <div style={{ borderRadius: 16 }}>
        <Flex justify="space-between">
          <PageTitle showBackButton level={2}>
            {!isStudent ? "Course" : courseName || "New Course"}
          </PageTitle>

          {isStudent && (
            <Link to={routes.courses}>
              <Button>Leave Course</Button>
            </Link>
          )}
          {/*{!isStudent && !isNewCourse && (*/}
          {/*  <Popconfirm*/}
          {/*    title={formatMessage({ id: "delete-confirmation" })}*/}
          {/*    okText={formatMessage({ id: "yes" })}*/}
          {/*    cancelText={formatMessage({ id: "no" })}*/}
          {/*  >*/}
          {/*    <Button danger type="primary" icon={<DeleteOutlined />} />*/}
          {/*  </Popconfirm>*/}
          {/*)}*/}
        </Flex>

        <Card
          style={{
            borderRadius: 12,
            marginBottom: 24,
          }}
        >
          {!isStudent ? (
            <Flex vertical gap={"middle"}>
              <Input placeholder="Course Name" defaultValue={courseName} />

              <Input.TextArea rows={4} defaultValue={courseDescription} />
            </Flex>
          ) : (
            !isNewCourse && (
              <Title level={3} style={{ marginBottom: 0 }}>
                {courseDescription}
              </Title>
            )
          )}
        </Card>

        {!isStudent && (
          <Space style={{ marginBottom: 24 }}>
            <CourseLanguageSelect defaultValue={"en"} />
            <CourseComplexitySelect defaultValue={CourseLevel.intermediate} />
          </Space>
        )}

        {/* LIST OF STEPS */}
        <List
          itemLayout="horizontal"
          dataSource={courseSteps}
          renderItem={(item, index) => {
            const locked = isExamLocked(index);

            return (
              <List.Item
                style={{
                  opacity: locked ? 0.5 : 1,
                  pointerEvents: locked ? "none" : "auto",
                  padding: "12px 8px",
                  borderRadius: 10,
                  height: 80,
                }}
              >
                <List.Item.Meta
                  avatar={
                    item.type === "chapter" ? (
                      <BookOutlined
                        style={{ fontSize: 22, color: "#1677ff" }}
                      />
                    ) : locked ? (
                      <LockOutlined
                        style={{ fontSize: 22, color: "#ff4d4f" }}
                      />
                    ) : item.passed ? (
                      <FileDoneOutlined
                        style={{ fontSize: 22, color: "#52c41a" }}
                      />
                    ) : (
                      <FileDoneOutlined
                        style={{ fontSize: 22, color: "#faad14" }}
                      />
                    )
                  }
                  title={
                    <span style={{ fontSize: 16, fontWeight: 500 }}>
                      {item.title}
                    </span>
                  }
                  description={
                    item.type === "chapter" ? (
                      <Tag color="blue">{formatMessage({ id: "chapter" })}</Tag>
                    ) : item.passed ? null : locked ? (
                      <Tag color="red">{formatMessage({ id: "locked" })}</Tag>
                    ) : (
                      <Tag color="orange">{formatMessage({ id: "exam" })}</Tag>
                    )
                  }
                />

                {!isStudent ? (
                  <Link
                    to={
                      item?.type === "chapter"
                        ? routes.editChapter("1")
                        : routes.editExam("1")
                    }
                  >
                    <Button type={"primary"} icon={<EditOutlined />} />
                  </Link>
                ) : (
                  <>
                    {item.type === "chapter" && (
                      <Link to={routes.chapterById("1")}>
                        <Button type={item.viewed ? "default" : "primary"}>
                          {formatMessage({
                            id: item.viewed ? "review" : "open-chapter",
                          })}
                        </Button>
                      </Link>
                    )}

                    {item.type === "exam" && !locked && (
                      <Link to={routes.examById("123")}>
                        <Button disabled={item?.passed} type={"primary"}>
                          {formatMessage({
                            id: item.passed ? "passed" : "take-exam",
                          })}
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </List.Item>
            );
          }}
        />
      </div>

      {!isStudent && (
        <Flex justify="end">
          <Space style={{ marginTop: 40 }}>
            <Link to={routes.createChapter}>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                style={{ width: "100%" }}
              >
                {formatMessage({ id: "add-chapter" })}
              </Button>
            </Link>
            <Link to={routes.createExam}>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                style={{ width: "100%" }}
              >
                {formatMessage({ id: "add-exam" })}
              </Button>
            </Link>
          </Space>
        </Flex>
      )}
    </div>
  );
}
