import { beforeEach, describe, expect, it } from "vitest";
import {
  getWrongQuestionCountFrom,
  getWrongQuestionIdsFrom,
  recordQuestionResult
} from "./questionProgress";

describe("questionProgress missed-question filtering", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("counts only missed questions that the destination quiz can resolve", () => {
    recordQuestionResult("q001", "React", "Global question", false);
    recordQuestionResult("theory-react-p2-q1", "React", "Page quiz question", false);

    expect(getWrongQuestionIdsFrom(["q001", "q002"])).toEqual(["q001"]);
    expect(getWrongQuestionCountFrom(["q001", "q002"])).toBe(1);
  });

  it("does not advertise unresolved page-specific misses as global missed questions", () => {
    recordQuestionResult("theory-react-p2-q1", "React", "Page quiz question", false);

    expect(getWrongQuestionIdsFrom(["q001", "q002"])).toEqual([]);
    expect(getWrongQuestionCountFrom(["q001", "q002"])).toBe(0);
  });
});
