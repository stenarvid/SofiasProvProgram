const KEY = "provtraning-daily-goals-v1";

export type DailyGoalCounts = {
  questions: number;
  theoryPages: number;
  codeExercises: number;
};

export type DailyGoalsData = {
  date: string;
  goals: DailyGoalCounts;
  progress: DailyGoalCounts;
};

const DEFAULT_GOALS: DailyGoalCounts = {
  questions: 10,
  theoryPages: 2,
  codeExercises: 1
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function emptyData(): DailyGoalsData {
  return {
    date: todayKey(),
    goals: { ...DEFAULT_GOALS },
    progress: {
      questions: 0,
      theoryPages: 0,
      codeExercises: 0
    }
  };
}

export function getDailyGoals(): DailyGoalsData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyData();

    const parsed = JSON.parse(raw) as Partial<DailyGoalsData>;

    if (parsed.date !== todayKey()) {
      const next = {
        ...emptyData(),
        goals: {
          ...DEFAULT_GOALS,
          ...(parsed.goals ?? {})
        }
      };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    }

    return {
      date: parsed.date ?? todayKey(),
      goals: {
        ...DEFAULT_GOALS,
        ...(parsed.goals ?? {})
      },
      progress: {
        questions: parsed.progress?.questions ?? 0,
        theoryPages: parsed.progress?.theoryPages ?? 0,
        codeExercises: parsed.progress?.codeExercises ?? 0
      }
    };
  } catch {
    return emptyData();
  }
}

function save(data: DailyGoalsData) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("daily-goals-updated"));
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}

export function setDailyGoals(goals: DailyGoalCounts) {
  const current = getDailyGoals();
  save({
    ...current,
    goals: {
      questions: Math.max(1, goals.questions),
      theoryPages: Math.max(1, goals.theoryPages),
      codeExercises: Math.max(1, goals.codeExercises)
    }
  });
}

function increment(field: keyof DailyGoalCounts) {
  const current = getDailyGoals();
  save({
    ...current,
    progress: {
      ...current.progress,
      [field]: current.progress[field] + 1
    }
  });
}

export function recordDailyQuestion() {
  increment("questions");
}

export function recordDailyTheoryPage() {
  increment("theoryPages");
}

export function recordDailyCodeExercise() {
  increment("codeExercises");
}
