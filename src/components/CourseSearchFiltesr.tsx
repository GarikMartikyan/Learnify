import React from "react";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Select,
  Space,
  Tooltip,
} from "antd";
import { SearchOutlined, SortAscendingOutlined } from "@ant-design/icons";

const { Option } = Select;

export type Complexity = "beginner" | "intermediate" | "all";
export type SortBy = "date" | "popularity";

export interface InlineFilterBarProps {
  languages?: { value: string; label: string }[];
  initialLanguage?: string;
  initialComplexity?: Complexity;
  initialKeyword?: string;
  initialSort?: SortBy;
  onChange?: (filters: {
    language?: string;
    complexity?: Complexity;
    keyword?: string;
    sortBy?: SortBy;
  }) => void;
}

export function CourseSearchFiltesr({
  languages = [
    { value: "all", label: "All" },
    { value: "English", label: "English" },
    { value: "Armenian", label: "Armenian" },
  ],
  initialLanguage = "all",
  initialComplexity = "all",
  initialKeyword = "",
  initialSort = "date",
  onChange,
}: InlineFilterBarProps) {
  const [form] = Form.useForm();

  const handleValuesChange = (_: any, allValues: any) => {
    onChange?.(allValues);
  };

  const sortMenu = (
    <Menu
      selectable
      selectedKeys={[form.getFieldValue("sortBy") || initialSort]}
      onClick={(info) => {
        form.setFieldsValue({ sortBy: info.key });
        onChange?.(form.getFieldsValue());
      }}
    >
      <Menu.Item key="date">By date</Menu.Item>
      <Menu.Item key="popularity">By popularity</Menu.Item>
    </Menu>
  );

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
      <Select name="language" style={{ minWidth: 150 }}>
        {languages.map((l) => (
          <Option key={l.value} value={l.value}>
            {l.label}
          </Option>
        ))}
      </Select>

      <Select name="complexity" style={{ minWidth: 150 }}>
        <Option value="all">All levels</Option>
        <Option value="intermediate">Intermediate</Option>
        <Option value="beginner">Beginner</Option>
      </Select>

      <Input
        name="keyword"
        placeholder="Search keywords..."
        prefix={<SearchOutlined />}
        allowClear
        style={{ flex: 1, minWidth: 200 }}
        onPressEnter={() => onChange?.(form.getFieldsValue())}
      />

      <Dropdown overlay={sortMenu} trigger={["click"]} placement="bottomRight">
        <Tooltip title="Sort">
          <Button icon={<SortAscendingOutlined />}>Sort</Button>
        </Tooltip>
      </Dropdown>

      <Space>
        <Button
          type="primary"
          onClick={() => onChange?.(form.getFieldsValue())}
        >
          Apply
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
          Reset
        </Button>
      </Space>
    </Form>
  );
}
