import TrainingSession from "./TrainingSession";
import { shuffle } from "../data/quizShuffle";
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

const pairTopics = ["State", "Props", "React Query", "Hono", "Jotai", "Zod", "React Router", "Fetch"];
const taggedPairs = pairs.map((pair, index) => ({ pair, topic: pairTopics[index] }));

export default function MatchingPage() {
  return <TrainingSession items={taggedPairs} topics={(item) => [item.topic]}>
    {(item, _index, next) => <MatchingTask pair={item.pair} next={next} />}
  </TrainingSession>;
}

function MatchingTask({ pair, next }: { pair: (typeof pairs)[number]; next: () => void }) {
  const pairs = [pair];
  const [options] = useState(() => shuffle(meanings));
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const score = pairs.filter(([term, meaning]) => answers[term] === meaning).length;


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
                aria-label={`Förklaring till ${term}`}
                value={answers[term] ?? ""}
                disabled={checked}
                onChange={(e) => setAnswers((a) => ({ ...a, [term]: e.target.value }))}
              >
                <option value="">Välj...</option>
                {options.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          );
        })}
      </div>

      {!checked ? (
        <button type="button" className="primary-button" disabled={!answers[pair[0]]} onClick={() => setChecked(true)}>
          Rätta
        </button>
      ) : (
        <>
          <p className="result">{score ? "Rätt!" : `Rätt förklaring: ${pair[1]}`}</p>
          <button type="button" className="secondary-button" onClick={next}>
            Nästa begrepp
          </button>
        </>
      )}
    </section>
  );
}
