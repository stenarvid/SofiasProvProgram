const KEY = "provtraning-study-activity-v1";

export type StudyActivityData = {
  activeDates: string[];
};

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getStudyActivity(): StudyActivityData {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) as Partial<StudyActivityData> : {};
    return {
      activeDates: Array.isArray(parsed.activeDates) ? parsed.activeDates : []
    };
  } catch {
    return { activeDates: [] };
  }
}

export function recordStudyActivity() {
  const data = getStudyActivity();
  const today = localDateKey();
  const dates = new Set(data.activeDates);
  dates.add(today);

  localStorage.setItem(
    KEY,
    JSON.stringify({
      activeDates: Array.from(dates).sort().slice(-180)
    })
  );

  window.dispatchEvent(new CustomEvent("study-activity-updated"));
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}

export function getCurrentStreak() {
  const dates = new Set(getStudyActivity().activeDates);
  let streak = 0;
  const cursor = new Date();

  while (dates.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getWeekActivity() {
  const dates = new Set(getStudyActivity().activeDates);
  const result: { date: string; label: string; active: boolean }[] = [];
  const labels = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    result.push({
      date: localDateKey(date),
      label: labels[date.getDay()],
      active: dates.has(localDateKey(date))
    });
  }

  return result;
}
