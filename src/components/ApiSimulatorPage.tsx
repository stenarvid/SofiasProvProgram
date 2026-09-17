import { useState } from "react";

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

export default function ApiSimulatorPage() {
  const [path, setPath] = useState("/api/users");
  const response = endpoints[path as keyof typeof endpoints];

  return (
    <section>
      <h2>API / Server-simulator</h2>
      <p>
        Träna på att förstå request → server → response utan att behöva en riktig backend.
      </p>

      <div className="api-simulator">
        <div className="api-request">
          <span className="method-badge">GET</span>
          <select value={path} onChange={(e) => setPath(e.target.value)}>
            {Object.keys(endpoints).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
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
    </section>
  );
}
