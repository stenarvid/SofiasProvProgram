import { studyTopics } from "./studyTopics";
import { studyLessons } from "./studyLessons";

export type LessonSource = { pageId: string; pageTitle: string; lessonUrl: string };

export const trainingLessons = studyTopics.flatMap((topic) => topic.pages.map((page, index) => ({
  ...studyLessons[page.id],
  topic: topic.title,
  pageId: page.id,
  pageTitle: page.title,
  lessonUrl: `/topics?topic=${topic.slug}&page=${index + 1}`
})));

// Statements are authored as two true statements followed by two misconceptions.
// Keep one misconception per question so exactly one option is incorrect.
export const lessonQuickErrors = trainingLessons.flatMap((lesson) =>
  lesson.statements.slice(2).map((misconception, index) => ({
    id: `quick-error-${lesson.pageId}-${index + 1}`,
    topic: lesson.topic,
    pageId: lesson.pageId,
    pageTitle: lesson.pageTitle,
    lessonUrl: lesson.lessonUrl,
    code: lesson.code,
    question: "Vilket påstående är fel?",
    context: "Koden är lektionens referensexempel. Hitta missförståndet bland påståendena, inte ett fel i referenskoden.",
    options: [misconception, lesson.statements[0], lesson.statements[1]],
    answer: 0,
    explanation: `Felaktigt påstående: ${misconception} ${lesson.statementExplanation}`
  }))
);

export const lessonReadingQuestions = trainingLessons.flatMap((lesson) =>
  lesson.questions.map(([question, correct, wrong1, wrong2, wrong3, explanation], index) => ({
    id: `reading-${lesson.pageId}-${index + 1}`,
    topic: lesson.topic,
    pageId: lesson.pageId,
    pageTitle: lesson.pageTitle,
    lessonUrl: lesson.lessonUrl,
    code: lesson.code,
    question,
    options: [correct, wrong1, wrong2, wrong3],
    answer: 0,
    explanation
  }))
);
