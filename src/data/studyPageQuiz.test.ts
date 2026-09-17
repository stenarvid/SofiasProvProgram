import { describe, expect, it } from "vitest";
import { studyTopics } from "./studyTopics";
import {
  getStudyPageQuizQuestions,
  isQuizSelectionCorrect
} from "./studyPageQuiz";

describe("study page quizzes", () => {
  it("creates three questions for every theory page", () => {
    for (const topic of studyTopics) {
      for (const page of topic.pages) {
        const questions = getStudyPageQuizQuestions(page, topic, studyTopics);
        expect(questions).toHaveLength(3);
      }
    }
  });

  it("includes one multi-select question on every theory page", () => {
    for (const topic of studyTopics) {
      for (const page of topic.pages) {
        const questions = getStudyPageQuizQuestions(page, topic, studyTopics);
        expect(questions.filter((question) => question.type === "multi")).toHaveLength(1);
      }
    }
  });

  it("gives every generated question four unique options and valid answers", () => {
    for (const topic of studyTopics) {
      for (const page of topic.pages) {
        const questions = getStudyPageQuizQuestions(page, topic, studyTopics);

        for (const question of questions) {
          expect(question.options).toHaveLength(4);
          expect(new Set(question.options).size).toBe(4);
          expect(question.correctAnswers.length).toBeGreaterThanOrEqual(1);
          expect(question.correctAnswers.every((answer) => answer >= 0 && answer < 4)).toBe(true);

          if (question.type === "multi") {
            expect(question.correctAnswers.length).toBeGreaterThanOrEqual(2);
          }
        }
      }
    }
  });

  it("checks multi-select answers independent of click order", () => {
    expect(isQuizSelectionCorrect([2, 0], [0, 2])).toBe(true);
    expect(isQuizSelectionCorrect([0], [0, 2])).toBe(false);
    expect(isQuizSelectionCorrect([0, 1, 2], [0, 2])).toBe(false);
  });
});
