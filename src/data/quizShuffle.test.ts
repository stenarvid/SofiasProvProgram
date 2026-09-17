import { describe, expect, it, vi } from "vitest";
import { shuffle, shuffleQuestionOptions, shuffleMultipleAnswers } from "./quizShuffle";
import { getStudyPageQuizQuestions } from "./studyPageQuiz";
import { studyTopics } from "./studyTopics";

describe("quiz shuffling", () => {
  it("can place the right answer in every position without mutating the source", () => {
    const source = { id: "stable", options: ["right", "b", "c", "d"], answer: 0 };
    const positions = new Set<number>();
    for (const a of [0, 0.3, 0.6, 0.99]) for (const b of [0, 0.4, 0.99]) for (const c of [0, 0.99]) {
      const draws = [a, b, c];
      const result = shuffleQuestionOptions(source, () => draws.shift()!);
      positions.add(result.answer);
      expect(result.options[result.answer]).toBe("right");
      expect(result.id).toBe("stable");
      expect(new Set(result.options).size).toBe(4);
    }
    expect([...positions].sort()).toEqual([0, 1, 2, 3]);
    expect(source.options).toEqual(["right", "b", "c", "d"]);
    expect(source.answer).toBe(0);
  });

  it("preserves all multi-select answers and supports empty review definitions", () => {
    const result = shuffleMultipleAnswers({ options: ["a", "b", "c", "d"], correctAnswers: [0, 2] }, () => 0);
    expect(result.correctAnswers.map(index => result.options[index]).sort()).toEqual(["a", "c"]);
    expect(shuffleMultipleAnswers({ options: [], correctAnswers: [] })).toEqual({ options: [], correctAnswers: [] });
    expect(shuffle([])).toEqual([]);
  });

  it("reshuffles page answers on a new attempt while preserving question IDs", () => {
    const topic = studyTopics[0];
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    try {
      const first = getStudyPageQuizQuestions(topic.pages[0], topic, studyTopics);
      random.mockReturnValue(0.999);
      const second = getStudyPageQuizQuestions(topic.pages[0], topic, studyTopics);
      expect(first.map(q => q.id)).toEqual(second.map(q => q.id));
      expect(first[0].options).not.toEqual(second[0].options);
      expect(first[0].options[first[0].correctAnswers[0]]).toBe(second[0].options[second[0].correctAnswers[0]]);
    } finally {
      random.mockRestore();
    }
  });
});
