import { useEffect, useState } from "react";
import {
  emitStudyFeedback,
  getAudioSettings,
  saveAudioSettings
} from "../data/audioSettings";

export default function SoundSettings() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(() => getAudioSettings());

  useEffect(() => {
    const toggle = () => setOpen((value) => !value);
    const refresh = () => setSettings(getAudioSettings());
    window.addEventListener("toggle-sound-settings", toggle);
    window.addEventListener("audio-settings-updated", refresh);
    return () => {
      window.removeEventListener("toggle-sound-settings", toggle);
      window.removeEventListener("audio-settings-updated", refresh);
    };
  }, []);

  function update(next: typeof settings) {
    setSettings(next);
    saveAudioSettings(next);
  }

  if (!open) return null;

  return (
    <div className="sound-backdrop" onMouseDown={() => setOpen(false)}>
      <section className="sound-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="shortcut-modal-heading">
          <div>
            <span className="study-tool-label">Studiefeedback</span>
            <h2>Ljud & effekter</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Stäng">×</button>
        </div>

        <label className="setting-row">
          <span><strong>Ljud</strong><small>Rätt, fel och achievements.</small></span>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => update({ ...settings, enabled: e.target.checked })}
          />
        </label>

        <label className="setting-slider">
          <span>Volym <strong>{Math.round(settings.volume * 100)}%</strong></span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={(e) => update({ ...settings, volume: Number(e.target.value) })}
          />
        </label>

        <label className="setting-row">
          <span><strong>Små celebration-effekter</strong><small>Diskret confetti när du lyckas.</small></span>
          <input
            type="checkbox"
            checked={settings.celebrations}
            onChange={(e) => update({ ...settings, celebrations: e.target.checked })}
          />
        </label>

        <button
          type="button"
          className="primary-button auto-width"
          onClick={() => emitStudyFeedback("achievement")}
        >
          Testa feedback
        </button>
      </section>
    </div>
  );
}
