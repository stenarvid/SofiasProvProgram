import { useState } from "react";

const chains = [
  {
    title: "Form → Zod → Fetch → Hono",
    steps: [
      "Skapa state för name och email.",
      "Bind inputfälten med value och onChange.",
      "Skapa ett Zod-schema och validera formuläret med safeParse.",
      "Om datan är giltig: skicka den med fetch till POST /api/users.",
      "Skapa POST /api/users i Hono.",
      "Returnera c.json({ success: true }) från servern.",
      "Visa ett meddelande i React när responsen lyckas."
    ]
  },
  {
    title: "Fetch → State → Props → Components",
    steps: [
      "Skapa state users.",
      "Hämta /api/users med fetch.",
      "Spara JSON-datan i users.",
      "Skapa UserCard med props name och id.",
      "Använd users.map för att rendera UserCard för varje user.",
      "Lägg till loading-state medan datan hämtas."
    ]
  },
  {
    title: "React Query → Components → Error state",
    steps: [
      "Skapa useQuery med queryKey ['users'].",
      "Hämta /api/users i queryFn.",
      "Visa 'Laddar...' när isLoading är true.",
      "Visa feltext om error finns.",
      "Skicka varje user till en UserCard-komponent.",
      "Rendera listan när data finns."
    ]
  }
];

export default function ChainTasksPage() {
  const [chainIndex, setChainIndex] = useState(0);
  const [done, setDone] = useState<boolean[]>([]);
  const chain = chains[chainIndex];

  function choose(index: number) {
    setChainIndex(index);
    setDone([]);
  }

  return (
    <section>
      <h2>Kedjeuppgifter</h2>
      <p>Här bygger varje steg vidare på det föregående, ungefär som i en större praktisk uppgift.</p>

      <div className="chain-tabs">
        {chains.map((item, i) => (
          <button
            type="button"
            key={item.title}
            className={i === chainIndex ? "tab active" : "tab"}
            onClick={() => choose(i)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="panel">
        <h3>{chain.title}</h3>
        <ol className="chain-list">
          {chain.steps.map((step, i) => (
            <li key={step} className={done[i] ? "chain-done" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={!!done[i]}
                  onChange={() =>
                    setDone((current) => {
                      const next = [...current];
                      next[i] = !next[i];
                      return next;
                    })
                  }
                />
                {step}
              </label>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
