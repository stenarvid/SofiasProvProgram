import { useState } from "react";

const tasks = [
  {
    topic: "State",
    code: `function Counter() {
  const [count, setCount] = useState(1);

  return (
    <button onClick={() => setCount(count + 2)}>
      {count}
    </button>
  );
}`,
    question: "Vad visar knappen efter två klick?",
    options: ["3", "5", "4", "1"],
    answer: 1,
    explanation: "Startvärdet är 1. Varje klick lägger till 2: 1 → 3 → 5."
  },
  {
    topic: "Props",
    code: `function Greeting({ name }: { name: string }) {
  return <p>Hej {name}!</p>;
}

<Greeting name="Alex" />`,
    question: "Vad renderas?",
    options: ["Hej Alex!", "Hej name!", "Alex", "Ingenting"],
    answer: 0,
    explanation: "Prop-en name har värdet Alex och sätts in i JSX."
  },
  {
    topic: "TypeScript",
    code: `type User = {
  name: string;
  age?: number;
};

const user: User = { name: "Kim" };`,
    question: "Är objektet giltigt?",
    options: ["Ja", "Nej, age saknas", "Nej, name måste vara number"],
    answer: 0,
    explanation: "age har ?, alltså är den valfri."
  },
  {
    topic: "Fetch",
    code: `const response = await fetch("/api/users");
const data = await response.json();`,
    question: "Vad innehåller data normalt?",
    options: [
      "Det parsade JSON-innehållet från response",
      "Själva fetch-funktionen",
      "En React-komponent"
    ],
    answer: 0,
    explanation: "response.json() läser response body och parser JSON."
  }
];

export default function CodeReadingPage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const task = tasks[index];

  function next() {
    setIndex((i) => (i + 1) % tasks.length);
    setSelected(null);
    setChecked(false);
  }

  return (
    <section className="quiz-page">
      <span className="topic-badge">{task.topic}</span>
      <h2>Kodläsning</h2>
      <pre><code>{task.code}</code></pre>
      <h3>{task.question}</h3>

      <div className="quiz-options">
        {task.options.map((option, i) => (
          <button
            type="button"
            key={option}
            className={`quiz-option ${checked && i === task.answer ? "correct-option" : ""} ${checked && i === selected && i !== task.answer ? "wrong-option" : ""}`}
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
          <div className={selected === task.answer ? "feedback feedback-correct" : "feedback feedback-wrong"}>
            {task.explanation}
          </div>
          <button type="button" className="primary-button" onClick={next}>Nästa</button>
        </>
      )}
    </section>
  );
}
