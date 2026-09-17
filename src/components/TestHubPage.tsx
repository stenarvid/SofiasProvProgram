import { Link } from "react-router-dom";

const tests = [
  {
    to: "/daily",
    title: "Dagens träning",
    tag: "Bra start",
    text: "Ett kort blandat pass med flera typer av övningar."
  },
  {
    to: "/quiz",
    title: "Quiz",
    tag: "Teori",
    text: "Välj ämnen och antal frågor. Svaga områden prioriteras automatiskt."
  },
  {
    to: "/exam",
    title: "Provläge",
    tag: "Praktiskt",
    text: "Slumpade praktiska uppgifter med timer."
  },
  {
    to: "/oral-exam",
    title: "Muntligt prov",
    tag: "Förståelse",
    text: "Svara högt med egna ord innan du visar stöd och facit."
  },
  {
    to: "/exam-checklist",
    title: "Provchecklista",
    tag: "Självkoll",
    text: "Markera vad du faktiskt kan förklara utan hjälp."
  },
  {
    to: "/final-exam",
    title: "Slutprov",
    tag: "Helhet",
    text: "Större simulerat prov med teori, kod, debug och förklaringar."
  }
];

export default function TestHubPage() {
  return (
    <section className="hub-page">
      <div className="hub-hero">
        <span className="topic-badge">Testa dig</span>
        <h2>Välj hur du vill testa dig</h2>
        <p>Från ett snabbt pass till ett komplett simulerat slutprov.</p>
      </div>

      <div className="test-card-grid">
        {tests.map((test) => (
          <Link className="test-card" to={test.to} key={test.to}>
            <span className="study-tool-label">{test.tag}</span>
            <h3>{test.title}</h3>
            <p>{test.text}</p>
            <strong>Starta →</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
