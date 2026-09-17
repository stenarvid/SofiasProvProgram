import { useMemo, useState } from "react";
import { clearTestHistory, getTestHistory } from "../data/history";

export default function HistoryPage() {
  const [version, setVersion] = useState(0);
  const history = useMemo(() => getTestHistory(), [version]);

  return (
    <section>
      <h2>Testhistorik</h2>
      <p>Här ser du dina senaste quizresultat på den här enheten.</p>

      {history.length === 0 ? (
        <div className="panel">Ingen testhistorik ännu.</div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => {
            const percent = Math.round((item.score / item.total) * 100);
            return (
              <article className="history-card" key={`${item.date}-${index}`}>
                <div>
                  <strong>{new Date(item.date).toLocaleString("sv-SE")}</strong>
                  <p>{item.topics.join(", ")}</p>
                </div>
                <div className="history-score">
                  {item.score}/{item.total}
                  <span>{percent}%</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className="secondary-button"
        onClick={() => {
          clearTestHistory();
          setVersion((v) => v + 1);
        }}
      >
        Rensa historik
      </button>
    </section>
  );
}
