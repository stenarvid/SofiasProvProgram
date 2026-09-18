import { describe, expect, it } from "vitest";
import { studyGuidance } from "./studyGuidance";
import { studyBasics } from "./studyBasics";
import { studyTopics } from "./studyTopics";
import { getPageCodeGradeMode, gradePageCode } from "./pageCodeGrader";

describe("lesson prerequisites and assignment alignment", () => {
  const pages = studyTopics.flatMap(topic => topic.pages);

  it("uses the reviewed task and guidance on every page and covers every subject's basics", () => {
    expect(Object.keys(studyGuidance).sort()).toEqual(pages.map(page => page.id).sort());
    expect(Object.keys(studyBasics).sort()).toEqual(studyTopics.map(topic => topic.slug).sort());
    for (const page of pages) {
      expect(page.guidance, page.id).toBe(studyGuidance[page.id]);
      expect(page.codeTask, page.id).toBe(studyGuidance[page.id].task);
    }
  });

  it("links to existing prerequisites without circular learning dependencies", () => {
    const visit = (id: string, path: string[]) => {
      expect(path, `Circular prerequisite: ${[...path, id].join(" → ")}`).not.toContain(id);
      expect(studyGuidance[id], `Missing prerequisite ${id}`).toBeDefined();
      for (const prerequisite of studyGuidance[id].prerequisites) visit(prerequisite, [...path, id]);
    };
    for (const page of pages) visit(page.id, []);
  });

  it("does not automatically approve validation merely because it is mentioned after fetch", async () => {
    for (const id of ["zod-p4", "forms-p3"]) {
      expect(getPageCodeGradeMode(id)).toBe("auto");
      const result = await gradePageCode(id, `async function handleSubmit() {
        await fetch('/api/users');
        schema.safeParse({ name, email });
      }`);
      expect(result.passed, id).toBe(false);
    }
  });

  it("supports automatic grading of separate file sections", () => {
    for (const page of pages.filter(page => page.guidance?.format === "files")) {
      expect(getPageCodeGradeMode(page.id), page.id).toBe("auto");
    }
  });
});
