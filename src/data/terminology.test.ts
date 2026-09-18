import { expect, it } from "vitest";
import { studyTopics } from "./studyTopics";
import { createTerminologyQuestions, terminology } from "./terminology";

it("provides at least eight unique, explained terms for every course subject", () => {
  expect(Object.keys(terminology).sort()).toEqual(studyTopics.map(topic => topic.slug).sort());
  for (const terms of Object.values(terminology)) {
    expect(terms.length).toBeGreaterThanOrEqual(8);
    expect(new Set(terms.map(item => item.id)).size).toBe(terms.length);
    expect(new Set(terms.map(item => item.term)).size).toBe(terms.length);
    expect(new Set(terms.map(item => item.definition)).size).toBe(terms.length);
    for (const item of terms) {
      expect(item.definition.length).toBeGreaterThan(25);
      expect(item.example.length).toBeGreaterThan(25);
    }
  }
});

it("keeps stable identities and the correct answer through both directions and shuffling", () => {
  const ids = new Set<string>();
  for (const slug of Object.keys(terminology)) for (const direction of ["term", "definition"] as const) {
    const first = createTerminologyQuestions(slug, direction, () => 0);
    const second = createTerminologyQuestions(slug, direction, () => 0.99);
    expect(first.map(q => q.id).sort()).toEqual(second.map(q => q.id).sort());
    for (const question of first) {
      expect(ids.has(question.id)).toBe(false);
      ids.add(question.id);
      const item = terminology[slug].find(t => t.id === question.termId)!;
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options[question.answer]).toBe(direction === "term" ? item.term : item.definition);
      expect(second.find(q => q.id === question.id)!.options[second.find(q => q.id === question.id)!.answer]).toBe(question.options[question.answer]);
      expect(question.explanation).toContain(item.example);
    }
  }
  expect(ids.size).toBe(Object.values(terminology).flat().length * 2);
  expect(createTerminologyQuestions("missing", "term")).toEqual([]);
});
