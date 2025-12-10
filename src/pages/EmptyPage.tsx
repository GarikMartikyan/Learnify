export function Help() {
  return <div>Help</div>;
}

// import { Collapse, Typography } from "antd";
// import { useIntl } from "react-intl";
// import { PageTitle } from "../components/shared/PageTitle.tsx";
//
// const { Paragraph } = Typography;
//
// export const helpMessages = {
//   "help-page-title": {
//     id: "help-page-title",
//     defaultMessage: "Learnify Help Center",
//   },
//   "getting-started": {
//     id: "getting-started",
//     defaultMessage: "Getting Started",
//   },
//   "create-account": {
//     id: "create-account",
//     defaultMessage:
//       'To start learning, create an account by clicking "Sign Up" at the top-right corner. Choose your role as Student or Teacher.',
//   },
//   "login-account": {
//     id: "login-account",
//     defaultMessage:
//       'If you already have an account, click "Login" and enter your email and password.',
//   },
//   "user-settings": {
//     id: "user-settings",
//     defaultMessage: "User Settings",
//   },
//   "full-name": {
//     id: "full-name",
//     defaultMessage: "Full Name",
//   },
//   "change-password": {
//     id: "change-password",
//     defaultMessage:
//       'You can change your password in User Settings by clicking "Edit Profile" and updating your password.',
//   },
//   "courses-overview": {
//     id: "courses-overview",
//     defaultMessage: "Courses Overview",
//   },
//   "enroll-course": {
//     id: "enroll-course",
//     defaultMessage:
//       'To enroll in a course, navigate to the Courses page, select a course, and click "Join Course".',
//   },
//   "teacher-dashboard": {
//     id: "teacher-dashboard",
//     defaultMessage:
//       "Teachers can manage their courses from the Teacher Dashboard. Create chapters, add exams, and track student progress.",
//   },
//   "student-dashboard": {
//     id: "student-dashboard",
//     defaultMessage:
//       "Students can see their enrolled courses in the My Courses section, access chapters, and take exams.",
//   },
//   "exams-and-quizzes": {
//     id: "exams-and-quizzes",
//     defaultMessage:
//       "Exams and quizzes are part of the course chapters. Complete them to track your progress and get scores.",
//   },
//   "contact-support": {
//     id: "contact-support",
//     defaultMessage:
//       'If you need further assistance, contact our support team via the "Contact Us" page.',
//   },
// };
//
// const { Panel } = Collapse;
//
// export function Help() {
//   const { formatMessage } = useIntl();
//
//   return (
//     <>
//       <PageTitle>{formatMessage(helpMessages["help-page-title"])}</PageTitle>
//
//       <Collapse accordion>
//         <Panel header={formatMessage(helpMessages["getting-started"])} key="1">
//           <Paragraph>{formatMessage(helpMessages["create-account"])}</Paragraph>
//           <Paragraph>{formatMessage(helpMessages["login-account"])}</Paragraph>
//         </Panel>
//
//         <Panel header={formatMessage(helpMessages["user-settings"])} key="2">
//           <Paragraph>{formatMessage(helpMessages["full-name"])}</Paragraph>
//           <Paragraph>
//             {formatMessage(helpMessages["change-password"])}
//           </Paragraph>
//         </Panel>
//
//         <Panel header={formatMessage(helpMessages["courses-overview"])} key="3">
//           <Paragraph>{formatMessage(helpMessages["enroll-course"])}</Paragraph>
//           <Paragraph>
//             {formatMessage(helpMessages["teacher-dashboard"])}
//           </Paragraph>
//           <Paragraph>
//             {formatMessage(helpMessages["student-dashboard"])}
//           </Paragraph>
//           <Paragraph>
//             {formatMessage(helpMessages["exams-and-quizzes"])}
//           </Paragraph>
//         </Panel>
//
//         <Panel header={formatMessage(helpMessages["contact-support"])} key="4">
//           <Paragraph>
//             {formatMessage(helpMessages["contact-support"])}
//           </Paragraph>
//         </Panel>
//       </Collapse>
//     </>
//   );
// }
