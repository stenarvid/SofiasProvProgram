import { expect, it } from "vitest";
import { studyTopics } from "./studyTopics";
import { studyLessons } from "./studyLessons";
import { lessonQuickErrors, lessonReadingQuestions, trainingLessons } from "./lessonTraining";

it("covers every lesson page twice in both question banks with unique ids and relevant context", () => {
  const pages = studyTopics.flatMap((topic) => topic.pages);
  expect(trainingLessons).toHaveLength(pages.length);
  for (const bank of [lessonQuickErrors, lessonReadingQuestions]) {
    expect(bank).toHaveLength(pages.length * 2);
    expect(new Set(bank.map((question) => question.id)).size).toBe(bank.length);
    for (const topic of studyTopics) {
      topic.pages.forEach((page, index) => {
        const questions = bank.filter((question) => question.pageId === page.id);
        expect(questions).toHaveLength(2);
        for (const question of questions) {
          expect(question.topic).toBe(topic.title);
          expect(question.pageTitle).toBe(page.title);
          expect(question.lessonUrl).toBe(`/topics?topic=${topic.slug}&page=${index + 1}`);
          expect(question.code).toBe(studyLessons[page.id].code);
          expect(new Set(question.options).size).toBe(question.options.length);
          expect(question.explanation.length).toBeGreaterThan(20);
        }
      });
    }
  }
});

it("asks for exactly one authored misconception without marking true lesson facts as errors", () => {
  for (const question of lessonQuickErrors) {
    const lesson = studyLessons[question.pageId];
    expect(lesson.statements.slice(2)).toContain(question.options[question.answer]);
    expect(question.options.filter((_, index) => index !== question.answer)).toEqual(lesson.statements.slice(0, 2));
    expect(question.explanation).toContain(lesson.statementExplanation);
  }
});

it("preserves lesson-specific reading answers and explanations", () => {
  for (const lesson of trainingLessons) {
    const questions = lessonReadingQuestions.filter((question) => question.pageId === lesson.pageId);
    questions.forEach((question, index) => {
      expect(question.question).toBe(lesson.questions[index][0]);
      expect(question.options[question.answer]).toBe(lesson.questions[index][1]);
      expect(question.explanation).toBe(lesson.questions[index][5]);
    });
  }
});
