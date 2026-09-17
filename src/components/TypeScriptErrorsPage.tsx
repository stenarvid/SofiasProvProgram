import { useState } from "react";

const tasks = [
  {
    error: `Type 'string' is not assignable to type 'number'.`,
    code: `let age: number = "20";`,
    options: [
      "Du försöker lägga en string i något som ska vara number",
      "Variabeln måste heta number",
      "TypeScript saknar React"
    ],
    answer: 0,
    explanation: `Byt till let age: number = 20; eller ändra typen om en string faktiskt är avsikten.`
  },
  {
    error: `Property 'age' is missing in type '{ name: string; }' but required in type 'User'.`,
    code: `type User = { name: string; age: number };
const user: User = { name: "Sam" };`,
    options: [
      "Objektet saknar den obligatoriska propertyn age",
      "name måste vara number",
      "User får inte vara en type"
    ],
    answer: 0,
    explanation: `Lägg till age eller gör den valfri med age?: number.`
  },
  {
    error: `Cannot find name 'setCount'.`,
    code: `const [count, setCounter] = useState(0);
setCount(count + 1);`,
    options: [
      "Setter-funktionen heter setCounter men koden använder setCount",
      "useState fungerar inte",
      "count måste vara string"
    ],
    answer: 0,
    explanation: `Namnen måste matcha. Använd setCounter eller döp destructuring-variabeln till setCount.`
  }
];

export default function TypeScriptErrorsPage() {
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
      <h2>Tolka TypeScript-fel</h2>
      <div className="ts-error-box">{task.error}</div>
      <pre><code>{task.code}</code></pre>

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
