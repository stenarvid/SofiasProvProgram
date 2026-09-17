import type { LessonSource } from "../data/lessonTraining";

export default function TrainingLessonSource({ source }: { source: Partial<LessonSource> }) {
  if (!source.lessonUrl) return null;
  return <p className="muted">Lektionssida: <a href={source.lessonUrl}>{source.pageTitle}</a></p>;
}
