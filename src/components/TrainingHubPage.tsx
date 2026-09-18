import { Link } from "react-router-dom";
import { studyTopics } from "../data/studyTopics";
import { terminology } from "../data/terminology";

const groups = [
  {
    title: "Quiz – svara på frågor",
    description: "Välj svarsalternativ och få automatisk rättning. Du behöver inte skriva någon kod; vissa frågor visar kod att läsa.",
    items: [
      { to: "/quiz", title: "Starta quiz", text: "Välj ämnen och antal frågor. Se rätt svar och förklaringar efter rättning." }
    ]
  },
  {
    title: "Träna begrepp",
    description: "Välj ämne och öva på begrepp och förklaringar med automatisk rättning. Efteråt kan du repetera dem du missade.",
    items: studyTopics.map(topic => ({
      to: `/terminology/${topic.slug}`,
      title: topic.title,
      text: `${terminology[topic.slug].length} begrepp · ${terminology[topic.slug].slice(0, 3).map(item => item.term).join(", ")} och fler.`
    }))
  },
  {
    title: "Skriv kod",
    description: "Praktiska övningar där du själv skriver lösningen.",
    items: [
      { to: "/practice", title: "Kodövningar", text: "Automatisk rättning, delpoäng och lätt/normal/svår." },
      { to: "/code-library", title: "Kodbank per ämne", text: "Se alla koduppgifter för t.ex. React på samma sida och öppna sparade lösningar." },
      { to: "/completion", title: "Kodkomplettering", text: "Fyll i de delar som saknas." },
      { to: "/mini-projects", title: "Mini-projekt", text: "Kombinera flera tekniker i samma uppgift." },
      { to: "/chain", title: "Kedjeuppgifter", text: "Bygg vidare steg för steg." }
    ]
  },
  {
    title: "Felsök & förstå",
    description: "Träna på att läsa och förstå kod, inte bara skriva den.",
    items: [
      { to: "/debug", title: "Debug", text: "Fixa trasig kod." },
      { to: "/quick-errors", title: "Snabbfel", text: "Vad är fel i den här raden?" },
      { to: "/code-reading", title: "Kodläsning", text: "Förutse vad koden gör." },
      { to: "/explain-code", title: "Förklara koden", text: "Beskriv rad för rad med egna ord och jämför med facit." },
      { to: "/output-prediction", title: "Vad blir output?", text: "Förutse resultatet innan du visar svaret." },
      { to: "/ts-errors", title: "TypeScript-fel", text: "Tolka vanliga felmeddelanden." }
    ]
  },
  {
    title: "Repetition",
    description: "Kortare pass för att befästa begrepp.",
    items: [
      { to: "/flashcards", title: "Flashcards", text: "Snabb repetition av viktiga begrepp." },
      { to: "/matching", title: "Begrepp", text: "Koppla rätt begrepp till rätt betydelse." },
      { to: "/explain", title: "Förklara", text: "Träna på att förklara med egna ord." },
      { to: "/http", title: "HTTP", text: "GET, POST, statuskoder och request/response." },
      { to: "/api-simulator", title: "Server-simulator", text: "Se flödet mellan klient och server." },
      { to: "/concept-map", title: "Begreppskarta", text: "Se sambanden mellan React, Zod, Fetch, Hono och server." },
      { to: "/mistake-notebook", title: "Mina misstag", text: "Samla frågor du missat och skriv egna minnesregler." }
    ]
  }
];

export default function TrainingHubPage() {
  return (
    <section className="hub-page">
      <div className="hub-hero">
        <span className="topic-badge">Träna</span>
        <h2>Vad vill du öva på?</h2>
        <p>Välj ett träningssätt och sedan ämne. Övningsomgångarna avslutas när uppgifterna är slut. Starta en ny omgång när du vill repetera.</p>
      </div>

      {groups.map((group) => (
        <section className="hub-section" key={group.title}>
          <h3>{group.title}</h3>
          <p className="muted">{group.description}</p>

          <div className="hub-card-grid">
            {group.items.map((item) => (
              <Link className="hub-card" to={item.to} key={item.to}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
