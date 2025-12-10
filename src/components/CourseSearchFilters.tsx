import {
  Button,
  Dropdown,
  Form,
  Input,
  type MenuProps,
  Space,
  Tooltip,
} from "antd";
import { SearchOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { CourseComplexitySelect } from "./shared/CourseComplexitySelect.tsx";
import { CourseLanguageSelect } from "./shared/CourseLanguageSelect.tsx";

export type Complexity = "beginner" | "intermediate" | "advanced" | "all";
export type SortBy = "date" | "popularity";

export interface InlineFilterBarProps {
  languages?: { value: string; label: string }[];
  initialLanguage?: string | null;
  initialComplexity?: Complexity | null;
  initialKeyword?: string;
  initialSort?: SortBy;
  onChange?: (filters: {
    language?: string | null;
    complexity?: Complexity | null;
    keyword?: string;
    sortBy?: SortBy;
  }) => void;
}

export function CourseSearchFilters({
  languages = [
    { value: "all", label: "All Languages" },
    { value: "English", label: "English" },
    { value: "Armenian", label: "Armenian" },
  ],
  initialLanguage = null,
  initialComplexity = null,
  initialKeyword = "",
  initialSort = "date",
  onChange,
}: InlineFilterBarProps) {
  const { formatMessage } = useIntl();

  const [form] = Form.useForm<{
    language: string;
    complexity: Complexity;
    keyword: string;
    sortBy: SortBy;
  }>();

  const handleValuesChange = (
    changedValues: Partial<{
      language: string;
      complexity: Complexity;
      keyword: string;
      sortBy: SortBy;
    }>,
  ) => {
    if (Object.keys(changedValues).some((key) => key !== "sortBy")) {
      onChange?.(form.getFieldsValue());
    }
  };

  const handleSortClick: MenuProps["onClick"] = (info) => {
    const newSortBy = info.key as SortBy;
    form.setFieldsValue({ sortBy: newSortBy });
    onChange?.(form.getFieldsValue());
  };

  const sortMenu: MenuProps = {
    selectable: true,
    selectedKeys: [form.getFieldValue("sortBy") || initialSort],
    onClick: handleSortClick,
    items: [
      {
        key: "date",
        label: formatMessage({ id: "sort-by-date" }),
      },
      {
        key: "popularity",
        label: formatMessage({ id: "sort-by-popularity" }),
      },
    ],
  };

  return (
    <Form
      form={form}
      layout="inline"
      initialValues={{
        language: initialLanguage,
        complexity: initialComplexity,
        keyword: initialKeyword,
        sortBy: initialSort,
      }}
      onValuesChange={handleValuesChange}
      style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}
    >
      <Form.Item name="language" style={{ minWidth: 150 }}>
        <CourseLanguageSelect showAllOptions />
      </Form.Item>

      <Form.Item name="complexity" style={{ minWidth: 150 }}>
        <CourseComplexitySelect showAllOption />
      </Form.Item>

      <Form.Item name="keyword" style={{ flex: 1, minWidth: 200 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder={formatMessage({ id: "search-keywords" })}
          allowClear
        />
      </Form.Item>

      <Dropdown menu={sortMenu} trigger={["click"]} placement="bottomRight">
        <Tooltip title={formatMessage({ id: "sort" })}>
          <Button icon={<SortAscendingOutlined />}>
            {formatMessage({ id: "sort" })}
          </Button>
        </Tooltip>
      </Dropdown>

      <Space>
        <Button
          type="primary"
          onClick={() => onChange?.(form.getFieldsValue())}
        >
          {formatMessage({ id: "apply" })}
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
            onChange?.({
              language: initialLanguage,
              complexity: initialComplexity,
              keyword: initialKeyword,
              sortBy: initialSort,
            });
          }}
        >
          {formatMessage({ id: "reset" })}
        </Button>
      </Space>
    </Form>
  );
}
