import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { clearCodeProgress, getCodeProgress } from "../data/codeProgress";

export default function CodeProgressPage() {
  const [version, setVersion] = useState(0);
  const [openCodeId, setOpenCodeId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setVersion((v) => v + 1);
    window.addEventListener("code-progress-updated", update);
    return () => window.removeEventListener("code-progress-updated", update);
  }, []);

  const rows = useMemo(() => {
    return Object.values(getCodeProgress())
      .sort((a, b) => {
        const aNeed = 100 - a.bestScore + a.hintsUsed * 5 + a.solutionViews * 10;
        const bNeed = 100 - b.bestScore + b.hintsUsed * 5 + b.solutionViews * 10;
        return bNeed - aNeed;
      });
  }, [version]);

  const attempted = rows.filter((r) => r.attempts > 0);
  const mastered = attempted.filter((r) => r.bestScore === 100 && r.solutionViews === 0);
  const averageBest = attempted.length
    ? Math.round(attempted.reduce((sum, r) => sum + r.bestScore, 0) / attempted.length)
    : 0;

  return (
    <section>
      <div className="section-header-row">
        <div>
          <h2>Kodprogress</h2>
          <p>
            Här räknas dina försök, bästa testresultat, hints och facitvisningar.
          </p>
        </div>

        <div className="inline-actions">
          <Link className="action-link" to="/code-library">
            Kodbank per ämne
          </Link>
          <Link className="action-link" to="/practice">
            Öppna kodövningar
          </Link>
        </div>
      </div>

      <div className="progress-summary">
        <article className="stat-card">
          <span>Försökta uppgifter</span>
          <strong>{attempted.length}</strong>
        </article>
        <article className="stat-card">
          <span>Bemästrade utan facit</span>
          <strong>{mastered.length}</strong>
        </article>
        <article className="stat-card">
          <span>Snitt bästa resultat</span>
          <strong>{averageBest}%</strong>
        </article>
        <article className="stat-card">
          <span>Totala kodförsök</span>
          <strong>{rows.reduce((sum, r) => sum + r.attempts, 0)}</strong>
        </article>
      </div>

      {rows.length === 0 ? (
        <div className="panel">
          <p>Ingen kodprogress ännu. Tryck på “Rätta min kod” i en kodövning.</p>
        </div>
      ) : (
        <div className="code-progress-list">
          {rows.map((row) => {
            const passRate = row.attempts
              ? Math.round((row.passes / row.attempts) * 100)
              : 0;

            return (
              <article className="code-progress-card" key={row.exerciseId}>
                <div className="question-progress-top">
                  <div>
                    <span className="topic-badge">{row.topic}</span>
                    <h3>{row.title}</h3>
                  </div>
                  <strong>{row.bestScore}% bäst</strong>
                </div>

                <div className="code-progress-metrics">
                  <span>Försök: {row.attempts}</span>
                  <span>Godkända: {row.passes}</span>
                  <span>Pass rate: {passRate}%</span>
                  <span>Hints: {row.hintsUsed}</span>
                  <span>Facit visat: {row.solutionViews}</span>
                </div>

                <div className="mastery-bar">
                  <div style={{ width: `${row.bestScore}%` }} />
                </div>

                {row.bestScore < 100 && (
                  <p className="muted">
                    Rekommendation: gör om uppgiften tills alla funktionella tester passerar.
                  </p>
                )}

                {row.bestScore === 100 && row.solutionViews > 0 && (
                  <p className="muted">
                    Du har klarat testerna. Försök gärna en gång utan facit för starkare repetition.
                  </p>
                )}

                {row.lastCode && (
                  <div className="code-progress-saved">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenCodeId(openCodeId === row.exerciseId ? null : row.exerciseId)
                      }
                    >
                      {openCodeId === row.exerciseId ? "Dölj senaste kod" : "Visa senaste kod"}
                    </button>

                    {openCodeId === row.exerciseId && (
                      <pre><code>{row.lastCode}</code></pre>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className="secondary-button"
        onClick={() => {
          clearCodeProgress();
          setVersion((v) => v + 1);
        }}
      >
        Nollställ kodprogress
      </button>
    </section>
  );
}
