import { useMemo, useState } from "react";
import { questionBank } from "../data/questionBank";
import { emitStudyFeedback } from "../data/audioSettings";

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function OralExamPage() {
  const questions = useMemo(() => shuffle(questionBank), []);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ratings, setRatings] = useState<number[]>([]);
  const current = questions[index];

  function speak() {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(current.question);
    utterance.lang = "sv-SE";
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  }

  function rate(value: number) {
    setRatings((all) => [...all, value]);
    emitStudyFeedback(value >= 2 ? "correct" : "wrong");
    setIndex((valueIndex) => (valueIndex + 1) % questions.length);
    setRevealed(false);
  }

  return (
    <section className="oral-page">
      <div className="hub-hero">
        <span className="topic-badge">Muntligt prov</span>
        <h2>Förklara innan du visar facit</h2>
        <p>Svara högt med egna ord. Målet är att kunna resonera, inte bara känna igen ett alternativ.</p>
      </div>

      <article className="oral-card">
        <div className="oral-meta">
          <span>{current.topic}</span>
          <span>Fråga {index + 1} / {questions.length}</span>
        </div>
        <h2>{current.question}</h2>

        <div className="oral-actions">
          <button type="button" onClick={speak}>🔊 Läs upp frågan</button>
          {!revealed && (
            <button type="button" className="primary-button auto-width" onClick={() => setRevealed(true)}>
              Visa stöd/facit
            </button>
          )}
        </div>

        {revealed && (
          <div className="oral-answer">
            <span className="study-tool-label">Det viktiga i svaret</span>
            <h3>{current.options[current.answer]}</h3>
            <p>{current.explanation}</p>
            <p className="muted">Bedöm nu hur bra du kunde förklara detta innan du såg facit.</p>
            <div className="oral-rating">
              <button onClick={() => rate(1)}>1 · Behöver träna</button>
              <button onClick={() => rate(2)}>2 · Nästan</button>
              <button onClick={() => rate(3)}>3 · Kunde förklara</button>
            </div>
          </div>
        )}

        {ratings.length > 0 && (
          <p className="oral-session">Session: {ratings.filter((x) => x === 3).length}/{ratings.length} säkra svar.</p>
        )}
      </article>
    </section>
  );
}
