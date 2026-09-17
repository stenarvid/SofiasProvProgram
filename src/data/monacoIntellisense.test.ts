import { describe, expect, it } from "vitest";
import {
  COURSE_MONACO_EDITOR_OPTIONS,
  COURSE_SNIPPETS
} from "./monacoCourseTypes";

describe("course Monaco IntelliSense", () => {
  it("supports Tab completion and top-priority snippets", () => {
    expect(COURSE_MONACO_EDITOR_OPTIONS.tabCompletion).toBe("on");
    expect(COURSE_MONACO_EDITOR_OPTIONS.snippetSuggestions).toBe("top");
    expect(COURSE_MONACO_EDITOR_OPTIONS.suggestOnTriggerCharacters).toBe(true);
    expect(COURSE_MONACO_EDITOR_OPTIONS.fixedOverflowWidgets).toBe(true);
  });

  it("contains JSX/HTML-style snippets such as h1 + Tab", () => {
    const labels = COURSE_SNIPPETS.map((snippet) => snippet.label);
    expect(labels).toContain("h1");
    expect(labels).toContain("div");
    expect(labels).toContain("button");
    expect(labels).toContain("input");
    expect(labels).toContain("form");
  });

  it("contains snippets for every course library", () => {
    const labels = COURSE_SNIPPETS.map((snippet) => snippet.label);

    expect(labels).toContain("us");
    expect(labels).toContain("route");
    expect(labels).toContain("query");
    expect(labels).toContain("atom");
    expect(labels).toContain("zobj");
    expect(labels).toContain("hget");
    expect(labels).toContain("fetchget");
  });
});
