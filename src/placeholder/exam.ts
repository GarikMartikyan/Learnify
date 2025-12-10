import type { IExam } from "../constants/interfaces/exam.interfaces.ts";

export const mockExam: IExam = {
  id: 1,
  title: "JavaScript Basics Quiz",
  durationMinutes: 30,
  questions: [
    {
      type: "multiple-choice",
      question: "Which of the following is a JavaScript data type?",
      options: ["Number", "Boolean", "String", "All of the above"],
    },
    {
      type: "true-false",
      question: "JavaScript is a statically typed language.",
    },

    {
      type: "multiple-choice",
      question:
        "Which method is used to add an element at the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
    },
  ],
};
