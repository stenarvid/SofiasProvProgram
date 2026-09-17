import { beforeEach, describe, expect, it } from "vitest";
import {
  clearCodeProgress,
  getCodeProgress,
  recordCodeAttempt
} from "./codeProgress";

describe("saved code progress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores the latest submitted code", () => {
    recordCodeAttempt("x", "React", "Test", 67, false, "const a = 1;");
    expect(getCodeProgress().x.lastCode).toBe("const a = 1;");
  });

  it("keeps the code from the best score", () => {
    recordCodeAttempt("x", "React", "Test", 100, true, "const best = true;");
    recordCodeAttempt("x", "React", "Test", 50, false, "const later = false;");

    const progress = getCodeProgress().x;
    expect(progress.lastCode).toBe("const later = false;");
    expect(progress.bestCode).toBe("const best = true;");
    expect(progress.bestScore).toBe(100);
  });

  it("still reads old-style progress entries without code", () => {
    localStorage.setItem(
      "provtraning-code-progress-v1",
      JSON.stringify({
        old: {
          exerciseId: "old",
          topic: "React",
          title: "Old",
          attempts: 1,
          passes: 0,
          bestScore: 50,
          lastScore: 50,
          hintsUsed: 0,
          solutionViews: 0,
          lastAttempt: "2026-09-16T00:00:00.000Z"
        }
      })
    );

    expect(getCodeProgress().old.lastCode).toBeUndefined();
  });

  it("can still clear code progress", () => {
    recordCodeAttempt("x", "React", "Test", 100, true, "ok");
    clearCodeProgress();
    expect(Object.keys(getCodeProgress())).toHaveLength(0);
  });
});
