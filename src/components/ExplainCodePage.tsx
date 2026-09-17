import { trainingLessons, type LessonSource } from "../data/lessonTraining";
import TrainingLessonSource from "./TrainingLessonSource";
import TrainingSession from "./TrainingSession";
import { useState } from "react";

const tasks: (Partial<LessonSource> & { topic: string; code: string; answer: string })[] = [
  { topic: "React", code: `function Greeting() {\n  return <h2>Hej!</h2>;\n}`, answer: "Greeting är en React-komponent. Funktionen returnerar JSX som beskriver ett h2-element. Komponenten kan renderas som <Greeting />." },
  { topic: "State", code: `import { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(prev => prev + 1)}>\n      {count}\n    </button>\n  );\n}`, answer: "När React renderar Counter första gången visar knappen 0. useState anropas inuti komponenten. Vid ett klick körs handlern och setCount använder det föregående värdet: efter ett klick visas 1. Settern körs i klickfunktionen, inte direkt under renderingen." },
  { topic: "Fetch", code: `const res = await fetch("/api/users");\nif (!res.ok) throw new Error("Fel");\nconst users = await res.json();`, answer: "Koden gör ett HTTP-anrop, kontrollerar att status är 2xx och läser sedan response body som JSON." },
  { topic: "React Query", code: `useQuery({\n  queryKey: ["user", id],\n  queryFn: () => getUser(id)\n});`, answer: "queryKey identifierar cacheposten och inkluderar id eftersom datan beror på id. queryFn är funktionen som hämtar användaren." },
  { topic: "Zod", code: `const schema = z.object({\n  email: z.string().email()\n});`, answer: "Ett runtime-schema skapas. Objektet måste ha email och värdet måste vara en string som klarar Zods e-postvalidering." },
  { topic: "Hono", code: `app.get("/api/hello", (c) => {\n  return c.json({ message: "Hej" });\n});`, answer: "Hono registrerar en GET-route. När /api/hello anropas skapar context c ett JSON-response." },
  ...trainingLessons.map((lesson) => ({ ...lesson, answer: lesson.walkthrough.join("\n\n") }))
];

export default function ExplainCodePage() {
  return <TrainingSession items={tasks} topics={(item) => [item.topic]}>
    {(item, index, next) => <TrainingTask item={item} index={index} nextTask={next} />}
  </TrainingSession>;
}

function TrainingTask({ item: source, nextTask }: { item: (typeof tasks)[number]; index: number; nextTask: () => void }) {
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);
  const task = source;

  const next = nextTask;

  return (
    <section className="learning-page">
      <div className="hub-hero">
        <span className="topic-badge">Förklara koden</span>
        <h2>Vad gör varje del?</h2>
        <p>Skriv med egna ord först. Jämför sedan med en tydlig referensförklaring.</p>
      </div>
      <article className="explain-code-card">
        <span className="topic-badge">{task.topic}</span>
        <TrainingLessonSource source={task} />
        <pre><code>{task.code}</code></pre>
        <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Förklara koden här..." />
        <div className="inline-actions">
          <button type="button" className="primary-button auto-width" onClick={() => setShow(true)}>Jämför med förklaring</button>
          <button type="button" onClick={next}>Nästa</button>
        </div>
        {show && <div className="reference-answer"><strong>Referensförklaring</strong><p>{task.answer}</p></div>}
      </article>
    </section>
  );
}
