import { useEffect, useRef, useState } from "react";
import { getAudioSettings, type FeedbackKind } from "../data/audioSettings";

type Burst = { id: number; kind: FeedbackKind };

function playTone(kind: FeedbackKind) {
  const settings = getAudioSettings();
  if (!settings.enabled || settings.volume <= 0) return;

  const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextCtor) return;

  const ctx = new AudioContextCtor();
  const gain = ctx.createGain();
  gain.gain.value = settings.volume * 0.16;
  gain.connect(ctx.destination);

  const sequences: Record<FeedbackKind, number[]> = {
    correct: [520, 660],
    wrong: [220, 180],
    success: [440, 550, 660],
    achievement: [523, 659, 784, 1047]
  };

  const notes = sequences[kind];
  notes.forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const start = ctx.currentTime + index * 0.075;
    const end = start + 0.11;

    osc.type = kind === "wrong" ? "triangle" : "sine";
    osc.frequency.value = frequency;
    noteGain.gain.setValueAtTime(0.0001, start);
    noteGain.gain.exponentialRampToValueAtTime(Math.max(0.0002, settings.volume * 0.12), start + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.connect(noteGain);
    noteGain.connect(gain);
    osc.start(start);
    osc.stop(end);
  });

  setTimeout(() => void ctx.close(), 650);
}

export default function StudyFeedback() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextId = useRef(1);

  useEffect(() => {
    function onFeedback(event: Event) {
      const kind = (event as CustomEvent<{ kind: FeedbackKind }>).detail?.kind;
      if (!kind) return;

      playTone(kind);

      const settings = getAudioSettings();
      if (!settings.celebrations || kind === "wrong") return;

      const id = nextId.current++;
      setBursts((current) => [...current, { id, kind }]);
      window.setTimeout(
        () => setBursts((current) => current.filter((burst) => burst.id !== id)),
        900
      );
    }

    window.addEventListener("study-feedback", onFeedback);
    return () => window.removeEventListener("study-feedback", onFeedback);
  }, []);

  return (
    <div className="feedback-effects" aria-hidden="true">
      {bursts.map((burst) => (
        <div className={`celebration-wrap ${burst.kind}`} key={burst.id}>
          <div className="celebration-toast">
            {burst.kind === "achievement" ? "Dagens mål klara! ✨" : burst.kind === "success" ? "Snyggt jobbat!" : "Rätt! +1"}
          </div>
          <div className={`celebration-burst ${burst.kind}`}>
          {Array.from({ length: burst.kind === "achievement" ? 18 : 10 }).map((_, index) => (
            <i
              key={index}
              style={{
                ["--i" as any]: index,
                ["--count" as any]: burst.kind === "achievement" ? 18 : 10
              }}
            />
          ))}
          </div>
        </div>
      ))}
    </div>
  );
}
