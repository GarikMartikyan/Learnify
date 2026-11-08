import { useNavigate } from "react-router";
import { routes } from "../constants/routes.ts";
import type { IEnrollment } from "../constants/interfaces/enrollment.interfaces.ts";

/** Opens the item to continue with: the next chapter, otherwise the course's learning view. */
export function useOpenNextItem() {
  const navigate = useNavigate();
  return (enrollment: IEnrollment) => {
    const next = enrollment.nextItem;
    if (next?.itemType === "chapter" && next.chapterId) {
      navigate(routes.learningChapter(enrollment.courseId, next.chapterId));
    } else {
      navigate(routes.learning(enrollment.courseId));
    }
  };
}
