import type { StudyLesson } from "./studyLessons";

export const serverLessons: Record<string, StudyLesson> = {
  "hono-p1": {
    code: `import { Hono } from "hono";

const app = new Hono();
app.get("/api/hello", c => c.json({ message: "Hej!" }));

export default app;`,
    walkthrough: [
      "Lägg koden i serverprojektets appfil och importera Hono från biblioteket. new Hono() skapar appen som routes registreras på. Detta är serverkod och ska inte klistras in som en React-komponent. Exporten gör appen tillgänglig för servermiljöns startkod.",
      "app.get registrerar en handler för GET /api/hello. När en matchande request kommer körs funktionen med context c och skickar tillbaka ett JSON-objekt. Det förväntade svaret innehåller message med värdet Hej!. Att registrera routen är inte samma sak som att anropa den.",
      "Övningen kräver att du skapar app med new Hono(); routen visar vad appen används till. Hur processen startas beror på vald miljö, exempelvis en Node-adapter eller en worker. Exporten ensam börjar inte lyssna på en port. Använd startkommandot i det serverprojekt där du provar exemplet."
    ],
    questions: [
      ["Vad skapar new Hono() här?", "Appen som routes kan registreras på", "Ett HTTP-anrop till /api/hello", "En webbläsarknapp", "En färdig databas", "Hono-instansen håller appens routing och request-hantering; den skickar inte själv ett klientanrop."],
      ["När körs handlern för /api/hello?", "När servern tar emot en matchande GET-request", "Varje gång en React-komponent renderas", "Direkt när c.json nämns i filen", "Bara när en CSS-fil laddas", "app.get registrerar handlern, och servermiljön kör den när metod och sökväg matchar."]
    ],
    statements: ["Hono-koden hör till serversidan i detta exempel.", "En servermiljö behöver köra den exporterade appen.", "export default app öppnar alltid automatiskt en TCP-port.", "new Hono() skickar direkt en request till alla registrerade routes."],
    statementExplanation: "Appdefinition, serverstart och klientrequest är olika steg. Hono definierar hur servern ska svara när den väl körs och tar emot requests."
  },
  "hono-p2": {
    code: `import { Hono } from "hono";

const app = new Hono();
app.get("/api/hello", c => {
  return c.json({ message: "Hej!" });
});

export default app;`,
    walkthrough: [
      "Skapa appen och registrera GET-routen med app.get. Första argumentet är sökvägen /api/hello och andra argumentet är handlern. GET används här för att läsa ett meddelande, så requesten behöver ingen JSON-body.",
      "c är context för just den inkommande requesten. c.json skapar ett JSON-response med lämplig innehållstyp och normalt status 200 när du inte anger något annat. return skickar detta Response vidare från handlern; att bara skapa ett response utan att returnera det ger inte rätt handler-resultat.",
      "När servern körs kan en klient anropa samma adress och läsa message från svaret. Övningen kräver exakt GET /api/hello och message: 'Hej!'. Kontrollera stavningen på både route och property om klienten inte hittar datan. Starta servern enligt dess runtime; koden definierar routen men startar inte själv en port."
    ],
    questions: [
      ["Vilket innehåll returnerar routen?", "JSON med message: 'Hej!'", "En användarlista", "Bara talet 200 som body", "En React-komponent", "Handlern returnerar c.json med objektet { message: 'Hej!' }."],
      ["Varför står return framför c.json i block-handlern?", "För att lämna Response som handlerns resultat", "För att byta GET till POST", "För att läsa klientens JSON-body", "För att skapa en ny Hono-instans", "c.json skapar svaret och return lämnar det vidare från funktionen."]
    ],
    statements: ["app.get registrerar en route för GET.", "c.json skapar ett JSON-response.", "c.json läser request body från klienten.", "GET /api/hello och POST /api/hello är alltid samma route."],
    statementExplanation: "Metod och path identifierar routen. Requestens body läses via request-API:t, medan c.json skapar det utgående svaret."
  },
  "hono-p3": {
    code: `import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();
const userSchema = z.object({ name: z.string().trim().min(2) });

app.post("/api/users", async c => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Body måste vara giltig JSON" }, 400);
  }
  const result = userSchema.safeParse(body);
  if (!result.success) return c.json({ error: "Namnet måste ha minst två tecken" }, 400);
  return c.json({ received: result.data }, 200);
});

export default app;`,
    walkthrough: [
      "POST-routen matchar /api/users och handlern är async eftersom request body läses asynkront. await c.req.json() tolkar inkommande JSON. Ogiltig JSON fångas i try/catch och ger status 400 i stället för att fortsätta som om body vore ett giltigt objekt.",
      "Giltig JSON kan ändå ha fel form, till exempel name: 42. Därför behandlas body som unknown och skickas till Zod-schemat. Bara ett namn som uppfyller reglerna når framgångsgrenen. Skillnaden mellan JSON-parsning och innehållsvalidering är viktig när data kommer utifrån.",
      "Exemplet bekräftar mottagen data med received och status 200; det sparar inte någon användare. En skapande route behöver dessutom skapa eller spara resursen och kan då använda 201. Övningen tränar POST-routen, body-läsningen och de två felkontrollerna innan mottagandet bekräftas."
    ],
    questions: [
      ["Vilket anrop läser klientens JSON-body?", "await c.req.json()", "c.json(body)", "new Hono()", "app.get('/api/users')", "c.req beskriver den inkommande requesten. c.json skapar i stället ett utgående response."],
      ["Varför valideras body efter att JSON har lästs?", "Giltig JSON kan fortfarande ha fel fält eller typer", "JSON-parsning sparar alltid datan i en databas", "POST kräver att all data är en array", "Zod måste skapa routen först", "JSON-format och applikationens datakrav är olika saker; exempelvis är name: 42 giltig JSON men fel här."]
    ],
    statements: ["Handlern behöver invänta den asynkrona body-läsningen.", "Ogiltig JSON kan ge ett separat fel före schemavalidering.", "Ett lyckat c.req.json() bevisar att name är en giltig sträng.", "Detta exempel lagrar automatiskt användaren permanent."],
    statementExplanation: "Body behöver både parsas och kontrolleras. Här bekräftas bara mottagandet; permanent lagring kräver ytterligare serverkod."
  },
  "hono-p4": {
    code: `import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();
const schema = z.object({ name: z.string().trim().min(2) });
const users: { id: number; name: string }[] = [];
let nextId = 1;

app.post("/api/users", async c => {
  const body: unknown = await c.req.json().catch(() => null);
  const result = schema.safeParse(body);
  if (!result.success) return c.json({ error: "Ogiltig användare" }, 400);
  const user = { id: nextId++, name: result.data.name };
  users.push(user);
  return c.json(user, 201);
});

app.get("/api/users/:id", c => {
  const user = users.find(item => item.id === Number(c.req.param("id")));
  if (!user) return c.json({ error: "Användaren saknas" }, 404);
  return c.json(user, 200);
});

export default app;`,
    walkthrough: [
      "Statusen sätts som andra argumentet till c.json. En giltig POST skapar här ett objekt med nytt id, lägger det i users och returnerar objektet med 201. Ogiltig input ger i stället 400. Samma route kan alltså ge olika status beroende på vad som faktiskt hände.",
      "GET-routen söker efter ett id i listan. En hittad användare ger 200 med data, medan en saknad användare ger 404 med ett felobjekt. Ett meddelande som säger 'saknas' men skickas med 200 skulle ge klienten motstridiga signaler; både status och body bör beskriva resultatet korrekt.",
      "Listan i exemplet är bara minne i serverprocessen, inte beständig lagring. Den töms när processen startar om och delas inte automatiskt mellan flera processer. Övningen kräver ett JSON-svar med 201 från en create-route; den extra GET-routen visar varför 200, 201 och 404 fyller olika roller."
    ],
    questions: [
      ["Vilken status returneras när POST skapat en användare?", "201", "200 i alla grenar", "404", "500", "201 beskriver att en resurs skapats. Koden anger den uttryckligen i c.json(user, 201)."],
      ["Vad returnerar GET om användaren inte finns i users?", "404 och ett felobjekt", "201 och en ny användare", "200 och automatiskt sparad data", "Ingen response alls", "Handlerns felgren returnerar c.json med status 404 för den saknade resursen."]
    ],
    statements: ["c.json kan få en statuskod som andra argument.", "En processlokal array försvinner vid serveromstart.", "Alla JSON-responses måste ha status 200.", "404 betyder att en resurs skapades korrekt."],
    statementExplanation: "JSON är innehållsformat och status beskriver utfallet. Exemplet använder 201 för skapad resurs och 404 för saknad; minneslagring är inte permanent."
  },
  "hono-p5": {
    code: `// api.ts — körs på servern
import { Hono } from "hono";
const app = new Hono();
app.get("/api/products", c => c.json([{ id: 1, title: "Bok" }]));
export default app;

// client.ts — separat fil, körs i webbläsaren
async function getProducts() {
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error("Kunde inte hämta produkter");
  const products = await response.json();
  console.log(products);
}
getProducts().catch(error => console.error(error.message));`,
    walkthrough: [
      "Dela exemplet i serverfilen api.ts och webbläsarfilen client.ts. Hono registrerar GET /api/products och skickar en array med id och title. Webbläsaren anropar exakt samma path med fetch, vars standardmetod är GET. Båda sidorna behöver alltså vara överens om metod, adress och format.",
      "Serverns c.json skapar response body, och klientens response.json() läser den. Det är motsatta sidor av samma HTTP-utbyte. I detta exempel skrivs resultatet i webbläsarens konsol. För att visa det i React kan du använda state eller en query och rendera produktlistan.",
      "Den relativa URL:en förutsätter samma origin eller att utvecklingsservern vidarebefordrar /api till backend. Körs backend på en annan adress krävs rätt URL och serverkonfiguration för anrop mellan origins. Övningen tränar den matchande klient/server-koden; den startar inte servern eller konfigurerar en proxy automatiskt."
    ],
    questions: [
      ["Vilken serverroute matchar exemplets fetch?", "GET /api/products", "POST /api/products", "GET /products/api", "GET /api/users", "fetch utan method använder GET och adressen är /api/products."],
      ["Vilken kombination skapar respektive läser JSON-svaret?", "Server: c.json, klient: response.json()", "Server: response.json, klient: new Hono", "Server: useState, klient: c.req.json", "Båda använder endast JSON.stringify", "c.json skapar serverns Response och response.json() tolkar body på klienten."]
    ],
    statements: ["Klient och server behöver vara överens om produktlistans dataformat.", "De två koddelarna hör till olika körmiljöer.", "En relativ /api-URL hittar automatiskt varje backend oavsett port.", "Klientens queryKey måste vara identisk med Hono-appens variabelnamn."],
    statementExplanation: "HTTP-kontraktet gäller metod, adress och data. Körmiljö och nätverksadress måste vara rätt konfigurerade; interna variabelnamn kopplar inte ihop klient och server."
  },
  "server-p1": {
    code: `// api.ts — server
import { Hono } from "hono";
const app = new Hono();
app.get("/api/users", c => c.json([{ id: 1, name: "Sofia" }]));
export default app;

// client.ts — separat fil i webbläsaren
async function loadUsers() {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error("Hämtningen misslyckades");
  const users = await response.json();
  console.log(users);
}
loadUsers().catch(error => console.error(error.message));`,
    walkthrough: [
      "Serverdelen definierar vilken data en GET-request ska få, medan klientdelen ber om datan. De ligger i separata filer och körs i olika miljöer. Klienten anropar en URL; den importerar inte Hono-handlern och kan inte komma åt serverns lokala variabler direkt.",
      "När loadUsers anropas skickas requesten. Servern matchar routen och skapar svaret, därefter läser webbläsaren body och loggar användarlistan. I en React-app skulle en knapp kunna anropa motsvarande handler och resultatet sparas med en setter för att synas i JSX.",
      "Förklaringsuppgiften följer just detta konsolanrop: beskriv klientens funktionsanrop, request, serverns arbete, response och loggningen. En fungerande server och en adress som klienten når förutsätts. Sista serversidan visar nästa steg med knapp, state och UI-uppdatering; här behöver du inte hitta på en knapp som saknas i exemplet."
    ],
    questions: [
      ["Vilken del körs i webbläsaren här?", "loadUsers med fetch", "Hono-routens handler", "Serverprocessens startkod", "Alla filer körs alltid i samma miljö", "Klientdelen skickar requesten via fetch, medan Hono-delen hanterar den på servern."],
      ["Hur når klienten datan i serverexemplet?", "Via en HTTP-request till /api/users", "Genom att läsa c direkt i webbläsaren", "Genom att importera serverns processminne", "Genom att döpa knappen till app", "Gränsen mellan miljöerna korsas genom request och response, inte gemensamma variabler."]
    ],
    statements: ["Servern skapar ett svar på klientens request.", "Klienten kan använda svaret för att uppdatera sitt UI.", "React-state delas automatiskt med Hono-processens variabler.", "Klienten måste importera serverns handler för att göra fetch."],
    statementExplanation: "Klient och server samarbetar över HTTP men har separata körmiljöer. Data behöver skickas mellan dem och användas på respektive sida."
  },
  "server-p2": {
    code: `async function createUser() {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Sofia" })
  });
  if (!response.ok) throw new Error("HTTP-fel: " + response.status);
  return response.json();
}

// Requestens delar:
// Metod: POST
// Sökväg: /api/users
// Header: Content-Type: application/json
// Body: {"name":"Sofia"}`, 
    walkthrough: [
      "En request beskriver vad klienten ber servern göra. I exemplet säger POST att data skickas till användarsamlingen på /api/users. Samma sökväg kan användas för GET när listan ska läsas; metoden är därför en del av hur servern väljer handler.",
      "Headers beskriver metadata, här formatet för body. JSON.stringify ger JSON-texten med namnet Sofia. Body är innehållet, inte statuskoden för resultatet. GET-anrop används vanligtvis utan body medan en skapande POST ofta behöver data i body.",
      "Övningen är en beskrivningsuppgift: ange metod, URL, header och body för att skapa en användare och förklara vad varje del betyder. Funktionen visar motsvarande körbara fetch-kod och måste anropas för att skicka något. Svarets format förutsätts vara JSON; det bestäms av API-kontraktet, inte av requestens Content-Type ensam."
    ],
    questions: [
      ["Vilken del talar om formatet på request body?", "Content-Type-headern", "Variabelnamnet response", "Statuskoden 201", "Funktionsnamnet createUser", "Content-Type: application/json beskriver den skickade body-textens format."],
      ["Vad är request body i exemplet?", "JSON-text med name: Sofia", "Strängen POST ensam", "HTTP-statusen från servern", "En funktionsreferens till fetch", "JSON.stringify omvandlar objektet med name till det innehåll som skickas i body."]
    ],
    statements: ["Metod och sökväg hjälper servern matcha rätt route.", "En request kan innehålla headers och body.", "Requestens Content-Type garanterar att svaret också är JSON.", "Status 201 anges av klienten som HTTP-metod när den vill skapa något."],
    statementExplanation: "Klienten anger metod, destination och innehåll. Servern bestämmer response-status och format; requestens innehållstyp beskriver bara vad klienten skickar."
  },
  "server-p3": {
    code: `// Så kan servern skapa tre olika HTTP-responses med webbplattformens Response.
const found = new Response(JSON.stringify({ id: 1, name: "Sofia" }), {
  status: 200,
  headers: { "Content-Type": "application/json" }
});
const created = new Response(JSON.stringify({ id: 2, name: "Anna" }), {
  status: 201,
  headers: { "Content-Type": "application/json" }
});
const missing = new Response(JSON.stringify({ error: "Användaren saknas" }), {
  status: 404,
  headers: { "Content-Type": "application/json" }
});
console.log(found.ok, created.ok, missing.ok); // true, true, false`,
    walkthrough: [
      "Ett response har status, headers och body. Exemplet bygger tre Response-objekt för att visa delarna utan en särskild serverroute. Body är JSON-text, Content-Type beskriver formatet och status beskriver resultatet. I Hono gör c.json motsvarande arbete bekvämare.",
      "200 används här för en lyckad hämtning, 201 för en skapad resurs och 404 när resursen saknas. found.ok och created.ok är true eftersom deras status är i 200-serien. missing.ok är false. Ett felmeddelande i JSON betyder inte att svaret måste använda framgångsstatus.",
      "Övningen ber dig välja just dessa tre statuskoder och koppla dem till rätt fall. En oväntad intern serverbugg kan i stället ge 500, medan felaktig klientdata kan ge 400. Att skapa Response-objekt i denna demonstration skickar inget över nätverket; en serverhandler måste returnera ett av dem."
    ],
    questions: [
      ["Vilken status passar en saknad användare?", "404", "201", "200", "500 bara för att id saknas", "404 beskriver att den begärda resursen inte hittades. 500 gäller ett internt serverfel."],
      ["Vilka ok-värden loggas i ordningen found, created, missing?", "true, true, false", "true, false, false", "false, true, true", "true, true, true", "Response.ok är true för 200–299 och false för 404."]
    ],
    statements: ["201 kan användas när en resurs har skapats.", "JSON kan bära felinformation tillsammans med en felstatus.", "Alla responses med JSON-body har ok: true.", "404 och 500 beskriver alltid samma typ av problem."],
    statementExplanation: "Body-format och status är olika delar. 404 beskriver saknad resurs, medan 500 anger ett oväntat internt serverfel."
  },
  "server-p4": {
    code: `// api.ts — server
import { Hono } from "hono";
const app = new Hono();
app.get("/api/users", c => c.json([{ id: 1, name: "Sofia" }]));
export default app;

// App.tsx — separat fil i React-klienten
import { useState } from "react";
type User = { id: number; name: string };

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Kunde inte hämta användare");
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Okänt fel");
    } finally { setLoading(false); }
  }
  return (
    <>
      <button type="button" disabled={loading} onClick={loadUsers}>Ladda användare</button>
      {loading && <p>Laddar...</p>}
      {error && <p role="alert">{error}</p>}
      <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>
    </>
  );
}`,
    walkthrough: [
      "Lägg serverdelen och React-delen i separata filer och miljöer enligt kommentarerna. Servern behöver köras och /api behöver nå den från klientens origin, direkt eller via en konfigurerad proxy. Exemplet antar att svaret följer User-formatet; en TypeScript-annotering utför inte runtime-validering.",
      "Följ ett klick: onClick kör loadUsers, loading blir true, fetch skickar GET /api/users, Hono matchar app.get och returnerar JSON. Klienten kontrollerar ok, läser body och anropar setUsers. Nästa rendering mappar listan till li-element och visar Sofia på sidan.",
      "Vid HTTP- eller nätverksfel körs catch och ett felmeddelande visas. finally avslutar laddningen i båda fallen. Förklaringsuppgiften ska nämna varje led i kedjan och skilja response från state: servern skickar data, men det är klientens setter som gör att React visar den."
    ],
    questions: [
      ["Vilket steg kommer efter att klienten läst JSON och före den nya listvyn?", "setUsers(data)", "Att servern importerar React-state", "Att c.req.json läser svaret i webbläsaren", "Att en ny Route skapas automatiskt", "setUsers sparar datan i state som nästa rendering använder för listan."],
      ["Vilken händelse startar hela flödet i detta exempel?", "Ett klick på Ladda användare", "Varje gång JSX map körs", "Att User-typen deklareras", "Att serverns array innehåller Sofia", "Knappens onClick anropar loadUsers. En typ eller en datadefinition startar inte klientens request."]
    ],
    statements: ["Serverns route returnerar ett response som klienten måste läsa.", "React uppdaterar listvyn när users-state ändras.", "Serverns c.json uppdaterar klientens state direkt utan klientkod.", "Ett API-svar blir automatiskt synligt i JSX utan en state- eller datakoppling."],
    statementExplanation: "Servern levererar HTTP-data. Klienten ansvarar för att läsa den, spara eller använda den och rendera resultatet."
  }
};
