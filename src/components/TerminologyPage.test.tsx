import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, expect, it } from "vitest";
import TerminologyPage from "./TerminologyPage";
import { terminology } from "../data/terminology";
import { getQuestionProgress } from "../data/questionProgress";
import { getAllMissedQuestions } from "../data/missedQuestions";
import { getTestHistory } from "../data/history";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let container: HTMLDivElement;
let root: Root;
beforeEach(() => { localStorage.clear(); container = document.createElement("div"); document.body.append(container); root = createRoot(container); });
afterEach(async () => { await act(async () => root.unmount()); container.remove(); });
const button = (text: string) => [...container.querySelectorAll("button")].find(item => item.textContent === text)!;
async function open(slug = "react") {
  await act(async () => root.render(<MemoryRouter initialEntries={[`/terminology/${slug}`]}><Routes><Route path="/terminology/:topicSlug" element={<TerminologyPage />} /></Routes></MemoryRouter>));
}
async function click(text: string) { await act(async () => button(text).click()); }
async function answer(correct: boolean, slug = "react") {
  const question = container.querySelector(".quiz-card h2")!.textContent!;
  const term = terminology[slug].find(item => question.includes(item.definition) || question === `Vad betyder ${item.term}?`)!;
  expect(term).toBeDefined();
  const expected = question.startsWith("Vad betyder") ? term.definition : term.term;
  const choice = [...container.querySelectorAll<HTMLButtonElement>(".quiz-option")].find(item => item.textContent!.slice(1) === expected)!;
  const selected = correct ? choice : [...container.querySelectorAll<HTMLButtonElement>(".quiz-option")].find(item => item !== choice)!;
  await act(async () => selected.click());
  await click("Rätta svar");
  return term;
}

it("grades a complete round once, saves missed-question snapshots and retries only mistakes", async () => {
  await open();
  expect(container.querySelectorAll('nav[aria-label="Terminologi per ämne"] a')).toHaveLength(14);
  expect(button("Rätta svar").disabled).toBe(true);
  const missedTerm = await answer(false);
  expect(container.querySelector('[role="status"]')!.textContent).toContain("Inte riktigt");
  expect([...container.querySelectorAll<HTMLButtonElement>(".quiz-option")].every(b => b.disabled)).toBe(true);
  expect(getAllMissedQuestions()[0].explanation).toContain(missedTerm.example);
  await click("Nästa fråga");
  for (let i = 1; i < 8; i++) {
    await answer(true);
    await click(i === 7 ? "Visa resultat" : "Nästa fråga");
  }
  expect(container.textContent).toContain("7 av 8 rätt");
  expect(getTestHistory()).toHaveLength(1);
  expect(getTestHistory()[0]).toMatchObject({ score: 7, total: 8, topics: ["Terminologi: React"] });
  expect(Object.values(getQuestionProgress()).every(item => item.seen === 1)).toBe(true);
  await click("Öva missade begrepp (1)");
  expect(container.textContent).toContain("Fråga 1 av 1");
  expect((await answer(true)).id).toBe(missedTerm.id);
  await click("Visa resultat");
  expect(getTestHistory()).toHaveLength(2);
  await click("Öva igen");
  expect(container.textContent).toContain("Fråga 1 av 8");
  expect(button("Rätta svar").disabled).toBe(true);
});

it("resets choices when switching direction or navigating to another subject", async () => {
  await open();
  await answer(true);
  await act(async () => {
    const select = container.querySelector("select")!;
    select.value = "definition";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  expect(container.querySelector(".quiz-card h2")!.textContent).toMatch(/^Vad betyder/);
  expect(button("Rätta svar").disabled).toBe(true);
  expect(container.querySelector('[role="status"]')).toBeNull();
  await answer(true);
  expect(Object.keys(getQuestionProgress()).some(id => id.endsWith("-definition"))).toBe(true);
  const link = container.querySelector<HTMLAnchorElement>('a[href="/terminology/state"]')!;
  await act(async () => link.click());
  expect(container.querySelector("h1")!.textContent).toBe("Terminologi · State");
  expect(container.querySelector("select")!.value).toBe("term");
  expect(container.textContent).toContain("Fråga 1 av 8");
  expect(button("Rätta svar").disabled).toBe(true);
  expect(container.querySelector("details")!.open).toBe(false);
  expect(container.querySelectorAll("dt")).toHaveLength(8);
});

it("handles an unknown subject without starting an invalid quiz", async () => {
  await open("unknown");
  expect(container.textContent).toContain("Ämnet hittades inte");
  expect(container.querySelector(".quiz-option")).toBeNull();
  expect(container.querySelector('a[href="/topics"]')).not.toBeNull();
});
