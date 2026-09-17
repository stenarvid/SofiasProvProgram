import { useMemo, useState } from "react";

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

function shuffle<T>(items: readonly T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function FlashcardsPage() {
  const [deck, setDeck] = useState(() => shuffle(cards));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = deck[index];

  function next() {
    if (index + 1 >= deck.length) {
      setDeck(shuffle(cards));
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
    setFlipped(false);
  }

  return (
    <section className="flashcard-page">
      <div className="quiz-topbar">
        <span>Kort {index + 1} / {deck.length}</span>
        <button type="button" onClick={() => {
          setDeck(shuffle(cards));
          setIndex(0);
          setFlipped(false);
        }}>Blanda</button>
      </div>

      <button
        type="button"
        className={`flashcard ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped((v) => !v)}
      >
        {!flipped ? (
          <>
            <span className="muted">Begrepp</span>
            <strong>{card[0]}</strong>
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
