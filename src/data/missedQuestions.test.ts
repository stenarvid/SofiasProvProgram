import { beforeEach, describe, expect, it } from "vitest";
import { getAllMissedQuestions } from "./missedQuestions";
import { recordQuestionResult } from "./questionProgress";

describe("all missed questions", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and resolves the exact page-specific question snapshot", () => {
    recordQuestionResult(
      "theory-react-p2-q3",
      "React",
      'Vilket påstående sammanfattar bäst en viktig regel från "JSX och rendering"?',
      false,
      {
        source: "page",
        pageTitle: "JSX och rendering",
        type: "single",
        options: [
          "Använd path och element i modern Router.",
          "{ expression } kör JavaScript i JSX",
          "GET är standardmetoden.",
          "fetch → Promise"
        ],
        correctAnswers: [1],
        explanation: "{ expression } kör JavaScript i JSX"
      }
    );

    const item = getAllMissedQuestions().find(
      (question) => question.id === "theory-react-p2-q3"
    );

    expect(item).toBeTruthy();
    expect(item?.pageTitle).toBe("JSX och rendering");
    expect(item?.options[1]).toBe("{ expression } kör JavaScript i JSX");
    expect(item?.correctAnswers).toEqual([1]);
  });

  it("includes a missed global quiz question with a snapshot", () => {
    recordQuestionResult(
      "q001",
      "React",
      "Vad är React?",
      false,
      {
        source: "global",
        type: "single",
        options: ["UI-bibliotek", "Databas", "Server", "CSS"],
        correctAnswers: [0],
        explanation: "React används för UI."
      }
    );

    const item = getAllMissedQuestions().find((question) => question.id === "q001");
    expect(item?.source).toBe("global");
    expect(item?.options).toHaveLength(4);
  });

  it("keeps multi-select answer data exactly", () => {
    recordQuestionResult(
      "theory-react-p2-q2",
      "React",
      "Vilka påståenden hör till JSX?",
      false,
      {
        source: "page",
        pageTitle: "JSX och rendering",
        type: "multi",
        options: ["A", "B", "C", "D"],
        correctAnswers: [0, 2],
        explanation: "Två alternativ är rätt."
      }
    );

    const item = getAllMissedQuestions().find(
      (question) => question.id === "theory-react-p2-q2"
    );

    expect(item?.type).toBe("multi");
    expect(item?.correctAnswers).toEqual([0, 2]);
  });

  it("can recover an older page-specific miss by stored question text", () => {
    localStorage.setItem(
      "provtraning-question-progress-v2",
      JSON.stringify({
        "legacy-id-that-does-not-match": {
          questionId: "legacy-id-that-does-not-match",
          topic: "React",
          question: 'Vilket påstående sammanfattar bäst en viktig regel från "JSX och rendering"?',
          seen: 1,
          correct: 0,
          wrong: 1,
          lastAnswered: "2026-09-16T00:00:00.000Z"
        }
      })
    );

    const item = getAllMissedQuestions()[0];
    expect(item).toBeTruthy();
    expect(item.options.length).toBeGreaterThan(0);
  });
});
