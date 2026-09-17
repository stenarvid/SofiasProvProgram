import { useEffect, useMemo, useRef, useState } from "react";
import { getDailyGoals, setDailyGoals } from "../data/dailyGoals";
import { emitStudyFeedback } from "../data/audioSettings";

export default function DailyGoalCard() {
  const [data, setData] = useState(() => getDailyGoals());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.goals);

  useEffect(() => {
    const refresh = () => {
      const next = getDailyGoals();
      setData(next);
      setDraft(next.goals);
    };

    window.addEventListener("daily-goals-updated", refresh);
    return () => window.removeEventListener("daily-goals-updated", refresh);
  }, []);

  const rows = useMemo(
    () => [
      { key: "questions" as const, label: "Quizfrågor" },
      { key: "theoryPages" as const, label: "Teorisidor" },
      { key: "codeExercises" as const, label: "Kodövningar" }
    ],
    []
  );

  const finished = rows.filter(
    (row) => data.progress[row.key] >= data.goals[row.key]
  ).length;
  const previousFinished = useRef(finished);

  useEffect(() => {
    if (finished === 3 && previousFinished.current < 3) {
      emitStudyFeedback("achievement");
    }
    previousFinished.current = finished;
  }, [finished]);

  function saveGoals() {
    setDailyGoals(draft);
    setEditing(false);
  }

  return (
    <article className="dashboard-panel daily-goal-card">
      <div className="section-header-row">
        <div>
          <h3>Dagens mål</h3>
          <p className="muted">{finished} / 3 mål klara idag.</p>
        </div>
        <button type="button" onClick={() => setEditing((value) => !value)}>
          {editing ? "Stäng" : "Ändra"}
        </button>
      </div>

      <div className="daily-goal-list">
        {rows.map((row) => {
          const progress = data.progress[row.key];
          const goal = data.goals[row.key];
          const percent = Math.min(100, Math.round((progress / Math.max(1, goal)) * 100));

          return (
            <div key={row.key} className="daily-goal-row">
              <div>
                <strong>{row.label}</strong>
                <span>{progress} / {goal}</span>
              </div>
              <div className="daily-goal-track">
                <span style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="daily-goal-editor">
          <label>
            Quizfrågor
            <input
              type="number"
              min={1}
              value={draft.questions}
              onChange={(e) => setDraft({ ...draft, questions: Number(e.target.value) })}
            />
          </label>
          <label>
            Teorisidor
            <input
              type="number"
              min={1}
              value={draft.theoryPages}
              onChange={(e) => setDraft({ ...draft, theoryPages: Number(e.target.value) })}
            />
          </label>
          <label>
            Kodövningar
            <input
              type="number"
              min={1}
              value={draft.codeExercises}
              onChange={(e) => setDraft({ ...draft, codeExercises: Number(e.target.value) })}
            />
          </label>
          <button className="primary-button auto-width" type="button" onClick={saveGoals}>
            Spara mål
          </button>
        </div>
      )}
    </article>
  );
}
