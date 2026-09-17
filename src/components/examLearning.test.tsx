import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FinalExamPage from "./FinalExamPage";
import ExamModePage from "./ExamModePage";

vi.mock("@monaco-editor/react", () => ({ default: ({ value, options }: { value: string; options: { readOnly?: boolean } }) => <textarea aria-label="code" value={value} readOnly={options.readOnly} onChange={() => {}} /> }));
vi.mock("../data/monacoCourseTypes", () => ({ configureCourseEditor: vi.fn() }));
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  localStorage.clear();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
async function click(label: string) {
  const button = [...container.querySelectorAll("button")].find(button => button.textContent === label);
  expect(button, label).toBeDefined();
  await act(async () => button!.click());
}

describe("exam learning", () => {
  it("grades shuffled final-exam choices and reviews unanswered practical tasks honestly", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    await act(async () => root.render(<FinalExamPage />));
    for (let index = 0; index < 10; index++) {
      const options = container.querySelectorAll<HTMLButtonElement>(".quiz-option");
      // With these deterministic draws Fisher–Yates moves original option 0 last.
      await act(async () => options[3].click());
      await click("Svara");
    }
    for (let stage = 0; stage < 4; stage++) await click("Nästa del");
    await click("Avsluta slutprovet");
    expect(container.textContent).toContain("10/10");
    expect(container.textContent).toContain("Inget svar lämnat.");
    expect(container.textContent).toContain("Testa counter och fetch");
    expect(container.textContent).toContain("självbedömning");
  });

  it("keeps timed-exam solutions visible and read-only after time expires", async () => {
    vi.useFakeTimers();
    await act(async () => root.render(<ExamModePage />));
    await click("Starta provläge");
    expect(container.querySelectorAll('textarea[aria-label="code"]')).toHaveLength(5);
    await act(async () => vi.advanceTimersByTime(30 * 60 * 1000));
    const answers = [...container.querySelectorAll<HTMLTextAreaElement>('textarea[aria-label="code"]')];
    expect(answers).toHaveLength(5);
    expect(answers.every(answer => answer.readOnly)).toBe(true);
  });
});
