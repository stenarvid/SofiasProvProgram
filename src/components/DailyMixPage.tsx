import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const activities = [
  { type: "Teori", text: "Gör 5 slumpade quizfrågor.", link: "/quiz" },
  { type: "Kod", text: "Gör 2 kodövningar på Normal eller Svår.", link: "/practice" },
  { type: "Debug", text: "Fixa en trasig kodsnutt.", link: "/debug" },
  { type: "Muntligt", text: "Förklara ett begrepp med egna ord.", link: "/explain" },
  { type: "Läs kod", text: "Gör en kodläsningsuppgift.", link: "/code-reading" },
  { type: "HTTP", text: "Gör två HTTP-frågor.", link: "/http" },
  { type: "Minne", text: "Repetera fem flashcards.", link: "/flashcards" }
];

function seededDayNumber() {
  const now = new Date();
  return Number(`${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`);
}

export default function DailyMixPage() {
  const [seed, setSeed] = useState(seededDayNumber());

  const plan = useMemo(() => {
    return [...activities]
      .sort((a, b) => {
        const va = Math.sin(seed + a.text.length) * 10000;
        const vb = Math.sin(seed + b.text.length) * 10000;
        return va - vb;
      })
      .slice(0, 5);
  }, [seed]);

  return (
    <section>
      <h2>Dagens blandade träning</h2>
      <p>Fem korta moment som blandar olika sätt att träna.</p>

      <div className="daily-list">
        {plan.map((item, i) => (
          <article className="daily-card" key={item.text}>
            <span>{i + 1}</span>
            <div>
              <strong>{item.type}</strong>
              <p>{item.text}</p>
            </div>
            <Link to={item.link}>Starta</Link>
          </article>
        ))}
      </div>

      <button type="button" className="secondary-button" onClick={() => setSeed(Math.random() * 100000)}>
        Slumpa annan träning
      </button>
    </section>
  );
}
