import { useState } from "react";

type Project = {
  title: string;
  topics: string[];
  goal: string;
  easy: string[];
  normal: string[];
  hard: string[];
};

const projects: Project[] = [
  {
    title: "User-lista från API",
    topics: ["React", "Fetch", "State", "Props"],
    goal: "Hämta användare och visa dem som komponenter.",
    easy: [
      "Skapa state users med useState([]).",
      "Skapa en async-funktion loadUsers.",
      "Använd fetch('/api/users').",
      "Kör response.json().",
      "Spara datan med setUsers(data).",
      "Skapa UserCard och skicka name som prop."
    ],
    normal: [
      "Hämta /api/users med fetch.",
      "Spara resultatet i state.",
      "Rendera användarna med en UserCard-komponent."
    ],
    hard: ["Bygg en React-sida som hämtar och visar användare från /api/users."]
  },
  {
    title: "Formulär med Zod",
    topics: ["Forms", "Zod", "Databindning"],
    goal: "Bygg ett formulär med name och email och validera innan submit.",
    easy: [
      "Skapa state för name och email.",
      "Bind value och onChange.",
      "Skapa z.object med name och email.",
      "Använd safeParse när formuläret skickas.",
      "Visa ett felmeddelande om valideringen misslyckas."
    ],
    normal: [
      "Gör ett controlled form.",
      "Validera name och email med Zod.",
      "Visa validation errors."
    ],
    hard: ["Bygg ett validerat React-formulär med Zod."]
  },
  {
    title: "Global counter",
    topics: ["Jotai", "State", "Comp"],
    goal: "Två komponenter ska läsa och ändra samma count.",
    easy: [
      "Skapa countAtom = atom(0).",
      "Skapa två komponenter.",
      "Använd useAtom(countAtom) i båda.",
      "Lägg knappar som uppdaterar samma atom."
    ],
    normal: [
      "Skapa en Jotai-atom.",
      "Använd den från två komponenter.",
      "Båda ska visa samma värde."
    ],
    hard: ["Bygg två komponenter som delar samma counter-state med Jotai."]
  }
];

export default function MiniProjectsPage() {
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("normal");

  return (
    <section>
      <h2>Mini-projekt</h2>
      <p>Här kombinerar du flera provområden i samma uppgift.</p>

      <label className="quiz-select-label">
        Svårighetsgrad
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
          <option value="easy">Lätt – steg för steg</option>
          <option value="normal">Normal</option>
          <option value="hard">Svår – bara målet</option>
        </select>
      </label>

      <div className="grid">
        {projects.map((project) => (
          <article className="card" key={project.title}>
            <h3>{project.title}</h3>
            <p><strong>Mål:</strong> {project.goal}</p>
            <p className="muted">{project.topics.join(" • ")}</p>

            <ol>
              {project[difficulty].map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
}
