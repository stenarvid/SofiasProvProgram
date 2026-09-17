import { recordDailyTheoryPage } from "./dailyGoals";
import { recordStudyActivity } from "./studyActivity";

const KEY = "provtraning-study-flow-v1";

export type LastStudyLocation = {
  topicSlug: string;
  pageIndex: number;
  topicTitle: string;
  pageTitle: string;
  updatedAt: string;
};

export type StudyFlowData = {
  lastLocation: LastStudyLocation | null;
  completedPageIds: string[];
  bookmarkedPageIds: string[];
  pageNotes: Record<string, string>;
};

const EMPTY: StudyFlowData = {
  lastLocation: null,
  completedPageIds: [],
  bookmarkedPageIds: [],
  pageNotes: {}
};

export function getStudyFlow(): StudyFlowData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;

    const parsed = JSON.parse(raw) as Partial<StudyFlowData>;
    return {
      lastLocation: parsed.lastLocation ?? null,
      completedPageIds: Array.isArray(parsed.completedPageIds) ? parsed.completedPageIds : [],
      bookmarkedPageIds: Array.isArray(parsed.bookmarkedPageIds) ? parsed.bookmarkedPageIds : [],
      pageNotes:
        parsed.pageNotes && typeof parsed.pageNotes === "object"
          ? parsed.pageNotes as Record<string, string>
          : {}
    };
  } catch {
    return EMPTY;
  }
}

function save(data: StudyFlowData) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("study-flow-updated"));
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}

export function saveLastStudyLocation(location: Omit<LastStudyLocation, "updatedAt">) {
  const data = getStudyFlow();
  save({
    ...data,
    lastLocation: {
      ...location,
      updatedAt: new Date().toISOString()
    }
  });
}

export function setPageCompleted(pageId: string, completed: boolean) {
  const data = getStudyFlow();
  const set = new Set(data.completedPageIds);

  const wasCompleted = set.has(pageId);

  if (completed) set.add(pageId);
  else set.delete(pageId);

  if (completed && !wasCompleted) {
    recordDailyTheoryPage();
    recordStudyActivity();
  }

  save({
    ...data,
    completedPageIds: Array.from(set)
  });
}

export function togglePageBookmark(pageId: string): boolean {
  const data = getStudyFlow();
  const set = new Set(data.bookmarkedPageIds);
  const willBookmark = !set.has(pageId);

  if (willBookmark) set.add(pageId);
  else set.delete(pageId);

  save({
    ...data,
    bookmarkedPageIds: Array.from(set)
  });

  return willBookmark;
}


export function savePageNote(pageId: string, note: string) {
  const data = getStudyFlow();

  save({
    ...data,
    pageNotes: {
      ...data.pageNotes,
      [pageId]: note
    }
  });
}
