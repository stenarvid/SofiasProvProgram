import { recordDailyQuestion } from "./dailyGoals";
import { recordStudyActivity } from "./studyActivity";
import { emitStudyFeedback } from "./audioSettings";

export type TopicStat = {
  correct: number;
  wrong: number;
};

export type ProgressData = Record<string, TopicStat>;

const KEY = "provtraning-progress-v1";

const TOPIC_ALIASES: Record<string, string> = {
  Comp: "Components",
  Router: "React Router",
  query: "React Query",
  Typescript: "TypeScript"
};

function normalizeProgressTopics(progress: ProgressData): ProgressData {
  const normalized: ProgressData = {};

  for (const [topic, stat] of Object.entries(progress)) {
    const canonical = TOPIC_ALIASES[topic] ?? topic;
    const current = normalized[canonical] ?? { correct: 0, wrong: 0 };

    normalized[canonical] = {
      correct: current.correct + stat.correct,
      wrong: current.wrong + stat.wrong
    };
  }

  return normalized;
}


export function getProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as ProgressData;
    const normalized = normalizeProgressTopics(parsed);

    // Persist the canonical names so older v29/v28 progress keeps working.
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      localStorage.setItem(KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch {
    return {};
  }
}

export function recordAnswer(topic: string, correct: boolean) {
  const progress = getProgress();
  const canonicalTopic = TOPIC_ALIASES[topic] ?? topic;
  const current = progress[canonicalTopic] ?? { correct: 0, wrong: 0 };

  progress[canonicalTopic] = {
    correct: current.correct + (correct ? 1 : 0),
    wrong: current.wrong + (correct ? 0 : 1),
  };

  localStorage.setItem(KEY, JSON.stringify(progress));
  recordDailyQuestion();
  recordStudyActivity();
  emitStudyFeedback(correct ? "correct" : "wrong");
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}

export function clearProgress() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}
