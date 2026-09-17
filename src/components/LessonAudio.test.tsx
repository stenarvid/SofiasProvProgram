import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import LessonAudio, { lessonNarration } from "./LessonAudio";
import { studyTopics } from "../data/studyTopics";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const page = studyTopics[0].pages[0];
class Utterance {
  lang = "";
  rate = 1;
  voice: unknown;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public text: string) {}
}
let container: HTMLDivElement;
let root: Root;
let spoken: Utterance[];
const voice = { lang: "sv-SE", name: "Swedish" };
const synth = { speak: vi.fn(), cancel: vi.fn(), pause: vi.fn(), resume: vi.fn(), getVoices: () => [voice] };
beforeEach(() => {
  vi.clearAllMocks();
  spoken = [];
  synth.speak.mockImplementation((utterance: Utterance) => spoken.push(utterance));
  vi.stubGlobal("speechSynthesis", synth);
  vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});
async function click(text: string) {
  const button = [...container.querySelectorAll("button")].find(button => button.textContent === text)!;
  expect(button.disabled).toBe(false);
  await act(async () => button.click());
}

it("reads the current lesson in Swedish only after a click and supports pause, resume and stop", async () => {
  await act(async () => root.render(<LessonAudio page={page} mode="explain" />));
  expect(spoken).toHaveLength(0);
  await click("Lyssna på lektionen");
  expect(spoken[0].text).toBe(page.title);
  expect(spoken.every(item => item.lang === "sv-SE" && item.voice === voice)).toBe(true);
  expect(spoken.map(item => item.text).join(" ")).toContain("Tillämpa själv");
  await click("Pausa uppläsning");
  expect(synth.pause).toHaveBeenCalledOnce();
  await click("Fortsätt lyssna");
  expect(synth.resume).toHaveBeenCalled();
  await click("Stoppa uppläsning");
  expect(synth.cancel).toHaveBeenCalledOnce();
  await act(async () => spoken[spoken.length - 1].onerror?.());
  expect(container.textContent).not.toContain("kunde inte starta");
  await click("Lyssna på lektionen");
});

it("stops the previous lesson on navigation and ignores its late callbacks", async () => {
  await act(async () => root.render(<LessonAudio key={page.id} page={page} mode="explain" />));
  await click("Lyssna på lektionen");
  const old = spoken[spoken.length - 1];
  const next = studyTopics[0].pages[1];
  await act(async () => root.render(<LessonAudio key={next.id} page={next} mode="explain" />));
  expect(synth.cancel).toHaveBeenCalledOnce();
  await act(async () => old.onend?.());
  spoken = [];
  await click("Lyssna på lektionen");
  expect(spoken[0].text).toBe(next.title);
  await act(async () => spoken[spoken.length - 1].onend?.());
  expect(container.querySelector("button")!.disabled).toBe(false);
});

it("handles unsupported speech and speech engine errors", async () => {
  vi.stubGlobal("speechSynthesis", undefined);
  await act(async () => root.render(<LessonAudio page={page} mode="explain" />));
  expect(container.querySelector("button")!.disabled).toBe(true);
  expect(container.textContent).toContain("stöds inte");
  vi.stubGlobal("speechSynthesis", synth);
  await act(async () => root.render(<LessonAudio page={page} mode="explain" />));
  await click("Lyssna på lektionen");
  await act(async () => spoken[0].onerror?.());
  expect(container.textContent).toContain("kunde inte starta");
  expect(container.querySelector("button")!.disabled).toBe(false);
});

it("uses bullet text in bullet mode without reading quiz answers or the raw code block", () => {
  const paragraphs = lessonNarration(page, "bullets");
  for (const bullet of page.bullets) expect(paragraphs).toContain(bullet);
  expect(paragraphs).not.toContain(page.code);
  expect(paragraphs).not.toContain(page.quiz.question);
  expect(paragraphs).toContain(page.codeTask);
});
