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
/** Category option meaning "no filter" (shown as a real option, like on the other pages). */
const ALL = "all";

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

  // Same order as the other pages' filter rows (search first). Widths fit the longest "All …"
  // label in en/ru/am, and the whole row incl. Reset fits on one line in every language
  return (
    <Flex gap={12} wrap align="center">
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder={formatMessage({ id: "search-keywords" })}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        style={{ width: 260 }}
      />
      <CourseLanguageSelect
        showAllOptions
        style={{ width: 200 }}
        value={value.language ?? null}
        onChange={(language: CourseLanguage | null) =>
          onChange({ ...value, language: language ?? undefined })
        }
      />
      <CourseComplexitySelect
        showAllOption
        style={{ width: 200 }}
        value={value.level ?? null}
        onChange={(level: CourseLevel | null) =>
          onChange({ ...value, level: level ?? undefined })
        }
      />
      <Select
        showSearch
        optionFilterProp="label"
        style={{ width: 210 }}
        value={value.categoryId ?? ALL}
        onChange={(categoryId: string) =>
          onChange({ ...value, categoryId: categoryId === ALL ? undefined : categoryId })
        }
        options={[
          { value: ALL, label: formatMessage({ id: "all-categories" }) },
          ...categories.map((category) => ({
            value: category.id,
            label: category.name,
          })),
        ]}
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
