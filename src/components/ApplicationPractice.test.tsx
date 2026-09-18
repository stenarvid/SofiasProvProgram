import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it } from "vitest";
import ApplicationPractice from "./ApplicationPractice";
import { applicationQuestions } from "../data/applicationQuestions";
import { getCodeProgress } from "../data/codeProgress";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let container: HTMLDivElement;
let root: Root;
beforeEach(() => { localStorage.clear(); container = document.createElement("div"); document.body.append(container); root = createRoot(container); });
afterEach(async () => { await act(async () => root.unmount()); container.remove(); });
const button = (label: string) => [...container.querySelectorAll("button")].find(b => b.textContent === label)!;
async function choose(correct: boolean) {
  for (const [i, field] of [...container.querySelectorAll("fieldset")].entries()) {
    const q = applicationQuestions["server-p3"][i];
    const label = [...field.querySelectorAll("label")].find(item => item.textContent === q.options[correct ? q.answer : (q.answer + 1) % q.options.length])!;
    await act(async () => label.querySelector("input")!.click());
  }
}
it("grades actual choices, locks feedback, records one attempt and allows retry", async () => {
  await act(async () => root.render(<ApplicationPractice pageId="server-p3" topic="Server" title="Status" />));
  expect(button("Rätta").disabled).toBe(true);
  await choose(false);
  await act(async () => button("Rätta").click());
  expect(container.querySelector('[role="status"]')?.textContent).toContain("0%");
  expect([...container.querySelectorAll("fieldset")].every(field => field.disabled)).toBe(true);
  expect(getCodeProgress()["theory-code-server-p3"].passes).toBe(0);
  expect(getCodeProgress()["theory-code-server-p3"].attempts).toBe(1);
  await act(async () => button("Försök igen").click());
  expect(container.querySelectorAll("input:checked")).toHaveLength(0);
  await choose(true);
  await act(async () => button("Rätta").click());
  expect(container.querySelector('[role="status"]')?.textContent).toContain("100%");
  expect(getCodeProgress()["theory-code-server-p3"].passes).toBe(1);
  expect(getCodeProgress()["theory-code-server-p3"].attempts).toBe(2);
});
it("resets answers and result when navigating to another keyed lesson", async () => {
  await act(async () => root.render(<ApplicationPractice key="server-p3" pageId="server-p3" topic="Server" title="Status" />));
  await choose(true);
  await act(async () => button("Rätta").click());
  await act(async () => root.render(<ApplicationPractice key="query-p4" pageId="query-p4" topic="Query" title="Cache" />));
  expect(container.querySelector('[role="status"]')).toBeNull();
  expect(container.querySelectorAll("input:checked")).toHaveLength(0);
  expect(container.textContent).toContain("ProductList");
  expect(button("Rätta").disabled).toBe(true);
});
