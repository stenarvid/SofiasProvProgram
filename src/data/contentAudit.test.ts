import { describe, expect, it } from "vitest";
import { questionBank } from "./questionBank";
import { studyTopics } from "./studyTopics";
import { theoryExplanations } from "./theoryExplanations";
import { COURSE_MONACO_TYPES } from "./monacoCourseTypes";

describe("study content audit", () => {
  const canonicalTopics = studyTopics.map((topic) => topic.title);
  const allPages = studyTopics.flatMap((topic) =>
    topic.pages.map((page) => ({ topic: topic.title, ...page }))
  );

  it("has the expected 14 subjects and 56 theory pages", () => {
    expect(studyTopics).toHaveLength(14);
    expect(allPages).toHaveLength(56);
  });

  it("uses unique topic slugs and page ids", () => {
    const slugs = studyTopics.map((topic) => topic.slug);
    const ids = allPages.map((page) => page.id);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a multi-paragraph explanation for every theory page", () => {
    for (const page of allPages) {
      const paragraphs = theoryExplanations[page.id];
      expect(paragraphs, `Missing explanation for ${page.id}`).toBeDefined();
      expect(paragraphs.length, `${page.id} needs more explanation`).toBeGreaterThanOrEqual(2);

      for (const paragraph of paragraphs) {
        expect(paragraph.trim().length, `${page.id} has a too-short paragraph`).toBeGreaterThan(45);
      }
    }
  });

  it("has complete page quiz, cheat sheet and code exercise data", () => {
    for (const page of allPages) {
      expect(page.bullets.length, `${page.id} bullets`).toBeGreaterThanOrEqual(3);
      expect(page.cheat.length, `${page.id} cheat`).toBeGreaterThanOrEqual(3);
      expect(page.code.trim().length, `${page.id} code`).toBeGreaterThan(0);
      expect(page.codeTask.trim().length, `${page.id} code task`).toBeGreaterThan(0);

      expect(page.quiz.options, `${page.id} quiz options`).toHaveLength(4);
      expect(new Set(page.quiz.options).size, `${page.id} duplicate options`).toBe(4);
      expect(page.quiz.answer, `${page.id} answer index`).toBeGreaterThanOrEqual(0);
      expect(page.quiz.answer, `${page.id} answer index`).toBeLessThan(4);
    }
  });

  it("has a canonical global quiz topic for every question", () => {
    for (const question of questionBank) {
      expect(canonicalTopics, `Unknown topic ${question.topic}`).toContain(question.topic);
    }
  });

  it("has exactly four global quiz questions per subject", () => {
    for (const topic of canonicalTopics) {
      expect(
        questionBank.filter((question) => question.topic === topic),
        `${topic} global quiz count`
      ).toHaveLength(4);
    }
  });

  it("has unique global question ids and valid answers", () => {
    const ids = questionBank.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(questionBank).toHaveLength(56);

    for (const question of questionBank) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(4);
      expect(question.explanation.trim().length).toBeGreaterThan(20);
    }
  });

  it("keeps the first React code exercise aligned with its example", () => {
    const react = studyTopics.find((topic) => topic.slug === "react");
    const page = react?.pages.find((item) => item.id === "react-p1");

    expect(page).toBeDefined();
    expect(page?.code).toContain("function Hello()");
    expect(page?.code).toContain("<h1>Hej!</h1>");
    expect(page?.codeTask).toContain("Hello");
    expect(page?.codeTask).toContain("Hej!");
  });


  it("covers the libraries used by Monaco exercises", () => {
    expect(COURSE_MONACO_TYPES).toContain('declare module "react"');
    expect(COURSE_MONACO_TYPES).toContain('declare module "react-router-dom"');
    expect(COURSE_MONACO_TYPES).toContain('declare module "@tanstack/react-query"');
    expect(COURSE_MONACO_TYPES).toContain('declare module "jotai"');
    expect(COURSE_MONACO_TYPES).toContain('declare module "zod"');
    expect(COURSE_MONACO_TYPES).toContain('declare module "hono"');
  });

});
