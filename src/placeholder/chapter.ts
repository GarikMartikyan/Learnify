import type { IChapter } from "../constants/interfaces/chapter.interfaces.ts";

export const mockChapter: IChapter = {
  id: 1,
  title: "Introduction to JavaScript",
  content: [
    { type: "title", value: "Welcome to JavaScript!" },
    {
      type: "text",
      value:
        "In this chapter, you will learn the basics of JavaScript, including syntax, variables, and functions.",
    },
    {
      type: "youtube",
      value: "https://www.youtube.com/embed/W6NZfCO5SIk",
    },
    {
      type: "title",
      value: "Variables and Data Types",
    },
    {
      type: "text",
      value:
        "JavaScript supports several types of variables: numbers, strings, booleans, objects, and arrays.",
    },
    {
      type: "image",
      value: "https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg",
    },
    {
      type: "text",
      value:
        "You can declare a variable using `let`, `const`, or `var` (avoid `var` in modern code).",
    },
  ],
};
