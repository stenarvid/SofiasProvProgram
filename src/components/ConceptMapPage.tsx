const flows = [
  {
    title: "React-grunden",
    nodes: [
      ["Component", "En funktionell UI-byggsten"],
      ["Props", "Data in från parent"],
      ["State", "Föränderlig data i UI"],
      ["Render", "UI beskrivs utifrån aktuell data"]
    ]
  },
  {
    title: "Formulär → server",
    nodes: [
      ["Form / State", "Samla användarens data"],
      ["Zod", "Validera runtime-data"],
      ["fetch", "Skicka HTTP-request"],
      ["Hono", "Matcha route och kör serverlogik"],
      ["Response", "Status + data tillbaka"],
      ["React", "Spara data och rendera UI"]
    ]
  },
  {
    title: "Server state",
    nodes: [
      ["React Query", "Orkestrerar server-state"],
      ["queryKey", "Identifierar cachepost"],
      ["queryFn", "Hämtar datan"],
      ["Cache", "Återanvänd och refetcha data"]
    ]
  }
];

export default function ConceptMapPage() {
  return (
    <section className="learning-page">
      <div className="hub-hero">
        <span className="topic-badge">Begreppskarta</span>
        <h2>Se hur allt hänger ihop</h2>
        <p>Fokusera på flödet mellan teknikerna i stället för att memorera dem som separata ord.</p>
      </div>

      <div className="concept-flows">
        {flows.map((flow) => (
          <article className="concept-flow" key={flow.title}>
            <h3>{flow.title}</h3>
            <div>
              {flow.nodes.map(([name, description], index) => (
                <span className="concept-node-wrap" key={name}>
                  <span className="concept-node"><strong>{name}</strong><small>{description}</small></span>
                  {index < flow.nodes.length - 1 && <b>→</b>}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
