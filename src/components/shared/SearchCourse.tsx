// import { useMemo, useRef, useState } from "react";
// import {
//   AutoComplete,
//   type AutoCompleteProps,
//   Avatar,
//   Input,
//   type InputRef as InputRefType,
//   Typography,
// } from "antd";
// import { debounce } from "lodash";
//
// import { useNavigate } from "react-router";
// import { COURSES } from "../../placeholder/courses.ts";
// import { SearchOutlined } from "@ant-design/icons";
// import { routes } from "../../constants/routes.ts";
//
// export const CourseSearch = () => {
//   const courses = COURSES;
//   const navigate = useNavigate();
//   const inputRef = useRef<InputRefType>(null);
//   const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
//
//   // Debounced search to improve performance
//   const handleSearch = useMemo(
//     () =>
//       debounce((value: string) => {
//         if (!value) {
//           setOptions([]);
//           return;
//         }
//
//         const filtered = courses
//           .filter((course) =>
//             course.title.toLowerCase().includes(value.toLowerCase()),
//           )
//           .slice(0, 10); // limit suggestions
//
//         setOptions(
//           filtered.map((course) => ({
//             label: (
//               <div
//                 style={{
//                   height: 32,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                 }}
//               >
//                 <Avatar src={course.instructor.avatar} size="small" />
//                 <Typography.Text strong>
//                   {highlightMatch(course.title, value)}
//                 </Typography.Text>
//                 <Typography.Text
//                   type="secondary"
//                   style={{ marginLeft: "auto" }}
//                 >
//                   {course.level}
//                 </Typography.Text>
//               </div>
//             ),
//             value: course.title,
//             key: course.id,
//             course, // keep course object for selection
//           })),
//         );
//       }, 300),
//     [courses],
//   );
//
//   const handleSelect = (_, course) => {
//     console.log(course);
//     navigate(routes.courseById(course.course.id));
//     inputRef?.current?.blur();
//   };
//
//   return (
//     <AutoComplete
//       options={options}
//       onSelect={handleSelect}
//       onSearch={handleSearch}
//       style={{ width: "100%" }}
//       placeholder="Search courses"
//     >
//       <Input ref={inputRef} suffix={<SearchOutlined />} />
//     </AutoComplete>
//   );
// };
//
// function highlightMatch(text: string, query: string) {
//   const index = text.toLowerCase().indexOf(query.toLowerCase());
//   if (index === -1) return text;
//   return (
//     <>
//       {text.slice(0, index)}
//       <span style={{ backgroundColor: "#ffe58f" }}>
//         {text.slice(index, index + query.length)}
//       </span>
//       {text.slice(index + query.length)}
//     </>
//   );
// }
