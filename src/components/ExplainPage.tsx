import { lessonReadingQuestions, type LessonSource } from "../data/lessonTraining";
import TrainingLessonSource from "./TrainingLessonSource";
import TrainingSession from "./TrainingSession";
import { useState } from "react";
import { recordAnswer } from "../data/progress";

const cards: (Partial<LessonSource> & { topic: string; prompt: string; answer: string; code?: string })[] = [
  {
    topic: "React",
    prompt: "Förklara med egna ord: Vad är React?",
    answer: "React är ett JavaScript-bibliotek för att bygga användargränssnitt med återanvändbara komponenter."
  },
  {
    topic: "State",
    prompt: "Vad är state och varför används det?",
    answer: "State är data som en komponent håller reda på och som kan ändras. När state ändras kan React rendera om UI:t."
  },
  {
    topic: "Props",
    prompt: "Vad är props och hur skiljer de sig från state?",
    answer: "Props skickas in till en komponent utifrån och behandlas som read-only. State ägs och uppdateras av komponenten."
  },
  {
    topic: "Fetch",
    prompt: "Vad händer när man använder fetch?",
    answer: "fetch skickar ett HTTP-anrop och returnerar en Promise som senare ger ett Response-objekt."
  },
  {
    topic: "query",
    prompt: "Varför skulle man använda React Query istället för bara fetch?",
    answer: "React Query hanterar bland annat cache, loading, errors, refetch och server state runt själva fetch-anropet."
  },
  {
    topic: "Hono",
    prompt: "Vad används Hono till?",
    answer: "Hono är ett webbframework för JavaScript/TypeScript som kan användas för att skapa server- och API-routes."
  },
  {
    topic: "Server",
    prompt: "Förklara request → server → response.",
    answer: "Klienten skickar en request till servern. Servern behandlar den och skickar tillbaka ett response, ofta med statuskod och data."
  },
  {
    topic: "Zod",
    prompt: "Varför används Zod?",
    answer: "Zod används för att beskriva och validera strukturen på data, till exempel formulärdata eller API-data."
  },
  ...lessonReadingQuestions.map((question) => ({ ...question, prompt: question.question, answer: `${question.options[question.answer]} ${question.explanation}` }))
];

export default function ExplainPage() {
  return <TrainingSession items={cards} topics={(item) => [item.topic]}>
    {(item, index, next) => <TrainingTask item={item} index={index} nextTask={next} />}
  </TrainingSession>;
}

function TrainingTask({ item: source, nextTask }: { item: (typeof cards)[number]; index: number; nextTask: () => void }) {
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);

  const card = source;

  function next(knewIt: boolean) {
    recordAnswer(card.topic, knewIt);
    nextTask();
  }

  return (
    <section className="coding-page">
      <span className="topic-badge">{card.topic}</span>
      <h2>Förklara med egna ord</h2>
      <TrainingLessonSource source={card} />
      {card.code && <pre><code>{card.code}</code></pre>}
      <p>{card.prompt}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Skriv din egen förklaring här innan du visar facit..."
      />

      <div className="coding-actions">
        <button type="button" onClick={() => setShow((v) => !v)}>
          {show ? "Dölj exempelsvar" : "Visa exempelsvar"}
        </button>
      </div>

      {show && (
        <div className="solution-box">
          <h3>Exempelsvar</h3>
          <p>{card.answer}</p>

          <p>Jämför med det du skrev. Hur kändes det?</p>

          <div className="coding-actions">
            <button type="button" onClick={() => next(false)}>
              Behöver öva mer
            </button>
            <button type="button" className="primary-button auto-width" onClick={() => next(true)}>
              Jag kunde detta
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
