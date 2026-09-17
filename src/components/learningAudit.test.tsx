import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, expect, it } from "vitest";
import OutputPredictionPage from "./OutputPredictionPage";
import ReadinessPage from "./ReadinessPage";
import SmartPracticePage from "./SmartPracticePage";
import MissedQuestionsPage from "./MissedQuestionsPage";
import { getAllMissedQuestions } from "../data/missedQuestions";
import LessonPreparation from "./LessonPreparation";
import { studyTopics } from "../data/studyTopics";
import { recordQuestionResult } from "../data/questionProgress";

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

async function click(label: string) {
  const button = [...container.querySelectorAll("button")].find(item => item.textContent === label);
  expect(button).toBeDefined();
  await act(async () => button!.click());
}

it("renders page-specific learning goals and working prerequisite destinations", async () => {
  const topic = studyTopics.find(item => item.slug === "query")!;
  const page = topic.pages[0];
  await act(async () => root.render(<MemoryRouter><LessonPreparation page={page} topicSlug={topic.slug} /></MemoryRouter>));
  expect(container.textContent).toContain(page.guidance!.goal);
  expect(container.querySelector('a[href="/topics?topic=fetch&page=4"]')).not.toBeNull();
  expect(container.querySelector("details")?.open).toBe(true);
  expect(container.textContent).toContain("QueryClientProvider");
});

it("shows and retains the original code when reviewing a missed lesson question", async () => {
  const code = 'const name = "Sofia";';
  recordQuestionResult("theory-react-p2-q1", "React", "Vilket namn visas?", false, {
    source: "page", type: "single", options: ["Sofia", "Anna"], correctAnswers: [0],
    explanation: "Variabeln innehåller Sofia.", code
  });
  await act(async () => root.render(<MemoryRouter><MissedQuestionsPage /></MemoryRouter>));
  expect(container.querySelector("pre code")?.textContent).toBe(code);
  const wrongOption = [...container.querySelectorAll(".quiz-option")].find(button => button.textContent?.endsWith("Anna")) as HTMLButtonElement | undefined;
  expect(wrongOption).toBeDefined();
  await act(async () => wrongOption!.click());
  const grade = [...container.querySelectorAll("button")].find(button => button.textContent?.includes("Rätta"));
  expect(grade).toBeDefined();
  await act(async () => grade!.click());
  expect(getAllMissedQuestions()[0].code).toBe(code);
});

it("grades the specified HTTP response and locks submitted output answers", async () => {
  await act(async () => root.render(<OutputPredictionPage />));
  for (const answer of ["2", "3", "false", "done", "false"]) {
    const input = container.querySelector("input")!;
    expect(input.disabled).toBe(false);
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, answer);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await click("Rätta");
    expect(container.querySelector(".feedback-correct")).not.toBeNull();
    expect(input.disabled).toBe(true);
    if (answer === "done") {
      await click("Nästa →");
      expect(container.querySelector("pre")!.textContent).toContain("HTTP 404");
    } else if (!container.querySelector("pre")!.textContent!.includes("HTTP 404")) {
      await click("Nästa →");
    }
  }
});

it("stops recommending missed-question practice after a corrective answer", async () => {
  recordQuestionResult("q001", "React", "Vad är React?", false);
  await act(async () => root.render(<MemoryRouter><ReadinessPage /></MemoryRouter>));
  expect(container.textContent).toContain("Öva missade frågor");
  recordQuestionResult("q001", "React", "Vad är React?", true);
  await act(async () => root.render(<MemoryRouter><ReadinessPage /></MemoryRouter>));
  expect(container.textContent).not.toContain("Öva missade frågor");
});

async function openSmartPractice() {
  await act(async () => root.render(
    <MemoryRouter initialEntries={["/smart"]}>
      <Routes>
        <Route path="/smart" element={<SmartPracticePage />} />
        <Route path="/missed-questions" element={<p>Missed practice</p>} />
        <Route path="/topics" element={<p>Theory practice</p>} />
      </Routes>
    </MemoryRouter>
  ));
}

it("does not route smart practice to an empty missed list after a correction", async () => {
  recordQuestionResult("q001", "React", "Vad är React?", false);
  recordQuestionResult("q001", "React", "Vad är React?", true);
  await openSmartPractice();
  expect(container.textContent).toBe("Theory practice");
});

it("includes missed lesson questions when choosing smart practice", async () => {
  recordQuestionResult("theory-react-p1-q1", "React", "Lektionsfråga", false, {
    source: "page", type: "single", options: ["Rätt", "Fel"], correctAnswers: [0], explanation: "Förklaring"
  });
  await openSmartPractice();
  expect(container.textContent).toBe("Missed practice");
});
