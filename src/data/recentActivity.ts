const KEY = "provtraning-recent-activity-v1";

export type RecentActivityItem = {
  id: string;
  label: string;
  detail: string;
  to: string;
  visitedAt: string;
};

export function getRecentActivity(): RecentActivityItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordRecentActivity(item: Omit<RecentActivityItem, "visitedAt">) {
  const current = getRecentActivity().filter((entry) => entry.id !== item.id);
  const next: RecentActivityItem[] = [
    {
      ...item,
      visitedAt: new Date().toISOString()
    },
    ...current
  ].slice(0, 8);

  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("recent-activity-updated"));
}
