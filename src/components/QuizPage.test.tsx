import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, expect, it } from "vitest";
import QuizPage from "./QuizPage";
import { studyTopics } from "../data/studyTopics";
import { questionBank } from "../data/questionBank";
import { terminology } from "../data/terminology";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let container: HTMLDivElement;
let root: Root;
beforeEach(async () => {
  localStorage.clear();
  container = document.createElement("div"); document.body.append(container); root = createRoot(container);
  await act(async () => root.render(<MemoryRouter><QuizPage /></MemoryRouter>));
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); });
const button = (text: string) => [...container.querySelectorAll("button")].find(item => item.textContent === text)!;
async function focus(value: string) {
  await act(async () => {
    const select = container.querySelector<HTMLSelectElement>("#quiz-focus")!;
    select.value = value; select.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

it("offers every subject, every lesson and terminology from every subject", () => {
  expect(container.querySelectorAll('input[type="checkbox"]')).toHaveLength(studyTopics.length);
  for (const topic of studyTopics) {
    expect(container.querySelector<HTMLInputElement>(`input[aria-label="${topic.title}"]`)?.checked).toBe(true);
    expect(questionBank.filter(q => q.topic === topic.title && q.category === "terminology")).toHaveLength(terminology[topic.slug].length * 2);
    for (const page of topic.pages) {
      expect(container.querySelector(`option[value="${page.id}"]`)).not.toBeNull();
      expect(questionBank.filter(q => q.pageId === page.id).length).toBeGreaterThan(0);
    }
  }
});

it.each(["react-p5", "server-p5"])("starts a focused quiz for %s without unrelated questions", async pageId => {
  await focus(pageId);
  expect(container.textContent).toContain("Testet innehåller 2 frågor");
  await act(async () => button("Starta test").click());
  const question = container.querySelector("pre")!.textContent!;
  expect(questionBank.filter(q => q.pageId === pageId).map(q => q.question)).toContain(question);
  expect(container.querySelectorAll(".quiz-option")).toHaveLength(4);
  expect(container.querySelector("textarea")).toBeNull();
});

it("clears an obsolete lesson focus when the selected subjects change", async () => {
  await focus("server-p5");
  await act(async () => button("Rensa").click());
  expect(button("Starta test").disabled).toBe(true);
  expect(container.querySelector<HTMLSelectElement>("#quiz-focus")!.value).toBe("");
  await act(async () => container.querySelector<HTMLInputElement>('input[aria-label="React"]')!.click());
  expect(container.querySelector('option[value="server-p5"]')).toBeNull();
  await focus("terminology");
  expect(container.textContent).toContain("16 frågor tillgängliga");
  await act(async () => button("Starta test").click());
  expect(questionBank.filter(q => q.topic === "React" && q.category === "terminology").map(q => q.question)).toContain(container.querySelector("pre")!.textContent);
});
