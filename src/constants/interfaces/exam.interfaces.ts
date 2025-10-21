export interface IQuestion {
  type: "multiple-choice" | "true-false" | "text";
  question: string;
  options?: string[];
  answer?: string;
}

export interface IExam {
  id: number;
  title: string;
  questions: IQuestion[];
  durationMinutes: number;
}
