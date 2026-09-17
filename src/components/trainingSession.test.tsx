import React, { act, type ComponentType, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import QuickErrorsPage from "./QuickErrorsPage";
import CodeReadingPage from "./CodeReadingPage";
import TypeScriptErrorsPage from "./TypeScriptErrorsPage";
import HttpTrainerPage from "./HttpTrainerPage";
import OutputPredictionPage from "./OutputPredictionPage";
import ExplainCodePage from "./ExplainCodePage";
import ExplainPage from "./ExplainPage";
import FlashcardsPage from "./FlashcardsPage";
import MatchingPage from "./MatchingPage";
import CodeCompletionPage from "./CodeCompletionPage";
import DebugPage from "./DebugPage";
import PracticePage from "./PracticePage";
import MiniProjectsPage from "./MiniProjectsPage";
import ChainTasksPage from "./ChainTasksPage";
import ApiSimulatorPage from "./ApiSimulatorPage";
import ConceptMapPage from "./ConceptMapPage";
import { lessonQuickErrors, lessonReadingQuestions, trainingLessons } from "../data/lessonTraining";
import { studyTopics } from "../data/studyTopics";
import { MemoryRouter } from "react-router-dom";
import TopicsPage from "./TopicsPage";
import { recordCodeAttempt } from "../data/codeProgress";

vi.mock("@monaco-editor/react", () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) =>
    <textarea aria-label="Kod" value={value} onChange={(event) => onChange(event.target.value)} />
}));
vi.mock("react-live", () => ({
  LiveProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  LivePreview: () => null,
  LiveError: () => null
}));

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
});

function button(label: string) {
  return [...container.querySelectorAll("button")].find((item) => item.textContent?.trim() === label);
}
async function click(label: string) {
  const target = button(label);
  expect(target, label).toBeDefined();
  expect(target!.disabled, label).toBe(false);
  await act(async () => target!.click());
}
async function select(element: HTMLSelectElement, value: string) {
  await act(async () => {
    element.value = value;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
}
async function setText(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  await act(async () => {
    const prototype = element.tagName === "INPUT" ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, "value")!.set!.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function advance(label: string) {
  if (button("Rätta")) {
    const option = container.querySelector<HTMLButtonElement>(".quiz-option");
    if (option) await act(async () => option.click());
    const input = container.querySelector<HTMLInputElement>("input:not([type=checkbox])");
    if (input) await setText(input, "2");
    const matching = container.querySelector<HTMLSelectElement>(".matching-row select");
    if (matching) await select(matching, matching.options[1].value);
    await click("Rätta");
  }
  if (label === "Jag kunde detta") await click("Visa exempelsvar");
  await click(label);
}

const pages: [string, ComponentType, number, string][] = [
  ["Snabbfel", QuickErrorsPage, 4 + lessonQuickErrors.length, "Nästa"],
  ["Kodläsning", CodeReadingPage, 4 + lessonReadingQuestions.length, "Nästa"],
  ["TypeScript-fel", TypeScriptErrorsPage, 3, "Nästa"],
  ["HTTP", HttpTrainerPage, 6, "Nästa"],
  ["Output", OutputPredictionPage, 6, "Nästa →"],
  ["Förklara koden", ExplainCodePage, 6 + trainingLessons.length, "Nästa"],
  ["Förklara", ExplainPage, 8 + lessonReadingQuestions.length, "Jag kunde detta"],
  ["Flashcards", FlashcardsPage, 10 + lessonReadingQuestions.length, "Nästa kort"],
  ["Begrepp", MatchingPage, 8, "Nästa begrepp"],
  ["Kodkomplettering", CodeCompletionPage, 4, "Nästa"],
  ["Debug", DebugPage, 5, "Nästa debug-uppgift"],
  ["Kodövningar", PracticePage, 6, "Nästa uppgift"],
  ["Mini-projekt", MiniProjectsPage, 3, "Gå vidare"],
  ["Kedjor", ChainTasksPage, 3, "Hoppa över kedjan"],
  ["Simulator", ApiSimulatorPage, 3, "Nästa anrop"]
];

it.each([
  ["Snabbfel", QuickErrorsPage],
  ["Kodläsning", CodeReadingPage],
  ["TypeScript-fel", TypeScriptErrorsPage],
  ["HTTP", HttpTrainerPage]
] as [string, ComponentType][])("%s highlights the selected answer, moves the highlight and resets it for the next question", async (_name, Page) => {
  await act(async () => root.render(<Page />));
  const options = [...container.querySelectorAll<HTMLButtonElement>(".quiz-option")];
  expect(container.querySelector(".selected-option")).toBeNull();
  await act(async () => options[0].click());
  expect(options[0].classList.contains("selected-option")).toBe(true);
  expect(options[0].getAttribute("aria-pressed")).toBe("true");
  await act(async () => options[1].click());
  expect(options[0].classList.contains("selected-option")).toBe(false);
  expect(options[0].getAttribute("aria-pressed")).toBe("false");
  expect(container.querySelectorAll(".selected-option")).toHaveLength(1);
  expect(options[1].classList.contains("selected-option")).toBe(true);
  await click("Rätta");
  expect(options.every((option) => option.disabled)).toBe(true);
  expect(options[1].getAttribute("aria-pressed")).toBe("true");
  expect(options[1].matches(".correct-option, .wrong-option")).toBe(true);
  await click("Nästa");
  expect(container.querySelector(".selected-option")).toBeNull();
  expect(container.querySelector('[aria-pressed="true"]')).toBeNull();
  expect(button("Rätta")?.disabled).toBe(true);
});

it.each(pages)("%s ends after its bank is exhausted and restarts explicitly", async (_name, Page, total, next) => {
  await act(async () => root.render(<Page />));
  expect(container.querySelector(".training-session select")).not.toBeNull();
  for (let index = 0; index < total; index++) {
    expect(container.textContent).not.toContain("Omgången är klar!");
    await advance(next);
  }
  expect(container.textContent).toContain("Omgången är klar!");
  expect(button(next)).toBeUndefined();
  await click("Starta ny omgång");
  expect(container.textContent).not.toContain("Omgången är klar!");
  expect(container.textContent).toContain(`1 av ${total} uppgifter visade`);
});

it("does not repeat Snabbfel questions when switching topics, and clears answers on restart", async () => {
  await act(async () => root.render(<QuickErrorsPage />));
  const seen = new Set<string>();
  function remember() {
    const signature = container.querySelector("pre")!.textContent + [...container.querySelectorAll(".quiz-option")].map((option) => option.textContent).sort().join("|");
    expect(seen.has(signature)).toBe(false);
    seen.add(signature);
  }
  remember();
  await advance("Nästa");
  remember();
  const topics = container.querySelector<HTMLSelectElement>("select")!;
  await select(topics, "TypeScript");
  for (let i = 0; i < 1 + lessonQuickErrors.filter((question) => question.topic === "TypeScript").length; i++) {
    remember();
    await advance("Nästa");
  }
  expect(container.textContent).toContain("Omgången är klar!");
  await select(topics, "");
  const remaining = 4 + lessonQuickErrors.length - seen.size;
  for (let i = 0; i < remaining; i++) {
    remember();
    await advance("Nästa");
  }
  expect(seen.size).toBe(4 + lessonQuickErrors.length);
  expect(container.textContent).toContain("Omgången är klar!");
  await select(topics, "TypeScript");
  expect(container.querySelector("pre")).toBeNull();
  await click("Starta ny omgång");
  expect(container.querySelector(".topic-badge")?.textContent).toBe("TypeScript");
  expect(button("Rätta")?.disabled).toBe(true);
  expect(container.querySelector(".feedback")).toBeNull();
});

it.each([
  ["Snabbfel", QuickErrorsPage], ["Kodläsning", CodeReadingPage],
  ["Förklara koden", ExplainCodePage], ["Förklara", ExplainPage], ["Flashcards", FlashcardsPage]
] as [string, ComponentType][])("%s offers every course subject", async (_name, Page) => {
  await act(async () => root.render(<Page />));
  const choices = [...container.querySelectorAll<HTMLSelectElement>("select")[0].options].map((option) => option.value).filter(Boolean);
  expect(choices.sort()).toEqual(studyTopics.map((topic) => topic.title).sort());
});

it("shows the lesson code and source when practicing a previously missing subject", async () => {
  await act(async () => root.render(<QuickErrorsPage />));
  await select(container.querySelector("select")!, "Jotai");
  const lesson = trainingLessons.find((item) => item.topic === "Jotai")!;
  expect(container.querySelector("pre")?.textContent).toBe(lesson.code);
  expect(container.querySelector("a")?.getAttribute("href")).toBe(lesson.lessonUrl);
  expect(container.querySelector("a")?.textContent).toBe(lesson.pageTitle);
  expect(container.textContent).toContain("Vilket påstående är fel?");
  expect(container.textContent).toContain("Koden är lektionens referensexempel");
});

it("resets the code editor and revealed solution when advancing or restarting a filtered round", async () => {
  await act(async () => root.render(<CodeCompletionPage />));
  await select(container.querySelector("select")!, "Fetch");
  const starter = container.querySelector("textarea")!.value;
  await setText(container.querySelector("textarea")!, "my draft");
  await click("Visa lösning");
  await click("Nästa");
  expect(container.textContent).toContain("Omgången är klar!");
  await click("Starta ny omgång");
  expect(container.querySelector("textarea")!.value).toBe(starter);
  expect(container.querySelector(".solution-box")).toBeNull();
});

it("keeps the selected coding difficulty between tasks", async () => {
  await act(async () => root.render(<PracticePage />));
  const difficulty = [...container.querySelectorAll("select")].find((item) => item.value === "normal")!;
  await select(difficulty, "hard");
  await click("Nästa uppgift");
  expect([...container.querySelectorAll("select")].some((item) => item.value === "hard")).toBe(true);
});

it("filters reference maps by subject", async () => {
  await act(async () => root.render(<ConceptMapPage />));
  await select(container.querySelector("select")!, "React Query");
  expect(container.querySelectorAll(".concept-flow")).toHaveLength(1);
  expect(container.querySelector(".concept-flow h3")?.textContent).toBe("Server state");
});

async function openLesson(topic = "react", page = 1) {
  await act(async () => root.render(<MemoryRouter initialEntries={[`/topics?topic=${topic}&page=${page}`]}><TopicsPage /></MemoryRouter>));
  if (!container.querySelector(".study-tabs")) {
    await act(async () => container.querySelector<HTMLButtonElement>(".topic-practice-toggle")!.click());
  }
}

it("always shows lesson question navigation and retains drafts and checked answers", async () => {
  await openLesson();
  expect(button("← Föregående fråga")?.disabled).toBe(true);
  expect(button("Nästa fråga →")?.disabled).toBe(false);
  const first = container.querySelector<HTMLButtonElement>(".page-quiz-option")!;
  const firstText = first.textContent;
  await act(async () => first.click());
  await click("Nästa fråga →");
  const multi = [...container.querySelectorAll<HTMLButtonElement>(".page-quiz-option")];
  await act(async () => { multi[0].click(); multi[1].click(); });
  expect(container.querySelectorAll(".page-quiz-option.selected")).toHaveLength(2);
  await click("← Föregående fråga");
  expect(container.querySelector(".page-quiz-option.selected")?.textContent).toBe(firstText);
  await click("Rätta svar");
  const feedback = container.querySelector(".quiz-result-block p")!.textContent;
  await click("Nästa fråga →");
  expect(container.querySelectorAll(".page-quiz-option.selected")).toHaveLength(2);
  await click("Nästa fråga →");
  expect(button("Nästa fråga →")?.disabled).toBe(true);
  expect(button("← Föregående fråga")?.disabled).toBe(false);
  await click("← Föregående fråga");
  await click("← Föregående fråga");
  expect(button("Rätta svar")?.disabled).toBe(true);
  expect(container.querySelector(".quiz-result-block p")?.textContent).toBe(feedback);
});

it("retrying one lesson question preserves other selections and option order", async () => {
  await openLesson();
  const correct = studyTopics[0].pages[0].quiz.options[studyTopics[0].pages[0].quiz.answer];
  const options = [...container.querySelectorAll<HTMLButtonElement>(".page-quiz-option")];
  const wrong = options.find(option => !option.textContent?.endsWith(correct))!;
  await act(async () => wrong.click());
  await click("Rätta svar");
  await click("Nästa fråga →");
  const option = container.querySelector<HTMLButtonElement>(".page-quiz-option")!;
  await act(async () => option.click());
  const order = [...container.querySelectorAll(".page-quiz-option")].map(item => item.textContent);
  await click("← Föregående fråga");
  await click("Försök igen");
  expect(container.querySelector(".quiz-result-block")).toBeNull();
  expect(container.querySelector(".page-quiz-option.selected")).toBeNull();
  await click("Nästa fråga →");
  expect([...container.querySelectorAll(".page-quiz-option")].map(item => item.textContent)).toEqual(order);
  expect(container.querySelectorAll(".page-quiz-option.selected")).toHaveLength(1);
});

it("prefills the lesson editor and keeps edits when switching practice tabs", async () => {
  await openLesson("react", 4);
  await click("Kod");
  const editor = container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Kod"]')!;
  expect(editor.value).toBe(studyTopics[0].pages[3].code);
  await setText(editor, "my edited solution");
  await click("Quiz");
  await click("Kod");
  expect(container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Kod"]')!.value).toBe("my edited solution");
});

it("loads saved code instead of overwriting it with the example", async () => {
  recordCodeAttempt("theory-code-react-p1", "React", "Hello", 50, false, "saved solution");
  await openLesson();
  await click("Kod");
  expect(container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Kod"]')!.value).toBe("saved solution");
});

it("prioritizes an explicitly opened code-library draft over saved code", async () => {
  recordCodeAttempt("theory-code-react-p1", "React", "Hello", 50, false, "saved solution");
  localStorage.setItem("provtraning-code-draft-load-v1", JSON.stringify({pageId: "react-p1", code: "chosen draft"}));
  await openLesson();
  expect(container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Kod"]')!.value).toBe("chosen draft");
});

it("leaves explanation answers empty and places quiz code after feedback and controls", async () => {
  await openLesson("server", 1);
  await click("Kod");
  expect(container.querySelector<HTMLTextAreaElement>(".page-self-answer")!.value).toBe("");
  await click("Quiz");
  await act(async () => container.querySelector<HTMLButtonElement>(".page-quiz-option")!.click());
  await click("Rätta svar");
  const card = container.querySelector(".study-tab-panel .study-focus-card")!;
  expect(card.querySelector(".quiz-result-block")).not.toBeNull();
  expect(card.lastElementChild?.tagName).toBe("PRE");
  expect(button("Nästa fråga →")!.parentElement).toBe(button("Rätta svar")!.parentElement);
});

it("loads each page's starter and preserves even an intentionally emptied draft on return", async () => {
  const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  try {
    await openLesson();
    await click("Kod");
    await setText(container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Kod"]')!, "");
    await click("Nästa →");
    await act(async () => container.querySelector<HTMLButtonElement>(".topic-practice-toggle")!.click());
    await click("Kod");
    expect(container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Kod"]')!.value).toBe(studyTopics[0].pages[1].code);
    await click("← Föregående");
    await act(async () => container.querySelector<HTMLButtonElement>(".topic-practice-toggle")!.click());
    await click("Kod");
    expect(container.querySelector<HTMLTextAreaElement>('textarea[aria-label="Kod"]')!.value).toBe("");
  } finally {
    scroll.mockRestore();
  }
});
