const sections = [
  {
    topic: "State",
    items: [
      "Köra setCount direkt i onClick istället för att skicka en funktion.",
      "Ändra state direkt istället för att använda setter-funktionen.",
      "Glömma att state-uppdatering leder till ny render."
    ]
  },
  {
    topic: "Props",
    items: [
      "Tro att props och state är samma sak.",
      "Försöka ändra props direkt i barnkomponenten.",
      "Ge props fel TypeScript-typ."
    ]
  },
  {
    topic: "Fetch",
    items: [
      "Glömma await.",
      "Skriva response.json istället för response.json().",
      "Inte kontrollera response.ok."
    ]
  },
  {
    topic: "Router",
    items: [
      "Använda vanlig a-tagg när Link är bättre för intern navigation.",
      "Blanda ihop path och element.",
      "Glömma BrowserRouter runt routing."
    ]
  },
  {
    topic: "Zod",
    items: [
      "Tro att z.string() även validerar e-postformat.",
      "Glömma safeParse/parse innan datan används.",
      "Blanda ihop TypeScript-typning med runtime-validering."
    ]
  },
  {
    topic: "Hono/Server",
    items: [
      "Blanda ihop frontend-route och API-route.",
      "Glömma att returnera response från handlern.",
      "Blanda ihop request och response."
    ]
  }
];

export default function CommonMistakesPage() {
  return (
    <section>
      <h2>Vanliga fel per ämne</h2>
      <p>Använd sidan som snabb repetition innan du gör praktiska uppgifter.</p>

      <div className="grid">
        {sections.map((section) => (
          <article className="card" key={section.topic}>
            <h3>{section.topic}</h3>
            <ul>
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
