import type { StudyPage, StudyTopic } from "./studyTopics";
import { studyLessons, type LessonQuestion } from "./studyLessons";

export type StudyPageQuizQuestion = {
  id: string;
  type: "single" | "multi";
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
};

function hash(text: string) {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}

function shuffleAnswers(question: StudyPageQuizQuestion): StudyPageQuizQuestion {
  const options = question.options.map((text, index) => ({ text, correct: question.correctAnswers.includes(index) }));
  let state = hash(question.id) || 1;
  for (let i = options.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [options[i], options[j]] = [options[j], options[i]];
  }
  return {
    ...question,
    options: options.map(option => option.text),
    correctAnswers: options.flatMap((option, index) => option.correct ? [index] : [])
  };
}

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
      id: `${page.id}-multi`, type: "multi",
      question: `Vilka påståenden stämmer om ${page.title.toLocaleLowerCase("sv")}? Välj två svar.`,
      options: [...lesson.statements], correctAnswers: [0, 1],
      explanation: lesson.statementExplanation
    }),
    single(`${page.id}-recap`, lesson.questions[1])
  ];
}

export function isQuizSelectionCorrect(selected: number[], correctAnswers: number[]) {
  const a = [...selected].sort((x, y) => x - y);
  const b = [...correctAnswers].sort((x, y) => x - y);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
