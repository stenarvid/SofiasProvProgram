import { recordDailyCodeExercise } from "./dailyGoals";
import { recordStudyActivity } from "./studyActivity";
import { emitStudyFeedback } from "./audioSettings";

export type CodeExerciseProgress = {
  exerciseId: string;
  topic: string;
  title: string;
  attempts: number;
  passes: number;
  bestScore: number;
  lastScore: number;
  hintsUsed: number;
  solutionViews: number;
  lastAttempt: string;
  lastCode?: string;
  bestCode?: string;
};

const KEY = "provtraning-code-progress-v1";

export function getCodeProgress(): Record<string, CodeExerciseProgress> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordCodeAttempt(
  exerciseId: string,
  topic: string,
  title: string,
  score: number,
  passed: boolean,
  code?: string
) {
  const all = getCodeProgress();
  const current = all[exerciseId] ?? {
    exerciseId,
    topic,
    title,
    attempts: 0,
    passes: 0,
    bestScore: 0,
    lastScore: 0,
    hintsUsed: 0,
    solutionViews: 0,
    lastAttempt: new Date().toISOString()
  };

  const nextBestScore = Math.max(current.bestScore, score);
  const shouldReplaceBestCode =
    typeof code === "string" &&
    code.trim().length > 0 &&
    score >= current.bestScore;

  all[exerciseId] = {
    ...current,
    topic,
    title,
    attempts: current.attempts + 1,
    passes: current.passes + (passed ? 1 : 0),
    bestScore: nextBestScore,
    lastScore: score,
    lastAttempt: new Date().toISOString(),
    lastCode: typeof code === "string" && code.trim().length > 0 ? code : current.lastCode,
    bestCode: shouldReplaceBestCode ? code : current.bestCode
  };

  localStorage.setItem(KEY, JSON.stringify(all));
  recordDailyCodeExercise();
  recordStudyActivity();
  emitStudyFeedback(passed ? "success" : "wrong");
  window.dispatchEvent(new CustomEvent("code-progress-updated"));
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}

export function recordHintUse(exerciseId: string, topic: string, title: string) {
  const all = getCodeProgress();
  const current = all[exerciseId] ?? {
    exerciseId,
    topic,
    title,
    attempts: 0,
    passes: 0,
    bestScore: 0,
    lastScore: 0,
    hintsUsed: 0,
    solutionViews: 0,
    lastAttempt: ""
  };

  all[exerciseId] = {
    ...current,
    topic,
    title,
    hintsUsed: current.hintsUsed + 1
  };

  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("code-progress-updated"));
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}

export function recordSolutionView(exerciseId: string, topic: string, title: string) {
  const all = getCodeProgress();
  const current = all[exerciseId] ?? {
    exerciseId,
    topic,
    title,
    attempts: 0,
    passes: 0,
    bestScore: 0,
    lastScore: 0,
    hintsUsed: 0,
    solutionViews: 0,
    lastAttempt: ""
  };

  all[exerciseId] = {
    ...current,
    topic,
    title,
    solutionViews: current.solutionViews + 1
  };

  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("code-progress-updated"));
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}

export function clearCodeProgress() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("code-progress-updated"));
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}
