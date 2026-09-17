import { useState } from "react";

const pairs = [
  ["useState", "Lokalt React-state"],
  ["props", "Data som skickas in till en komponent"],
  ["queryKey", "Identifierar en React Query-query/cache"],
  ["c.json", "Returnerar JSON i Hono"],
  ["atom", "State-enhet i Jotai"],
  ["z.object", "Skapar ett Zod-schema för objekt"],
  ["Link", "Klientnavigation med React Router"],
  ["response.ok", "Kontrollerar om HTTP-svaret lyckades"]
] as const;

const meanings = pairs.map(([, meaning]) => meaning);

export default function MatchingPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const score = pairs.filter(([term, meaning]) => answers[term] === meaning).length;

  function reset() {
    setAnswers({});
    setChecked(false);
  }

  return (
    <section>
      <h2>Begreppskoppling</h2>
      <p>Koppla varje begrepp till rätt förklaring.</p>

      <div className="matching-list">
        {pairs.map(([term, meaning]) => {
          const isRight = answers[term] === meaning;

          return (
            <div
              key={term}
              className={`matching-row ${checked ? (isRight ? "matching-right" : "matching-wrong") : ""}`}
            >
              <strong>{term}</strong>
              <select
                value={answers[term] ?? ""}
                disabled={checked}
                onChange={(e) => setAnswers((a) => ({ ...a, [term]: e.target.value }))}
              >
                <option value="">Välj...</option>
                {meanings.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          );
        })}
      </div>

      {!checked ? (
        <button type="button" className="primary-button" onClick={() => setChecked(true)}>
          Rätta
        </button>
      ) : (
        <>
          <p className="result">Du fick {score} av {pairs.length} rätt.</p>
          <button type="button" className="secondary-button" onClick={reset}>
            Gör om
          </button>
        </>
      )}
    </section>
  );
}
