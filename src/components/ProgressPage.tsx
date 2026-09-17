import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  clearQuestionProgress,
  getQuestionProgress
} from "../data/questionProgress";
import { getProgress } from "../data/progress";
import { getTestHistory } from "../data/history";
import { questionBank } from "../data/questionBank";
import { getCodeProgress } from "../data/codeProgress";

type SortMode = "wrong" | "rate" | "seen";

export default function ProgressPage() {
  const [version, setVersion] = useState(0);
  const [sortMode, setSortMode] = useState<SortMode>("wrong");
  const [topicFilter, setTopicFilter] = useState("Alla");

  useEffect(() => {
    const update = () => setVersion((v) => v + 1);
    window.addEventListener("question-progress-updated", update);
    window.addEventListener("code-progress-updated", update);
    return () => {
      window.removeEventListener("question-progress-updated", update);
      window.removeEventListener("code-progress-updated", update);
    };
  }, []);

  const questionProgress = useMemo(() => getQuestionProgress(), [version]);
  const topicProgress = useMemo(() => getProgress(), [version]);
  const history = useMemo(() => getTestHistory(), [version]);
  const codeProgress = useMemo(() => getCodeProgress(), [version]);

  const topics = useMemo(
    () => ["Alla", ...Array.from(new Set(questionBank.map((q) => q.topic))).sort()],
    []
  );

  const rows = useMemo(() => {
    return Object.values(questionProgress)
      .filter((item) => topicFilter === "Alla" || item.topic === topicFilter)
      .map((item) => ({
        ...item,
        wrongRate: item.seen ? Math.round((item.wrong / item.seen) * 100) : 0
      }))
      .sort((a, b) => {
        if (sortMode === "rate") return b.wrongRate - a.wrongRate || b.wrong - a.wrong;
        if (sortMode === "seen") return b.seen - a.seen;
        return b.wrong - a.wrong || b.wrongRate - a.wrongRate;
      });
  }, [questionProgress, sortMode, topicFilter]);

  const totals = Object.values(questionProgress).reduce(
    (acc, item) => {
      acc.seen += item.seen;
      acc.correct += item.correct;
      acc.wrong += item.wrong;
      return acc;
    },
    { seen: 0, correct: 0, wrong: 0 }
  );

  const accuracy = totals.seen
    ? Math.round((totals.correct / totals.seen) * 100)
    : 0;

  const masteredQuestions = Object.values(questionProgress).filter(
    (item) => item.seen >= 3 && item.correct / item.seen >= 0.8
  ).length;

  const topicRows = Object.entries(topicProgress)
    .map(([topic, stats]) => {
      const total = stats.correct + stats.wrong;
      return {
        topic,
        total,
        correct: stats.correct,
        wrong: stats.wrong,
        percent: total ? Math.round((stats.correct / total) * 100) : 0
      };
    })
    .sort((a, b) => a.percent - b.percent);

  return (
    <section>
      <h2>Din progress</h2>
      <p>
        All statistik sparas i webbläsarens localStorage och finns kvar mellan
        sessioner på samma webbläsare/enhet.
      </p>

      <div className="progress-summary">
        <article className="stat-card">
          <span>Svar totalt</span>
          <strong>{totals.seen}</strong>
        </article>
        <article className="stat-card">
          <span>Träffsäkerhet</span>
          <strong>{accuracy}%</strong>
        </article>
        <article className="stat-card">
          <span>Frågor bemästrade</span>
          <strong>{masteredQuestions}</strong>
        </article>
        <article className="stat-card">
          <span>Genomförda test</span>
          <strong>{history.length}</strong>
        </article>
        <article className="stat-card">
          <span>Koduppgifter försökta</span>
          <strong>{Object.values(codeProgress).filter((x) => x.attempts > 0).length}</strong>
        </article>
      </div>

      <div className="panel">
        <div className="section-header-row">
          <div>
            <h3>Mastery per område</h3>
            <p className="muted">80%+ räknas här som starkt område.</p>
          </div>
        </div>

        <div className="mastery-list">
          {topicRows.length === 0 ? (
            <p>Gör ett quiz för att börja samla statistik.</p>
          ) : (
            topicRows.map((row) => (
              <div className="mastery-row" key={row.topic}>
                <strong>{row.topic}</strong>
                <div className="mastery-bar">
                  <div style={{ width: `${row.percent}%` }} />
                </div>
                <span>{row.percent}%</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel">
        <div className="section-header-row">
          <div>
            <h3>Frågor du brukar missa</h3>
            <p className="muted">
              Se exakt hur många gånger varje fråga blivit fel.
            </p>
          </div>

          <Link className="action-link" to="/missed-questions">
            Öva på alla missade frågor
          </Link>
        </div>

        <div className="progress-controls">
          <label>
            Ämne
            <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
              {topics.map((topic) => <option key={topic}>{topic}</option>)}
            </select>
          </label>

          <label>
            Sortera
            <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}>
              <option value="wrong">Flest fel</option>
              <option value="rate">Högst felprocent</option>
              <option value="seen">Mest övad</option>
            </select>
          </label>
        </div>

        {rows.length === 0 ? (
          <p>Ingen frågestatistik ännu.</p>
        ) : (
          <div className="question-progress-list">
            {rows.map((row) => (
              <article className="question-progress-card" key={row.questionId}>
                <div className="question-progress-top">
                  <span className="topic-badge">{row.topic}</span>
                  <strong>{row.wrongRate}% fel</strong>
                </div>

                <p>{row.question}</p>

                <div className="question-progress-metrics">
                  <span>Sett: {row.seen}</span>
                  <span className="metric-correct">Rätt: {row.correct}</span>
                  <span className="metric-wrong">Fel: {row.wrong}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="section-header-row">
          <div>
            <h3>Kodprogress</h3>
            <p className="muted">
              Se försök, delpoäng, hints och vilka programmeringsuppgifter du behöver göra om.
            </p>
          </div>
          <Link className="action-link" to="/code-progress">
            Visa kodprogress
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="secondary-button"
        onClick={() => {
          clearQuestionProgress();
          setVersion((v) => v + 1);
        }}
      >
        Nollställ frågestatistik
      </button>
    </section>
  );
}
