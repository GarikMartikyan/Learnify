export interface IChapterContent {
  type: "youtube" | "title" | "text" | "image";
  value: string;
}

export interface IChapter {
  id: number;
  title: string;
  content: IChapterContent[];
}
