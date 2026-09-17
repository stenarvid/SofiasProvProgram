export type QuestionReviewSnapshot = {
  source: "global" | "page";
  pageTitle?: string;
  type: "single" | "multi";
  options: string[];
  correctAnswers: number[];
  explanation: string;
  code?: string;
};

export type QuestionProgress = {
  questionId: string;
  topic: string;
  question: string;
  seen: number;
  correct: number;
  wrong: number;
  lastAnswered: string;
  consecutiveCorrect?: number;
  dueAt?: string;
  reviewSnapshot?: QuestionReviewSnapshot;
};

const KEY = "provtraning-question-progress-v2";

export function getQuestionProgress(): Record<string, QuestionProgress> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function nextDueDate(correct: boolean, streak: number) {
  const now = new Date();

  // Wrong answers should come back quickly.
  if (!correct) {
    now.setHours(now.getHours() + 4);
    return now.toISOString();
  }

  // Simple spaced-repetition ladder:
  // 1d -> 3d -> 7d -> 14d -> 30d.
  const days = [1, 3, 7, 14, 30][Math.min(Math.max(streak - 1, 0), 4)];
  now.setDate(now.getDate() + days);
  return now.toISOString();
}

export function recordQuestionResult(
  questionId: string,
  topic: string,
  question: string,
  correct: boolean,
  reviewSnapshot?: QuestionReviewSnapshot
) {
  const data = getQuestionProgress();
  const current = data[questionId] ?? {
    questionId,
    topic,
    question,
    seen: 0,
    correct: 0,
    wrong: 0,
    lastAnswered: new Date().toISOString(),
    consecutiveCorrect: 0
  };

  const previousStreak = current.consecutiveCorrect ?? 0;
  const nextStreak = correct ? previousStreak + 1 : 0;

  data[questionId] = {
    ...current,
    topic,
    question,
    seen: current.seen + 1,
    correct: current.correct + (correct ? 1 : 0),
    wrong: current.wrong + (correct ? 0 : 1),
    lastAnswered: new Date().toISOString(),
    consecutiveCorrect: nextStreak,
    dueAt: nextDueDate(correct, nextStreak),
    reviewSnapshot: reviewSnapshot ?? current.reviewSnapshot
  };

  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("question-progress-updated"));
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}

export function clearQuestionProgress() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("question-progress-updated"));
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}

export function isQuestionStillMissed(item: QuestionProgress) {
  return item.wrong > 0 && (item.consecutiveCorrect ?? 0) === 0;
}

export function getWrongQuestionIds(): string[] {
  return Object.values(getQuestionProgress())
    .filter(isQuestionStillMissed)
    .sort((a, b) => {
      const aRate = a.wrong / Math.max(1, a.seen);
      const bRate = b.wrong / Math.max(1, b.seen);
      return bRate - aRate || b.wrong - a.wrong;
    })
    .map((item) => item.questionId);
}

export function isQuestionDue(item: QuestionProgress | undefined, now = new Date()) {
  if (!item || !item.dueAt) return false;
  return new Date(item.dueAt).getTime() <= now.getTime();
}

export function getDueQuestionIds(): string[] {
  const now = new Date();

  return Object.values(getQuestionProgress())
    .filter((item) => isQuestionDue(item, now))
    .sort((a, b) => {
      const aTime = new Date(a.dueAt ?? 0).getTime();
      const bTime = new Date(b.dueAt ?? 0).getTime();
      return aTime - bTime;
    })
    .map((item) => item.questionId);
}

export function getDueQuestionCount() {
  return getDueQuestionIds().length;
}


export function getWrongQuestionIdsFrom(allowedIds: Iterable<string>): string[] {
  const allowed = new Set(allowedIds);
  return getWrongQuestionIds().filter((id) => allowed.has(id));
}

export function getWrongQuestionCountFrom(allowedIds: Iterable<string>): number {
  return getWrongQuestionIdsFrom(allowedIds).length;
}
