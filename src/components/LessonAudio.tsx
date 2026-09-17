import { useEffect, useRef, useState } from "react";
import type { StudyPage } from "../data/studyTopics";
import { getExampleWalkthrough, getTheoryExplanation } from "../data/theoryExplanations";

export function lessonNarration(page: StudyPage, mode: "explain" | "bullets") {
  return [page.title, page.guidance?.goal ?? "",
    ...(mode === "explain" ? getTheoryExplanation(page.id, page.intro) : page.bullets),
    ...(mode === "explain" ? ["Så fungerar kodexemplet.", ...getExampleWalkthrough(page.id)] : []),
    "Din uppgift.", page.codeTask
  ].filter(Boolean);
}

// Short utterances avoid handing a whole long lesson to the speech engine at once.
function speechChunks(paragraphs: string[]) {
  return paragraphs.flatMap(paragraph => {
    const chunks: string[] = [];
    let chunk = "";
    for (const word of paragraph.replace(/`/g, "").split(/\s+/)) {
      if (chunk && chunk.length + word.length > 240) { chunks.push(chunk); chunk = ""; }
      chunk += (chunk ? " " : "") + word;
    }
    if (chunk) chunks.push(chunk);
    return chunks;
  });
}

export default function LessonAudio({ page, mode }: { page: StudyPage; mode: "explain" | "bullets" }) {
  const supported = typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined";
  const [status, setStatus] = useState<"idle" | "reading" | "paused" | "error">("idle");
  const [rate, setRate] = useState(1);
  const run = useRef(0);
  const utterances = useRef<SpeechSynthesisUtterance[]>([]);
  const active = status === "reading" || status === "paused";

  function cancel() {
    run.current++;
    if (utterances.current.length) window.speechSynthesis.cancel();
    utterances.current = [];
  }

  useEffect(() => () => { cancel(); }, [page.id, mode]);

  function start() {
    if (!supported) return;
    cancel();
    const token = run.current;
    const synth = window.speechSynthesis;
    const voice = synth.getVoices().find(item => /^sv(?:-|_)/i.test(item.lang) || item.lang === "sv");
    const chunks = speechChunks(lessonNarration(page, mode));
    setStatus("reading");
    try {
      utterances.current = chunks.map((text, index) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "sv-SE";
        utterance.rate = rate;
        if (voice) utterance.voice = voice;
        utterance.onend = () => {
          if (token === run.current && index === chunks.length - 1) {
            utterances.current = [];
            setStatus("idle");
          }
        };
        utterance.onerror = () => {
          if (token !== run.current) return;
          cancel();
          setStatus("error");
        };
        return utterance;
      });
      // Resume also clears a paused engine left by an earlier stopped reading.
      synth.resume();
      utterances.current.forEach(utterance => synth.speak(utterance));
    } catch {
      cancel();
      setStatus("error");
    }
  }

  return <div className="lesson-audio">
    <div className="inline-actions" role="group" aria-label="Uppläsning av lektionen">
      <button type="button" onClick={start} disabled={!supported || active}>Lyssna på lektionen</button>
      {active && <>
        <button type="button" onClick={() => {
          if (status === "paused") { window.speechSynthesis.resume(); setStatus("reading"); }
          else { window.speechSynthesis.pause(); setStatus("paused"); }
        }}>{status === "paused" ? "Fortsätt lyssna" : "Pausa uppläsning"}</button>
        <button type="button" onClick={() => { cancel(); setStatus("idle"); }}>Stoppa uppläsning</button>
      </>}
      <label>Hastighet <select value={rate} disabled={!supported || active} onChange={event => setRate(Number(event.target.value))}>
        <option value={0.8}>0,8×</option><option value={1}>1×</option><option value={1.2}>1,2×</option><option value={1.5}>1,5×</option>
      </select></label>
    </div>
    <p className="muted" role="status">{!supported ? "Uppläsning stöds inte i den här webbläsaren."
      : status === "error" ? "Uppläsningen kunde inte starta eller avbröts. Försök igen och kontrollera att en svensk röst finns på enheten."
      : status === "paused" ? "Uppläsningen är pausad."
      : status === "reading" ? "Läser upp lektionen."
      : "Lyssna på texten i valt teoriläge och uppgiften. Förklaringsläget läser också genomgången av koden. Rösten beror på din webbläsare och enhet."}</p>
  </div>;
}
