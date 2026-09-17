import { lessonReadingQuestions, type LessonSource } from "../data/lessonTraining";
import TrainingLessonSource from "./TrainingLessonSource";
import TrainingSession from "./TrainingSession";
import { useState } from "react";
import { shuffle } from "../data/quizShuffle";

const cards = [
  ["useState", "Lokalt state i en React-komponent.", `const [count, setCount] = useState(0);`],
  ["Props", "Data som skickas in till en komponent.", `<UserCard name="Anna" />`],
  ["queryKey", "Identifierar en query och dess cache i React Query.", `queryKey: ["users"]`],
  ["atom", "En liten state-enhet i Jotai.", `const countAtom = atom(0);`],
  ["safeParse", "Validerar med Zod utan att kasta ett exception direkt.", `schema.safeParse(data)`],
  ["response.ok", "Visar om ett HTTP-response ligger inom lyckat statusintervall.", `if (!response.ok) throw new Error("Fel");`],
  ["Link", "Intern navigation med React Router.", `<Link to="/about">Om</Link>`],
  ["c.json", "Returnerar JSON från en Hono-handler.", `return c.json({ ok: true });`],
  ["Controlled input", "Ett input vars value styrs av state.", `value={name} onChange={...}`],
  ["HTTP 404", "Resursen hittades inte.", `404 Not Found`]
] as const;

const cardTopics = ["State", "Props", "React Query", "Jotai", "Zod", "Fetch", "React Router", "Hono", "Databindning", "Server"];
type TrainingCard = Partial<LessonSource> & { topic: string; card: readonly [string, string, string] };
const taggedCards: TrainingCard[] = [
  ...cards.map((card, index) => ({ card, topic: cardTopics[index] })),
  ...lessonReadingQuestions.map((question): TrainingCard => ({
    ...question,
    card: [question.question, question.options[question.answer] + " " + question.explanation, question.code]
  }))
];

export default function FlashcardsPage() {
  const [deck] = useState(() => shuffle(taggedCards));
  return <TrainingSession items={deck} topics={(item) => [item.topic]}>
    {(item, _index, next) => <Flashcard item={item} next={next} />}
  </TrainingSession>;
}

function Flashcard({ item, next }: { item: TrainingCard; next: () => void }) {
  const { card } = item;
  const [flipped, setFlipped] = useState(false);
  return (
    <section className="flashcard-page">
      <TrainingLessonSource source={item} />

      <button
        type="button"
        className={`flashcard ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped((v) => !v)}
      >
        {!flipped ? (
          <>
            <span className="muted">{item.pageId ? "Fråga" : "Begrepp"}</span>
            <strong>{card[0]}</strong>
            {item.pageId && <pre><code>{card[2]}</code></pre>}
            <small>Klicka för att vända</small>
          </>
        ) : (
          <>
            <span className="muted">Förklaring</span>
            <strong>{card[1]}</strong>
            <pre><code>{card[2]}</code></pre>
          </>
        )}
      </button>

      <button type="button" className="primary-button" onClick={next}>
        Nästa kort
      </button>
    </section>
  );
}
