const KEY = "provtraning-audio-settings-v1";

export type AudioSettings = {
  enabled: boolean;
  volume: number;
  celebrations: boolean;
};

const DEFAULTS: AudioSettings = {
  enabled: true,
  volume: 0.35,
  celebrations: true
};

export function getAudioSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function saveAudioSettings(settings: AudioSettings) {
  localStorage.setItem(KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("audio-settings-updated"));
}

export type FeedbackKind = "correct" | "wrong" | "success" | "achievement";

export function emitStudyFeedback(kind: FeedbackKind) {
  window.dispatchEvent(new CustomEvent("study-feedback", { detail: { kind } }));
}
