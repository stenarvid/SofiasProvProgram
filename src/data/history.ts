export type TestResult = {
  date: string;
  score: number;
  total: number;
  topics: string[];
};

const HISTORY_KEY = "provtraning-test-history-v1";

export function getTestHistory(): TestResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTestResult(result: TestResult) {
  const history = getTestHistory();
  history.unshift(result);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}

export function clearTestHistory() {
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}
