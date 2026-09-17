import { shuffleMultipleAnswers } from "./quizShuffle";
import type { StudyPage, StudyTopic } from "./studyTopics";
import { studyLessons, type LessonQuestion } from "./studyLessons";

export type StudyPageQuizQuestion = {
  id: string;
  type: "single" | "multi";
  question: string;
  code?: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
};

const shuffleAnswers = shuffleMultipleAnswers;

function single(id: string, content: LessonQuestion): StudyPageQuizQuestion {
  const [question, correct, wrong1, wrong2, wrong3, explanation] = content;
  return shuffleAnswers({ id, type: "single", question, options: [correct, wrong1, wrong2, wrong3], correctAnswers: [0], explanation });
}

export function getStudyPageQuizQuestions(
  page: StudyPage,
  _currentTopic: StudyTopic,
  _allTopics: StudyTopic[]
): StudyPageQuizQuestion[] {
  const lesson = studyLessons[page.id];
  // New pages retain their own question until supplementary questions are authored.
  // True facts from unrelated subjects must never be used as false answers.
  if (!lesson) return [shuffleAnswers({
    id: `${page.id}-original`, type: "single", question: page.quiz.question,
    options: [...page.quiz.options], correctAnswers: [page.quiz.answer],
    explanation: page.quiz.explanation ?? page.intro
  })];
  return [
    single(`${page.id}-original`, lesson.questions[0]),
    shuffleAnswers({
      id: `${page.id}-multi`, type: "multi" as const,
      question: `Vilka påståenden stämmer om ${page.title.toLocaleLowerCase("sv")}? Välj två svar.`,
      options: [...lesson.statements], correctAnswers: [0, 1],
      explanation: lesson.statementExplanation
    }),
    single(`${page.id}-recap`, lesson.questions[1])
  ].map(question => ({ ...question, code: lesson.code }));
}

export function isQuizSelectionCorrect(selected: number[], correctAnswers: number[]) {
  const a = [...selected].sort((x, y) => x - y);
  const b = [...correctAnswers].sort((x, y) => x - y);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
