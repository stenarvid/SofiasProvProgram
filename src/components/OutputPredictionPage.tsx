import TrainingSession from "./TrainingSession";
import { useState } from "react";
import { emitStudyFeedback } from "../data/audioSettings";

const tasks = [
  { topic: "TypeScript", code: `const names: string[] = ["Anna", "Erik"];\nconsole.log(names.length);`, answer: "2", explanation: "Arrayen innehåller två element." },
  { topic: "JavaScript/React", code: `const count = 2;\nconsole.log(count + 1);`, answer: "3", explanation: "2 + 1 blir 3." },
  { topic: "State", code: `import { useState } from "react";\n\n// Vad loggas när React renderar Status första gången?\nfunction Status() {\n  const [open] = useState(false);\n  console.log(open);\n  return null;\n}`, answer: "false", explanation: "Startvärdet är false. useState anropas inuti en React-komponent, inte på modulnivå. I Strict Mode kan samma värde loggas mer än en gång under utveckling." },
  { topic: "TypeScript", code: `type Status = "idle" | "done";\nconst status: Status = "done";\nconsole.log(status);`, answer: "done", explanation: "Uniontypen begränsar värdet men ändrar inte vad som loggas." },
  { topic: "Fetch", code: `// Anta att servern svarar med HTTP 404.\nconst response = await fetch("/api/users");\nconsole.log(response.ok);`, answer: "false", explanation: "HTTP 404 ger response.ok === false. fetch rejectas inte enbart på grund av HTTP-fel. response.ok är true för status 200–299." },
  { topic: "Zod", code: `const result = z.string().min(2).safeParse("A");\nconsole.log(result.success);`, answer: "false", explanation: "Strängen har bara ett tecken och klarar inte min(2)." }
];

export default function OutputPredictionPage() {
  return <TrainingSession items={tasks} topics={(item) => [item.topic]}>
    {(item, index, next) => <TrainingTask item={item} index={index} nextTask={next} />}
  </TrainingSession>;
}

function TrainingTask({ item: source, nextTask }: { item: (typeof tasks)[number]; index: number; nextTask: () => void }) {
  const [guess, setGuess] = useState("");
  const [checked, setChecked] = useState(false);
  const task = source;
  const correct = guess.trim().toLowerCase() === task.answer.toLowerCase();

  function check() {
    setChecked(true);
    emitStudyFeedback(correct ? "correct" : "wrong");
  }

  const next = nextTask;

  return (
    <section className="learning-page">
      <div className="hub-hero">
        <span className="topic-badge">Vad blir output?</span>
        <h2>Förutse resultatet innan du kör koden</h2>
        <p>Tränar aktiv kodläsning i stället för att bara titta på facit.</p>
      </div>
      <article className="explain-code-card">
        <span className="topic-badge">{task.topic}</span>
        <pre><code>{task.code}</code></pre>
        <label>Ditt svar<input value={guess} disabled={checked} onChange={(e) => setGuess(e.target.value)} /></label>
        {!checked ? (
          <button type="button" className="primary-button auto-width" onClick={check} disabled={!guess.trim()}>Rätta</button>
        ) : (
          <div className={`feedback ${correct ? "feedback-correct" : "feedback-wrong"}`}>
            <h3>{correct ? "Rätt!" : `Svar: ${task.answer}`}</h3>
            <p>{task.explanation}</p>
            <button type="button" onClick={next}>Nästa →</button>
          </div>
        )}
      </article>
    </section>
  );
}
