import { useState } from "react";

const questions = [
  {
    topic: "State",
    code: `onClick={setCount(count + 1)}`,
    options: [
      "setCount körs direkt istället för vid klick",
      "count måste vara string",
      "onClick finns inte i React"
    ],
    answer: 0,
    explanation: "onClick ska få en funktion, t.ex. onClick={() => setCount(count + 1)}."
  },
  {
    topic: "Fetch",
    code: `return response.json;`,
    options: [
      "json måste anropas: response.json()",
      "response får inte returneras",
      "json finns bara i Hono"
    ],
    answer: 0,
    explanation: "response.json är en funktion. Du behöver parenteser för att köra den."
  },
  {
    topic: "TypeScript",
    code: `let age: number = "20";`,
    options: [
      "En string tilldelas en number-variabel",
      "number är inte en TypeScript-typ",
      "let får inte användas"
    ],
    answer: 0,
    explanation: "Typen är number men värdet är en string."
  },
  {
    topic: "Router",
    code: `<Route url="/about" component={<About />} />`,
    options: [
      "Modern React Router använder path och element",
      "About måste heta Router",
      "Route får inte ha props"
    ],
    answer: 0,
    explanation: "Skriv <Route path='/about' element={<About />} />."
  }
];

export default function QuickErrorsPage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const q = questions[index];

  function next() {
    setIndex((i) => (i + 1) % questions.length);
    setSelected(null);
    setChecked(false);
  }

  return (
    <section className="quiz-page">
      <span className="topic-badge">{q.topic}</span>
      <h2>Vad är fel här?</h2>

      <pre><code>{q.code}</code></pre>

      <div className="quiz-options">
        {q.options.map((option, i) => (
          <button
            type="button"
            key={option}
            className={`quiz-option ${checked && i === q.answer ? "correct-option" : ""} ${checked && i === selected && i !== q.answer ? "wrong-option" : ""}`}
            onClick={() => !checked && setSelected(i)}
          >
            {option}
          </button>
        ))}
      </div>

      {!checked ? (
        <button type="button" className="primary-button" disabled={selected === null} onClick={() => setChecked(true)}>
          Rätta
        </button>
      ) : (
        <>
          <div className={selected === q.answer ? "feedback feedback-correct" : "feedback feedback-wrong"}>
            <p>{q.explanation}</p>
          </div>
          <button type="button" className="primary-button" onClick={next}>Nästa</button>
        </>
      )}
    </section>
  );
}
