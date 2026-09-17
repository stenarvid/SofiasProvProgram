import TrainingSession from "./TrainingSession";

const endpoints = {
  "/api/users": {
    status: 200,
    body: [
      { id: 1, name: "Anna" },
      { id: 2, name: "Erik" }
    ]
  },
  "/api/products": {
    status: 200,
    body: [
      { id: 1, name: "Keyboard", price: 599 },
      { id: 2, name: "Mouse", price: 299 }
    ]
  },
  "/api/error": {
    status: 500,
    body: { error: "Internal Server Error" }
  }
};

const cases = Object.entries(endpoints).map(([path, response]) => ({ path, response }));

export default function ApiSimulatorPage() {
  return <TrainingSession items={cases} topics={() => ["Fetch", "Server / HTTP"]}>
    {(item, _index, next) => <ApiCase item={item} next={next} />}
  </TrainingSession>;
}

function ApiCase({ item: { path, response }, next }: { item: (typeof cases)[number]; next: () => void }) {

  return (
    <section>
      <h2>API / Server-simulator</h2>
      <p>
        Träna på att förstå request → server → response utan att behöva en riktig backend.
      </p>

      <div className="api-simulator">
        <div className="api-request">
          <span className="method-badge">GET</span>
          <code>{path}</code>
        </div>

        <div className="server-arrow">↓ request till server</div>

        <div className="server-box">
          <strong>SERVER</strong>
          <p>Matchar route och skapar ett response.</p>
        </div>

        <div className="server-arrow">↓ response till klient</div>

        <div className="api-response">
          <h3>HTTP {response.status}</h3>
          <pre><code>{JSON.stringify(response.body, null, 2)}</code></pre>
        </div>
      </div>
      <p>Följ anropet och läs statuskoden och svarets innehåll. Exemplen är simulerade.</p>
      <button type="button" className="primary-button auto-width" onClick={next}>Nästa anrop</button>
    </section>
  );
}
