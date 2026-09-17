import { useMemo, useState } from "react";
import { clearProgress, getProgress } from "../data/progress";

export default function StatsPage() {
  const [version, setVersion] = useState(0);
  const progress = useMemo(() => getProgress(), [version]);

  const rows = Object.entries(progress)
    .map(([topic, stats]) => {
      const total = stats.correct + stats.wrong;
      const percent = total ? Math.round((stats.correct / total) * 100) : 0;
      return { topic, ...stats, total, percent };
    })
    .sort((a, b) => a.percent - b.percent);

  const weak = rows.filter((row) => row.total >= 2 && row.percent < 70);

  return (
    <section>
      <h2>Svaga områden & statistik</h2>
      <p>
        Sidan sparar lokalt vilka quizfrågor du svarar rätt och fel på.
        Områden under 70% markeras som sådant du bör repetera.
      </p>

      {rows.length === 0 ? (
        <div className="panel">
          <p>Du har ingen statistik ännu. Gör några quizfrågor först.</p>
        </div>
      ) : (
        <>
          {weak.length > 0 && (
            <div className="warning-box">
              <h3>Öva extra på</h3>
              <ul>
                {weak.map((row) => (
                  <li key={row.topic}>
                    <strong>{row.topic}</strong> – {row.percent}% rätt
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="stats-grid">
            {rows.map((row) => (
              <article className="stat-card" key={row.topic}>
                <h3>{row.topic}</h3>
                <p className="stat-percent">{row.percent}%</p>
                <p>
                  {row.correct} rätt / {row.wrong} fel
                </p>
              </article>
            ))}
          </div>
        </>
      )}

      <button
        type="button"
        className="secondary-button"
        onClick={() => {
          clearProgress();
          setVersion((v) => v + 1);
        }}
      >
        Nollställ statistik
      </button>
    </section>
  );
}
