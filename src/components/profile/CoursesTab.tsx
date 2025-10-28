import { Card, List, Typography } from "antd";
import type { ICourse } from "../../constants/interfaces/course.interfaces.ts";
import { useNavigate } from "react-router";
import { routes } from "../../constants/routes.ts";

const { Title } = Typography;

interface CoursesTabProps {
  courses: ICourse[];
}

export function CoursesTab({ courses }: CoursesTabProps) {
  const navigate = useNavigate();
  const HandleClick = (courseId: string) => {
    navigate(routes.courseById(courseId));
  };
  console.log({ courses });
  return (
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={courses}
      renderItem={(course) => (
        <List.Item
          onClick={() => HandleClick(course.id)}
          style={{ cursor: "pointer" }}
        >
          <Card
            // variant="borderless"
            hoverable
            cover={
              <img
                alt={course.title}
                src={course.image}
                style={{
                  width: "100%",
                  aspectRatio: "5/3",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            }
          >
            <Title style={{ margin: 0 }} level={5}>
              {course.title}
            </Title>
            {/*<Text type="secondary">*/}
            {/*  <BookOutlined /> {100} students*/}
            {/*</Text>*/}
          </Card>
        </List.Item>
      )}
    />
  );
}
