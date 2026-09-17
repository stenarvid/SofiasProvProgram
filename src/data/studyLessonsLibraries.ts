import type { StudyLesson } from "./studyLessons";

const querySetup = `import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();`;
const getUsers = `type User = { id: number; name: string };
async function getUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error("Kunde inte hämta användare");
  return response.json();
}`;
const queryApp = `export default function App() {
  return <QueryClientProvider client={queryClient}><Users /></QueryClientProvider>;
}`;

export const libraryLessons: Record<string, StudyLesson> = {
  "query-p1": {
    code: `${querySetup}

${getUsers}

function Users() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });
  if (isPending) return <p>Laddar...</p>;
  if (isError) return <p>Kunde inte hämta användare.</p>;
  return <ul>{data.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}

${queryApp}`,
    walkthrough: [
      "Exemplet använder TanStack React Query v5. Skapa en QueryClient utanför komponenten och ge den till QueryClientProvider runt den del av appen som använder queries. Om projektet redan har en sådan provider använder du den befintliga. En ny klient vid varje rendering skulle göra cachen instabil.",
      "getUsers gör själva HTTP-anropet till ett befintligt JSON-API. useQuery får funktionen som queryFn och identifierar listan med queryKey ['users']. Biblioteket hanterar hämtningens tillstånd och cache runt din funktion; det ersätter inte servern eller behovet av ett korrekt fetch-anrop.",
      "Users visar först laddning, sedan fel eller listan. Det är samma UI-behov som med manuell fetch och state, men statusen kommer från query-resultatet. I övningen skriver du en useQuery för users. Kontrollera både key, funktion och provider när du sätter in den i en riktig app."
    ],
    questions: [
      ["Vilken del utför HTTP-anropet i exemplet?", "getUsers som anropas av queryn", "queryKey-strängen users", "QueryClientProvider skapar automatiskt ett API", "li-elementets key", "queryFn pekar på getUsers, där fetch faktiskt anropas. Cache-nyckeln skickar ingen request på egen hand."],
      ["Varför skapas QueryClient utanför App här?", "För att samma klient och cache ska återanvändas mellan renderingar", "För att useQuery måste köras utanför React", "För att API:et då lagras i CSS", "För att undvika alla framtida nätverksanrop", "En stabil QueryClient behåller appens query-cache. Den garanterar inte att data aldrig hämtas igen."]
    ],
    statements: ["QueryClientProvider ger komponenterna tillgång till query-klienten.", "queryFn ansvarar för att leverera data eller rapportera ett fel.", "queryKey skapar serverns endpoint automatiskt.", "React Query tar bort behovet av att visa laddning och fel."],
    statementExplanation: "Query hanterar serverdatans livscykel. Appen behöver fortfarande en hämtningsfunktion, en server och presentation av tillstånden."
  },
  "query-p2": {
    code: `${querySetup}

type Product = { id: number; title: string };
async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");
  if (!response.ok) throw new Error("Kunde inte hämta produkter");
  return response.json();
}

function Products() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  });
  if (isPending) return <p>Laddar...</p>;
  if (isError) return <p>Kunde inte hämta produkter.</p>;
  return <ul>{data.map(product => <li key={product.id}>{product.title}</li>)}</ul>;
}

export default function App() {
  return <QueryClientProvider client={queryClient}><Products /></QueryClientProvider>;
}`,
    walkthrough: [
      "Här hämtas hela produktlistan, så nyckeln är exakt ['products'] som i uppgiften. getProducts är definierad ovanför komponenten och skickas utan parenteser till queryFn. React Query bestämmer när funktionen ska köras; ett direkt anrop skulle ge en Promise där en funktion förväntas.",
      "Nyckeln beskriver vilken data cacheposten gäller, inte hur JSX-element identifieras. Om du senare hämtar en viss produkt behöver id ingå, exempelvis ['product', productId], och hämtningsfunktionen måste använda samma id. Annars kan olika produktförfrågningar få samma identitet i cachen.",
      "Resultatet är en lista med produkttitlar när API:et svarar. queryKey och queryFn måste beskriva samma datamängd. Provider och HTTP-felkontroll finns med så att du ser var den korta useQuery-övningen hör hemma. Typerna dokumenterar här API-formatet men validerar inte svaret vid runtime."
    ],
    questions: [
      ["Vilken nyckel används för hela produktlistan i exemplet?", "['products']", "['users']", "product.id från li-elementet", "'/api/products' som ensam sträng utan array", "queryKey är en array som identifierar listans cachepost. JSX-key har ett annat ansvar."],
      ["Du ändrar queryn till att hämta en produkt beroende på productId. Vad bör nyckeln innehålla?", "Både produktbegreppet och productId", "Bara samma nyckel för alla olika produkter", "Bara komponentens CSS-klass", "Inga värden eftersom queryFn har parametern", "En variabel som ändrar vilken data queryFn hämtar behöver finnas i cache-identiteten."]
    ],
    statements: ["queryFn får här referensen till getProducts.", "Olika produkt-id:n behöver kunna få olika query-nycklar.", "queryKey och li-elementets key har samma funktion.", "queryFn: getProducts() är samma sak som att skicka funktionen."],
    statementExplanation: "Query-nyckeln identifierar serverdata; JSX-key identifierar listelement. Skicka en hämtningsfunktion till queryFn, inte resultatet från ett direkt anrop."
  },
  "query-p3": {
    code: `${querySetup}

${getUsers}

function Users() {
  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });
  if (isPending) return <p>Laddar...</p>;
  if (isError) return <p role="alert">Fel: {error.message}</p>;
  return (
    <>
      {isFetching && <p>Uppdaterar listan...</p>}
      <ul>{data.map(user => <li key={user.id}>{user.name}</li>)}</ul>
    </>
  );
}

${queryApp}`,
    walkthrough: [
      "Plocka ut både status och data från samma useQuery-resultat. I v5 innebär isPending att queryn har pending-status, alltså ännu inget lyckat resultat. Kontrollera sedan isError innan du använder data. På success-grenen kan TypeScript förstå att listan finns och map kan anropas.",
      "isFetching beskriver om query-funktionen arbetar, även när tidigare data redan finns. Därför visas Uppdaterar listan... separat och den gamla listan kan ligga kvar vid en bakgrundshämtning. isLoading är mer specifikt: isPending och isFetching samtidigt. En avstängd query utan data kan vara pending utan att hämta.",
      "Följ tre fall: första hämtningen ger Laddar..., ett misslyckat anrop ger feltext och ett lyckat anrop ger listan. Exemplet använder en enkel felvy även om en senare hämtning misslyckas; en större app kan välja att behålla gammal data med en felnotis. I övningen ska alla tre grundfallen finnas med."
    ],
    questions: [
      ["Vilken status kan vara true medan en tidigare hämtad lista fortfarande visas?", "isFetching", "Enbart queryKey", "data.map", "QueryClientProvider", "isFetching beskriver pågående hämtning, inklusive bakgrundsuppdateringar med befintlig data."],
      ["Varför kontrolleras isPending och isError före data.map?", "För att hantera tillstånden där listan inte kan användas som lyckad data", "För att map startar en request", "För att error alltid innehåller användarlistan", "För att isPending betyder att komponenten saknar CSS", "UI:t behöver hantera väntan och fel innan det renderar listan från ett lyckat query-resultat."]
    ],
    statements: ["isError kan användas för att välja en felvy.", "isFetching kan signalera en bakgrundshämtning.", "isPending betyder alltid att en request just nu skickas.", "data är garanterat en färdig lista redan före första svaret."],
    statementExplanation: "Status och nätverksaktivitet är skilda saker. Pending utan hämtning är möjligt, och data behöver kontrolleras innan den används."
  },
  "query-p4": {
    code: `${querySetup}

${getUsers}

function Users() {
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 60_000
  });
  if (isPending) return <p>Laddar...</p>;
  if (isError) return <p>Kunde inte hämta användare.</p>;
  return (
    <section>
      <button type="button" disabled={isFetching} onClick={() => refetch()}>Uppdatera</button>
      <p>Antal användare: {data.length}</p>
    </section>
  );
}

export default function App() {
  return <QueryClientProvider client={queryClient}><Users /><Users /></QueryClientProvider>;
}`,
    walkthrough: [
      "Båda Users-komponenterna ligger under samma QueryClientProvider och använder samma queryKey. Därför observerar de samma cachepost för användarlistan. De får var sin presentation men delar serverdatans identitet, vilket är användbart när samma lista behövs på flera ställen.",
      "staleTime: 60_000 låter data räknas som färsk i en minut. Det är inte en timer som gör ett anrop varje minut eller raderar data efter en minut. När data blivit stale kan vissa händelser, som att en ny observatör monteras, utlösa en omhämtning. Refetch-knappen begär uttryckligen en ny hämtning.",
      "Övningen är en förklaringsuppgift: beskriv hur en delad användarlista får nytta av cache, status och omhämtning. Jämför med en lokal öppna/stäng-knapp som passar i useState. Att en cache finns betyder inte att servern slutar vara källan för datan eller att nya requests aldrig behövs."
    ],
    questions: [
      ["Vad delar de två Users-komponenterna i exemplet?", "Cacheposten för ['users'] i samma QueryClient", "Alla lokala state-värden automatiskt", "Varje HTML-element", "Två olika databaser med samma innehåll", "Samma nyckel under samma klient ger gemensam cache-identitet för samma serverdata."],
      ["Vad betyder staleTime: 60_000?", "Data betraktas som färsk i en minut", "En request skickas exakt varje minut", "Data raderas efter en minut", "Servern väntar en minut innan svar", "staleTime beskriver färskhet, inte pollningsintervall eller serverfördröjning."]
    ],
    statements: ["refetch kan begära en ny hämtning.", "Lokalt UI-state och cachad serverdata har olika ansvar.", "Samma queryKey delar alltid data även mellan helt separata QueryClient-instansers cacher.", "staleTime ställer in hur ofta en timer ska skicka requests."],
    statementExplanation: "Cache är kopplad till klienten och nyckeln. Färskhet styr när data betraktas som gammal; återkommande polling är en annan inställning."
  },
  "jotai-p1": {
    code: `import { atom, useAtom } from "jotai";

const themeAtom = atom("dark");

export default function ThemeLabel() {
  const [theme] = useAtom(themeAtom);
  return <p>Valt tema: {theme}</p>;
}`,
    walkthrough: [
      "Importera atom från jotai och skapa themeAtom utanför komponenten med startvärdet 'dark'. Atomen är en stabil definition som komponenter kan dela. Skapas en ny atom vid varje rendering är det inte längre samma definition, vilket kan orsaka upprepade uppdateringar.",
      "ThemeLabel läser atomen med useAtom och visar Valt tema: dark. useAtom ger ett par med värde och setter; här används bara första delen. Att skriva {themeAtom} i JSX skulle inte visa strängen, eftersom atomdefinitionen inte är själva lagrade värdet.",
      "Övningen ber bara om atomdefinitionen, och resten av exemplet visar hur den blir användbar. Jotai lagrar värden i en store. Utan Provider används en standard-store; komponenter behöver använda samma atom och store för att dela värdet. Vanlig atom lagrar inte automatiskt temat efter en omladdning."
    ],
    questions: [
      ["Hur skapas atomen som uppgiften ber om?", "const themeAtom = atom('dark')", "const themeAtom = useAtom('dark')", "const themeAtom = 'dark' utan atom", "const themeAtom = atom utan anrop", "atom('dark') skapar definitionen med startvärdet dark; useAtom används senare för att läsa den i en komponent."],
      ["Varför ligger themeAtom utanför ThemeLabel?", "För att samma atomdefinition ska återanvändas vid rendering", "För att JSX inte får visa strängar", "För att temat ska sparas automatiskt på disk", "För att komponenten då aldrig renderas om", "Atomen behöver stabil identitet. Placeringen skapar inte automatisk beständig lagring."]
    ],
    statements: ["useAtom läser värdet via atomdefinitionen.", "Exemplets tema börjar som dark.", "Atomdefinitionen kan visas direkt som tematext i JSX.", "Varje komponent bör skapa en ny themeAtom för att dela samma state."],
    statementExplanation: "Delning bygger på samma atomdefinition i samma store. useAtom ger värdet som kan visas, medan en ny definition representerar en annan atom."
  },
  "jotai-p2": {
    code: `import { atom, useAtom } from "jotai";

const themeAtom = atom("dark");

function ThemeButton() {
  const [theme, setTheme] = useAtom(themeAtom);
  return (
    <button type="button" onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}>
      Byt tema från {theme}
    </button>
  );
}
function ThemeLabel() {
  const [theme] = useAtom(themeAtom);
  return <p>Valt tema: {theme}</p>;
}
export default function App() { return <><ThemeButton /><ThemeLabel /></>; }`,
    walkthrough: [
      "ThemeButton hämtar både theme och setTheme från useAtom(themeAtom). Precis som med useState är första delen det lästa värdet och andra delen en setter för denna skrivbara atom. Knappens callback skickar en funktion som väljer light när det gamla värdet är dark och annars dark.",
      "ThemeLabel läser samma atom i samma store. Ett klick ändrar därför både texten på knappen och texten i etiketten, trots att inget theme skickas mellan dem som prop. App kombinerar komponenterna men behöver inte själv hantera temavärdet.",
      "I övningen skapar du knappen som växlar temat. Exemplet visar textvärdet; att faktiskt färga hela sidan kräver att temat även används till exempel i en CSS-klass. Om bara ena komponenten ändras, kontrollera att båda använder samma exporterade atom och inte separata definitioner eller separata stores."
    ],
    questions: [
      ["Vad visar ThemeLabel efter ett klick från startläget?", "Valt tema: light", "Valt tema: dark", "Ingenting eftersom den inte har en setter", "Namnet themeAtom", "Knappen uppdaterar atomen till light. ThemeLabel läser samma atom och får det nya värdet."],
      ["Vad behöver två komponenter använda för att dela detta state?", "Samma atomdefinition i samma store", "Två nya atom('dark') med samma variabelnamn", "Samma knapptext", "Samma lokala useState-startvärde", "Samma text eller startvärde är inte samma identitet. Delningen kommer från atom och store."]
    ],
    statements: ["setTheme kan uppdatera den skrivbara atomens värde.", "En komponent kan läsa atomen utan att använda settern.", "useAtom ändrar automatiskt all CSS när strängen blir light.", "Två oberoende atomdefinitioner delar värde bara för att båda börjar på dark."],
    statementExplanation: "Atomen delar data, inte automatiskt styling. Komponenterna väljer hur värdet används och behöver samma atomidentitet för delning."
  },
  "jotai-p3": {
    code: `import { useState } from "react";
import { atom, useAtom } from "jotai";

const themeAtom = atom("dark");

function Settings() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section>
      <button type="button" onClick={() => setIsOpen(open => !open)}>Inställningar</button>
      {isOpen && <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Byt tema</button>}
    </section>
  );
}
function Header() {
  const [theme] = useAtom(themeAtom);
  return <header>Aktuellt tema: {theme}</header>;
}
export default function App() { return <><Header /><Settings /></>; }`,
    walkthrough: [
      "Det finns två olika behov i exemplet. Header och Settings behöver båda temat, så det ligger i en atom. Bara Settings behöver veta om dess panel är öppen, så isOpen är lokalt useState. Delat state och lokalt state kan alltså användas samtidigt i samma komponent.",
      "Klicka först på Inställningar för att visa temaknappen. Det ändrar bara panelens lokala state. Klicka sedan på Byt tema: atomens värde ändras och även Header visar det nya temat. Detta visar varför all data inte behöver göras global bara för att ett bibliotek finns.",
      "Förklaringsuppgiften ber om ett fall där props annars skickas genom många nivåer. Beskriv exempelvis ett tema som behövs i avlägsna menyer och sidhuvud. Om två närliggande komponenter bara delar ett enkelt värde kan det räcka att lyfta useState till deras gemensamma parent och skicka props."
    ],
    questions: [
      ["Vilket värde är lokalt i exemplet?", "isOpen i Settings", "theme i themeAtom", "Alla atomvärden per definition", "Header-komponentens namn", "isOpen behövs bara för Settings egen panel, medan theme läses av flera komponenter."],
      ["Varför kan en atom passa för ett tema långt ifrån flera konsumenter i trädet?", "Flera komponenter kan läsa samma värde utan mellanliggande props", "Den gör alla komponenter till samma funktion", "Den sparar automatiskt allt i en databas", "Den tar bort behovet av renderingen", "En delad atom kan minska vidarebefordring genom komponenter som inte själva behöver värdet."]
    ],
    statements: ["Lokalt och delat state kan kombineras.", "Ett värde som flera avlägsna komponenter behöver kan passa i en atom.", "Alla konstanter bör flyttas till Jotai.", "useState kan aldrig delas via props från en gemensam parent."],
    statementExplanation: "Välj utifrån vem som behöver datan. useState och props räcker ofta, medan atomer kan underlätta verklig delning över flera delar av appen."
  },
  "zod-p1": {
    code: `import { z } from "zod";

const userSchema = z.object({ username: z.string() });
const input: unknown = { username: 42 };
const result = userSchema.safeParse(input);

if (result.success) {
  console.log(result.data.username);
} else {
  console.log(result.error.issues[0].message);
}`,
    walkthrough: [
      "Importera z och skapa userSchema med z.object. Propertyn username har regeln z.string(), vilket betyder att värdet måste vara text. Schemat är körbar kod som kan kontrollera verklig data, till skillnad från en TypeScript-typ som inte finns kvar som kontroll när programmet körs.",
      "input har typen unknown för att visa att inkommande data ännu inte är betrodd. I exemplet är username talet 42, så safeParse ger success: false och felgrenen skriver ett meddelande i konsolen. Ändrar du värdet till 'Sofia' används i stället result.data.username.",
      "Övningen tränar själva schemat med username. z.string() kontrollerar typen men kräver inte att strängen är lång eller ens icke-tom. Sådana extra regler läggs till på nästa sida. En typkonvertering med as skulle inte ersätta den här valideringen av användarens eller serverns verkliga värden."
    ],
    questions: [
      ["Vad händer när exemplet validerar { username: 42 }?", "Valideringen misslyckas eftersom username inte är en string", "42 omvandlas automatiskt till text", "Objektet godkänns för att input är unknown", "Schemat renderar en knapp", "z.string kräver en sträng och gör ingen automatisk konvertering av talet här."],
      ["Vad tillför schemat jämfört med enbart en TypeScript-typ?", "Kontroll av det verkliga värdet när programmet körs", "Enbart ett nytt namn i editorn", "Automatisk lagring av alla giltiga värden", "Ett färdigt formulär", "Zod-schemat körs vid runtime. En typannotering är inte en runtime-kontroll av inkommande data."]
    ],
    statements: ["z.object beskriver regler för objektets fält.", "safeParse kan kontrollera ett värde med typen unknown.", "z.string() kräver alltid minst ett tecken.", "En TypeScript-cast garanterar att extern data följer schemat."],
    statementExplanation: "Schemat kontrollerar data vid körning. En vanlig string-regel tillåter även tom text; ytterligare krav behöver uttryckliga regler."
  },
  "zod-p2": {
    code: `import { z } from "zod";

const schema = z.object({
  password: z.string().min(8, "Lösenordet måste ha minst 8 tecken"),
  email: z.string().email("Skriv en giltig e-postadress")
});

const result = schema.safeParse({ password: "kort", email: "sofia@example.com" });
console.log(result.success); // false: lösenordet är för kort`,
    walkthrough: [
      "Börja med grundtypen och kedja sedan en regel: z.string().min(8) kräver en sträng med minst åtta tecken. password ligger i ett objekt precis som i koduppgiften. Exemplet använder även e-postregeln från Zod 3, som är den version projektet har installerad.",
      "Lösenordet 'kort' är en sträng men har bara fyra tecken. Därför misslyckas hela objektets validering även om e-postfältet har giltigt format. Byt lösenordet till en sträng med minst åtta tecken och kontrollera hur success ändras. Det anpassade felmeddelandet kan visas i ett formulär.",
      "En längdregel på string räknar tecken, medan min på number jämför ett talvärde. email() kontrollerar formatet men bevisar inte att adressen tillhör användaren eller att brevlådan finns. Uppgiftens krav är just minst åtta tecken, så det måste uttryckas i schemat och inte bara i en kommentar."
    ],
    questions: [
      ["Varför blir result.success false?", "Lösenordet kort har färre än 8 tecken", "Alla lösenord måste vara number", "E-postadressen innehåller ett @", "min(8) tillåter bara exakt 8 tecken", "min(8) anger en minsta längd; kort har fyra tecken."],
      ["Vad kontrollerar z.string().email() här?", "Att strängen har ett giltigt e-postformat", "Att användaren äger brevlådan", "Att e-postmeddelandet har levererats", "Att adressen finns i databasen", "Formatkontroll är inte ett bevis på adressens existens eller ägarskap."]
    ],
    statements: ["Ett lösenord med nio tecken klarar längdregeln min(8).", "Ett enda ogiltigt fält kan göra objektets validering misslyckad.", "min(8) på en sträng kontrollerar att dess numeriska värde är minst åtta.", "email() skickar ett verifieringsmejl."],
    statementExplanation: "Reglerna gäller värdenas typer och format. String-min kontrollerar längd och e-postkontrollen skickar inga meddelanden."
  },
  "zod-p3": {
    code: `import { z } from "zod";

const userSchema = z.object({ name: z.string().min(2) });
const user = { name: "S" };
const result = userSchema.safeParse(user);

if (result.success) {
  console.log("Giltigt namn:", result.data.name);
} else {
  console.log("Fel:", result.error.issues[0].message);
}

// parse används när anroparen vill fånga ett kastat valideringsfel.
try {
  const validUser = userSchema.parse(user);
  console.log(validUser.name);
} catch {
  console.log("Namnet behöver minst två tecken");
}`,
    walkthrough: [
      "Båda anropen använder samma schema och samma user med namnet 'S'. min(2) gör värdet ogiltigt. safeParse lämnar ett resultat som du förgrenar med success, medan parse kastar ett valideringsfel som fångas i try/catch-delen.",
      "Läs result.data endast i success-grenen och result.error i felgrenen. Då följer koden resultatets faktiska form och TypeScript kan hjälpa dig skilja grenarna åt. result.error.issues innehåller detaljer om vilka regler som inte uppfylldes; exemplet visar det första meddelandet.",
      "Ändra namnet till 'Sofia' och följ båda vägarna igen: safeParse ger data och parse returnerar det validerade objektet. I uppgiften ska du använda safeParse och kontrollera success. Du behöver inte använda båda metoderna samtidigt i en riktig funktion; de visas tillsammans för att göra skillnaden tydlig."
    ],
    questions: [
      ["Vilken gren körs efter safeParse med name: 'S'?", "Felgrenen med result.error", "Success-grenen med result.data", "Ingen gren eftersom safeParse alltid kastar", "Båda grenarna", "Namnet är för kort, så resultatet har success: false och innehåller error."],
      ["Vad gör parse vid samma ogiltiga namn?", "Kastar ett valideringsfel", "Returnerar alltid success: false", "Returnerar strängen S utan kontroll", "Returnerar undefined utan fel", "parse returnerar validerad data vid framgång och kastar vid valideringsfel."]
    ],
    statements: ["result.success avgör vilken gren av safeParse-resultatet som finns.", "parse kan hanteras med try/catch vid valideringsfel.", "result.data är tillgänglig även när valideringen misslyckas.", "safeParse rättar automatiskt alla ogiltiga värden."],
    statementExplanation: "Valideringen rapporterar om kraven uppfylls. Den skapar inte giltig data ur varje felaktig inmatning, och data/error hör till olika resultatgrenar."
  },
  "zod-p4": {
    code: `import { useState, type FormEvent } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Skriv minst två tecken i namnet"),
  email: z.string().email("Skriv en giltig e-postadress")
});

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = schema.safeParse({ name, email });
    if (!result.success) {
      setMessage(result.error.issues[0].message);
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data)
      });
      if (!response.ok) throw new Error("Kunde inte spara");
      setMessage("Sparat!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Okänt fel");
    } finally { setSaving(false); }
  }
  return (
    <form onSubmit={handleSubmit} noValidate>
      <label>Namn <input value={name} onChange={e => setName(e.target.value)} /></label>
      <label>E-post <input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <button type="submit" disabled={saving}>{saving ? "Sparar..." : "Spara"}</button>
      <p role="status">{message}</p>
    </form>
  );
}`,
    walkthrough: [
      "Samla namn och e-post i var sitt state och koppla formulärets onSubmit till handleSubmit. preventDefault stoppar vanlig formulärnavigation. noValidate används här för att du ska se just Zods felmeddelanden i övningen i stället för webbläsarens inbyggda formulärvalidering.",
      "safeParse kontrollerar båda fälten innan requesten. Om någon regel misslyckas sparas första felmeddelandet och return avslutar handlern så att fetch inte körs. Vid framgång skickas result.data, där namnet också har trimmats av schemat. Det är den validerade datan du använder vidare.",
      "Ett lyckat HTTP-svar ger Sparat!, medan ett nätverks- eller HTTP-fel visas som meddelande. Knappen avaktiveras under anropet och återaktiveras i finally. API:et måste finnas separat och validera på serversidan också; klientens kontroll förbättrar formuläret men kan inte styra alla requests som servern tar emot."
    ],
    questions: [
      ["Vilken rad hindrar fetch när valideringen misslyckas?", "return i grenen !result.success", "setMessage ensam", "noValidate på form", "type='email' ensam", "Felmeddelandet visar problemet, men return är det som avslutar handlern innan requesten."],
      ["Vilken data skickas efter lyckad validering?", "result.data", "result.error", "Hela result inklusive status", "Enbart e från submit-eventet", "result.data är det validerade och eventuellt transformerade objektet, här med trimmat namn."]
    ],
    statements: ["Valideringen sker före fetch i handleSubmit.", "Servern behöver också kontrollera inkommande data.", "Att visa ett felmeddelande stoppar automatiskt resten av funktionen.", "noValidate betyder att Zod slutar kontrollera fälten."],
    statementExplanation: "Flödet stoppas uttryckligen med return. noValidate gäller webbläsarens inbyggda kontroll; Zod körs av din handler och ersätter inte servervalidering."
  }
};
