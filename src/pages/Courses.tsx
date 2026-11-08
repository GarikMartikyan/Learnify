import { useState } from "react";
import { Button, Col, Empty, Flex, Pagination, Row, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router";
import { CourseCard } from "../components/shared/CourseCard.tsx";
import { PageTitle } from "../components/shared/PageTitle.tsx";
import { routes } from "../constants/routes.ts";
import {
  CourseSearchFilters,
  type CourseFilters,
} from "../components/CourseSearchFilters.tsx";
import { useCurrentUser } from "../hooks/useCurrentUser.ts";
import { useGetCatalogQuery } from "../api/course.api.ts";
import { AdminCourses } from "./superuser/AdminCourses.tsx";

const PAGE_SIZE = 12;

/** "/" — the public course catalog (admins get the course management table instead). */
export function Courses() {
  const { role } = useCurrentUser();

  if (role === "admin") {
    return <AdminCourses />;
  }

  return <CourseCatalog showCreateButton={role === "teacher"} />;
}

function CourseCatalog({ showCreateButton }: { showCreateButton: boolean }) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CourseFilters>({});
  const [page, setPage] = useState(0);

  const { data, isFetching } = useGetCatalogQuery({
    ...filters,
    page,
    size: PAGE_SIZE,
  });

  const handleFiltersChange = (newFilters: CourseFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  return (
    <>
      <Flex justify="space-between" align="center" wrap gap={12}>
        <PageTitle>{formatMessage({ id: "courses" })}</PageTitle>
        {showCreateButton && (
          <Link to={routes.createCourse}>
            <Button type="primary" icon={<PlusOutlined />}>
              {formatMessage({ id: "create-course" })}
            </Button>
          </Link>
        )}
      </Flex>
      <div style={{ marginBottom: 16 }}>
        <CourseSearchFilters value={filters} onChange={handleFiltersChange} />
      </div>

      <Spin spinning={isFetching}>
        {data && data.content.length === 0 ? (
          <Empty description={formatMessage({ id: "no-courses-found" })} />
        ) : (
          <Row align="stretch" gutter={[16, 16]}>
            {(data?.content ?? []).map((course) => (
              <Col xs={24} sm={12} lg={8} xxl={6} key={course.id}>
                <CourseCard
                  course={course}
                  onClick={() => navigate(routes.courseById(course.id))}
                />
              </Col>
            ))}
          </Row>
        )}
      </Spin>

      {data && data.totalElements > PAGE_SIZE && (
        <Flex justify="center" style={{ marginTop: 24 }}>
          <Pagination
            current={page + 1}
            pageSize={PAGE_SIZE}
            total={data.totalElements}
            showSizeChanger={false}
            onChange={(newPage) => setPage(newPage - 1)}
          />
        </Flex>
      )}
    </>
  );
}
