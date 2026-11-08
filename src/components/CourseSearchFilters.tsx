import { useEffect, useState } from "react";
import { Button, Flex, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import { CourseComplexitySelect } from "./shared/CourseComplexitySelect.tsx";
import { CourseLanguageSelect } from "./shared/CourseLanguageSelect.tsx";
import { useGetCategoriesQuery } from "../api/course.api.ts";
import type {
  CourseLanguage,
  CourseLevel,
} from "../constants/interfaces/courseApi.interfaces.ts";

export interface CourseFilters {
  search?: string;
  categoryId?: string;
  level?: CourseLevel;
  language?: CourseLanguage;
}

interface CourseSearchFiltersProps {
  value: CourseFilters;
  onChange: (filters: CourseFilters) => void;
}

const SEARCH_DELAY_MS = 400;

/** Catalog filters: language, level, category and a search box (searches after typing stops). */
export function CourseSearchFilters({ value, onChange }: CourseSearchFiltersProps) {
  const { formatMessage } = useIntl();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [searchInput, setSearchInput] = useState(value.search ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const search = searchInput.trim() || undefined;
      if (search !== value.search) {
        onChange({ ...value, search });
      }
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [searchInput, value, onChange]);

  return (
    <Flex gap={8} wrap align="center" style={{ width: "100%" }}>
      <CourseLanguageSelect
        showAllOptions
        style={{ minWidth: 150 }}
        value={value.language ?? null}
        onChange={(language: CourseLanguage | null) =>
          onChange({ ...value, language: language ?? undefined })
        }
      />
      <CourseComplexitySelect
        showAllOption
        style={{ minWidth: 150 }}
        value={value.level ?? null}
        onChange={(level: CourseLevel | null) =>
          onChange({ ...value, level: level ?? undefined })
        }
      />
      <Select
        allowClear
        showSearch
        optionFilterProp="label"
        style={{ minWidth: 200 }}
        placeholder={formatMessage({ id: "all-categories" })}
        value={value.categoryId}
        onChange={(categoryId?: string) => onChange({ ...value, categoryId })}
        options={categories.map((category) => ({
          value: category.id,
          label: category.name,
        }))}
      />
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder={formatMessage({ id: "search-keywords" })}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        style={{ flex: 1, minWidth: 200 }}
      />
      <Button
        onClick={() => {
          setSearchInput("");
          onChange({});
        }}
      >
        {formatMessage({ id: "reset" })}
      </Button>
    </Flex>
  );
}
