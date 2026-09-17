import { beforeEach, describe, expect, it } from "vitest";
import { getAllMissedQuestions } from "./missedQuestions";
import {
  getWrongQuestionIds,
  recordQuestionResult
} from "./questionProgress";

const snapshot = {
  source: "page" as const,
  pageTitle: "JSX och rendering",
  type: "single" as const,
  options: ["A", "B", "C", "D"],
  correctAnswers: [1],
  explanation: "B är rätt."
};

describe("resolved missed questions", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds a question after a wrong answer", () => {
    recordQuestionResult(
      "theory-react-p2-q3",
      "React",
      "Testfråga",
      false,
      snapshot
    );

    expect(getAllMissedQuestions().map((q) => q.id)).toContain("theory-react-p2-q3");
    expect(getWrongQuestionIds()).toContain("theory-react-p2-q3");
  });

  it("removes a missed question after it is answered correctly", () => {
    recordQuestionResult(
      "theory-react-p2-q3",
      "React",
      "Testfråga",
      false,
      snapshot
    );

    recordQuestionResult(
      "theory-react-p2-q3",
      "React",
      "Testfråga",
      true,
      snapshot
    );

    expect(getAllMissedQuestions().map((q) => q.id)).not.toContain("theory-react-p2-q3");
    expect(getWrongQuestionIds()).not.toContain("theory-react-p2-q3");
  });

  it("returns to missed questions if the learner gets it wrong again later", () => {
    recordQuestionResult(
      "theory-react-p2-q3",
      "React",
      "Testfråga",
      false,
      snapshot
    );
    recordQuestionResult(
      "theory-react-p2-q3",
      "React",
      "Testfråga",
      true,
      snapshot
    );
    recordQuestionResult(
      "theory-react-p2-q3",
      "React",
      "Testfråga",
      false,
      snapshot
    );

    expect(getAllMissedQuestions().map((q) => q.id)).toContain("theory-react-p2-q3");
  });
});
