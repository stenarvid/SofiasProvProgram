import { lessonReadingQuestions, type LessonSource } from "../data/lessonTraining";
import TrainingLessonSource from "./TrainingLessonSource";
import TrainingSession from "./TrainingSession";
import { shuffleQuestionOptions } from "../data/quizShuffle";
import { useMemo, useState } from "react";

const tasks: (Partial<LessonSource> & { topic: string; code: string; options: string[]; answer: number; explanation: string; question: string; context?: string })[] = [
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
    question: "Vilken text visas när React renderar <Greeting name=\"Alex\" /> i komponentträdet?",
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
    question: "Klarar objektet TypeScripts typkontroll mot User?",
    options: ["Ja", "Nej, age saknas", "Nej, name måste vara number"],
    answer: 0,
    explanation: "age har ?, alltså är den valfri."
  },
  {
    topic: "Fetch",
    code: `const response = await fetch("/api/users");
const data = await response.json();`,
    question: "Anta att requesten lyckas och svaret innehåller giltig JSON. Vad innehåller data efter båda await?",
    options: [
      "Det parsade JSON-innehållet från response",
      "Själva fetch-funktionen",
      "En React-komponent"
    ],
    answer: 0,
    explanation: "response.json() returnerar en Promise. Efter await innehåller data det parsade JavaScript-värdet, exempelvis en array eller ett objekt. Ogiltig JSON gör att läsningen misslyckas; HTTP-status bör kontrolleras separat med response.ok."
  },
  ...lessonReadingQuestions
];

export default function CodeReadingPage() {
  return <TrainingSession items={tasks} topics={(item) => [item.topic]}>
    {(item, index, next) => <TrainingTask item={item} index={index} nextTask={next} />}
  </TrainingSession>;
}

function TrainingTask({ item: source, nextTask }: { item: (typeof tasks)[number]; index: number; nextTask: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const task = useMemo(() => shuffleQuestionOptions(source), [source]);

  const next = nextTask;

  return (
    <section className="quiz-page">
      <span className="topic-badge">{task.topic}</span>
      <h2>Kodläsning</h2>
      <TrainingLessonSource source={task} />
      <pre><code>{task.code}</code></pre>
      <h3>{task.question}</h3>

      <div className="quiz-options">
        {task.options.map((option, i) => (
          <button
            type="button"
            key={option}
            aria-pressed={i === selected}
            disabled={checked}
            className={`quiz-option ${!checked && i === selected ? "selected-option" : ""} ${checked && i === task.answer ? "correct-option" : ""} ${checked && i === selected && i !== task.answer ? "wrong-option" : ""}`}
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
