import { Link } from "react-router-dom";
import { useState } from "react";
import { getQuestionProgress } from "../data/questionProgress";

const NOTE_KEY = "provtraning-mistake-notes-v1";

function getNotes(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(NOTE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export default function MistakeNotebookPage() {
  const progress = getQuestionProgress();
  const [notes, setNotes] = useState<Record<string, string>>(() => getNotes());

  const mistakes = Object.values(progress)
    .filter((item) => item.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || b.seen - a.seen);

  function saveNote(id: string, value: string) {
    const next = { ...notes, [id]: value };
    setNotes(next);
    localStorage.setItem(NOTE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("progress-data-changed"));
  }

  return (
    <section className="learning-page">
      <div className="hub-hero">
        <span className="topic-badge">Mina misstag</span>
        <h2>Din personliga felbok</h2>
        <p>Frågor du missat samlas här så att du kan se mönster och skriva vad du vill komma ihåg.</p>
      </div>

      <div className="mistake-toolbar">
        <strong>{mistakes.length} frågor i felboken</strong>
        {mistakes.length > 0 && <Link to="/missed-questions">Öva alla missade →</Link>}
      </div>

      {mistakes.length ? (
        <div className="mistake-list">
          {mistakes.map((item) => (
            <article className="mistake-card" key={item.questionId}>
              <div className="mistake-meta">
                <span className="topic-badge">{item.topic}</span>
                <span>{item.wrong} fel · {item.correct} rätt</span>
              </div>
              <h3>{item.question}</h3>
              <label>
                Min minnesregel
                <textarea
                  rows={2}
                  value={notes[item.questionId] ?? ""}
                  onChange={(e) => saveNote(item.questionId, e.target.value)}
                  placeholder="Ex: queryKey identifierar cachen, queryFn hämtar datan..."
                />
              </label>
            </article>
          ))}
        </div>
      ) : (
        <article className="dashboard-panel">
          <h3>Inga misstag sparade ännu</h3>
          <p className="muted">När du svarar fel på quiz dyker frågan upp här automatiskt.</p>
        </article>
      )}
    </section>
  );
}
