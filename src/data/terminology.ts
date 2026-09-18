import { shuffle, shuffleQuestionOptions } from "./quizShuffle";

export type Term = { id: string; term: string; definition: string; example: string };
const term = (id: string, term: string, definition: string, example: string): Term => ({ id, term, definition, example });

export const terminology: Record<string, Term[]> = {
  react: [
    term("component", "Komponent", "En återanvändbar del av användargränssnittet som kan beskrivas med en funktion.", "Hello returnerar en rubrik och används som <Hello />."),
    term("jsx", "JSX", "Syntax som beskriver användargränssnitt med HTML-liknande uttryck i JavaScript.", "<h1>Hej {name}</h1> kombinerar markup och ett JavaScript-uttryck."),
    term("render", "Rendering", "När React anropar komponenter för att beräkna vad gränssnittet ska visa.", "En state-uppdatering kan leda till en ny rendering."),
    term("event", "Event", "En händelse som koden kan reagera på, till exempel ett klick.", "onClick kopplar en funktion till knappens klickhändelse."),
    term("fragment", "Fragment", "En gruppering av JSX-element som inte lägger till ett extra HTML-element.", "<><Header /><Footer /></> grupperar två komponenter."),
    term("design-system", "Designsystem", "Gemensamma designregler, komponenter och dokumentation för enhetliga gränssnitt.", "Material Design, Carbon och Fluent 2 är exempel."),
    term("token", "Design token", "Ett namngivet designvärde som kan återanvändas på flera ställen.", "tokens.radius kan styra rundningen på alla knappar."),
    term("ui", "UI", "Det användargränssnitt som en person ser och använder.", "Knappar, menyer och formulär ingår i appens UI.")
  ],
  state: [
    term("state", "State", "Komponentens minne för värden som kan ändras mellan renderingar.", "count håller reda på hur många gånger användaren har klickat."),
    term("hook", "Hook", "En funktion som ger komponenter tillgång till React-funktioner som state.", "useState är en Hook som anropas högst upp i komponenten."),
    term("setter", "Setter", "Funktionen som begär att ett state-värde ska uppdateras.", "setCount(5) begär värdet 5 till en kommande rendering."),
    term("initial", "Startvärde", "Det värde state får när komponenten först initieras.", "I useState(0) är 0 startvärdet."),
    term("functional", "Funktionell uppdatering", "En state-uppdatering som beräknar nästa värde från det föregående.", "setCount(previous => previous + 1) bygger på föregående värde."),
    term("mutation", "Mutation", "Att ändra ett befintligt värde eller objekt direkt.", "items.push(item) muterar arrayen; skapa en ny array när du uppdaterar React-state."),
    term("derived", "Härledd data", "Ett värde som kan beräknas från annan data utan eget state.", "const doubled = count * 2 räknas ut från count."),
    term("snapshot", "State-ögonblicksbild", "De state-värden som en viss rendering och dess handlers ser.", "setCount ändrar inte count-variabeln i en handler som redan körs.")
  ],
  components: [
    term("composition", "Komposition", "Att bygga ett större gränssnitt genom att kombinera mindre komponenter.", "App använder Header, MainContent och Footer."),
    term("parent", "Parent", "En komponent som renderar en annan komponent.", "App är parent när den returnerar <ProductCard />."),
    term("child", "Child", "En komponent som renderas av en annan komponent.", "ProductCard är child när App använder den."),
    term("default", "Standardexport", "En moduls huvudsakliga export, som importeras utan klamrar.", "export default function Button() kopplas till import Button from './Button'."),
    term("named", "Namngiven export", "En export med ett bestämt namn som normalt importeras med klamrar.", "export function Button() kopplas till import { Button } from './Button'."),
    term("import", "Import", "Att göra något som en annan modul exporterar tillgängligt i den egna filen.", "import Button from './Button' gör komponenten tillgänglig i App.tsx."),
    term("reuse", "Återanvändning", "Att använda samma komponentdefinition på flera ställen.", "Två ProductCard kan visa olika produkter genom olika props."),
    term("responsibility", "Komponentansvar", "Den avgränsade uppgift som en komponent ska sköta.", "Header ansvarar för sidans överdel medan Footer ansvarar för sidfoten.")
  ],
  router: [
    term("routing", "Routing", "Att koppla olika adresser till olika vyer i appen.", "Adressen /contact visar kontaktvyn."),
    term("route", "Route", "En definition av vilken vy som matchar en viss sökväg.", "<Route path='/about' element={<About />} /> beskriver en matchning."),
    term("path", "Path", "Sökvägen eller sökvägsmönstret som en route matchar.", "/products/:id innehåller både en fast del och en parameter."),
    term("link", "Link", "En komponent för att navigera till en annan adress i React Router.", "<Link to='/contact'>Kontakt</Link> navigerar till kontaktsidan."),
    term("parameter", "Route-parameter", "En variabel del av en sökväg som kan läsas av vyn.", "I /products/:id får id värdet '42' vid /products/42."),
    term("params", "useParams", "Hooken som läser parametrar från den matchade routen.", "const { id } = useParams() läser id från adressen."),
    term("browser-router", "BrowserRouter", "Komponenten som ger routing-context och använder webbläsarens historik.", "Routes och Link kan placeras under samma BrowserRouter."),
    term("spa", "SPA", "En webbapp där navigation mellan vyer vanligtvis sker utan att hela dokumentet laddas om.", "React Router kan byta vy i en single-page application.")
  ],
  fetch: [
    term("fetch", "fetch", "Webbplattformens funktion för att skicka en request och få en Promise för ett response.", "fetch('/api/users') börjar hämta användardata."),
    term("promise", "Promise", "Ett objekt som representerar ett framtida lyckat resultat eller ett fel.", "fetch returnerar innan nätverkssvaret har kommit."),
    term("await", "await", "Uttrycket som väntar på en Promise i en asynkron funktion utan att blockera hela appen.", "const response = await fetch('/api/users') inväntar svaret."),
    term("response", "Response", "Objektet som innehåller bland annat status, headers och en läsbar body från ett svar.", "response.status och response.ok beskriver resultatets HTTP-status."),
    term("json-read", "response.json()", "Metoden som läser och tolkar svarets body som JSON.", "const users = await response.json() ger den parsade datan."),
    term("ok", "response.ok", "En boolean som anger om HTTP-statusen är mellan 200 och 299.", "Ett 404-svar ger ok: false även om fetch har fått ett response."),
    term("stringify", "JSON.stringify", "Funktionen som omvandlar ett JavaScript-värde till JSON-text.", "JSON.stringify({ name: 'Sofia' }) kan användas som request body."),
    term("network-error", "Nätverksfel", "Ett fel där nätverksanropet inte kan slutföras med ett tillgängligt HTTP-svar.", "En server som inte går att nå kan göra att fetch avvisas och catch körs.")
  ],
  query: [
    term("query", "Query", "En hanterad hämtning av serverdata med tillstånd och cache.", "useQuery hämtar användare och ger data samt status."),
    term("key", "queryKey", "Arrayen som identifierar vilken data en cachepost gäller.", "['product', productId] skiljer olika produkter åt."),
    term("function", "queryFn", "Funktionen som en query kör för att hämta data eller rapportera ett fel.", "queryFn: getUsers skickar en funktionsreferens."),
    term("cache", "Cache", "Lagrade resultat som kan återanvändas mellan hämtningar och komponenter.", "Två komponenter med samma QueryClient och queryKey kan dela data."),
    term("client", "QueryClient", "Objektet som hanterar bland annat query-cache för appen.", "En stabil klient ges till QueryClientProvider."),
    term("pending", "isPending", "Statusflaggan som anger att en query ännu inte har ett lyckat resultat och har pending-status.", "En avstängd query utan data kan vara pending utan att hämta."),
    term("fetching", "isFetching", "Flaggan som anger pågående hämtning, även vid bakgrundsuppdatering.", "En lista kan ligga kvar medan isFetching är true."),
    term("stale", "staleTime", "Tiden då hämtad data betraktas som färsk.", "staleTime: 60_000 anger en minut; det är inte ett pollningsintervall.")
  ],
  jotai: [
    term("atom", "Atom", "En definition av en liten state-enhet som komponenter kan använda.", "const themeAtom = atom('dark') definierar tema-state."),
    term("use-atom", "useAtom", "Hooken som ger en atoms värde och, för skrivbara atomer, en setter.", "const [theme, setTheme] = useAtom(themeAtom) läser och ändrar temat."),
    term("initial", "Initialvärde", "Startvärdet för en primitiv atom innan det har ändrats.", "I atom('sv') är 'sv' initialvärdet."),
    term("shared", "Delat state", "Data som flera komponenter behöver använda som samma tillstånd.", "Header och Checkout läser samma varukorg."),
    term("local", "Lokalt state", "Data vars ansvar och användning ligger i en enskild komponent.", "En panels öppet/stängt-läge kan ligga i useState."),
    term("setter", "Atom-setter", "Funktionen som begär en ändring av en skrivbar atoms värde.", "setTheme('light') väljer ett ljust tema."),
    term("identity", "Stabil atomidentitet", "Att återanvända samma atomdefinition mellan renderingar.", "En atom på modulnivå skapas inte på nytt varje gång komponenten renderas."),
    term("subscription", "Prenumeration", "Kopplingen som gör att en komponent får uppdateringar när atomvärdet den läser ändras.", "En komponent som läser themeAtom med useAtom uppdateras när temat ändras.")
  ],
  zod: [
    term("schema", "Schema", "En beskrivning av den form och de regler som data måste uppfylla.", "z.object({ name: z.string() }) beskriver ett objekt med en sträng."),
    term("runtime", "Runtime-validering", "Kontroll av verkliga värden medan programmet körs.", "Ett API-svar kan kontrolleras med Zod även om en TypeScript-typ redan finns."),
    term("parse", "parse", "Schemametoden som ger validerad data eller kastar ett fel.", "schema.parse(input) behöver felhantering när input är ogiltig."),
    term("safe-parse", "safeParse", "Schemametoden som returnerar ett resultat som anger om valideringen lyckades.", "const result = schema.safeParse(input) ger success, och data eller error."),
    term("success", "success", "Boolean-fältet som skiljer ett lyckat valideringsresultat från ett misslyckat.", "if (result.success) ger tillgång till result.data."),
    term("data", "result.data", "Den validerade datan i ett lyckat safeParse-resultat.", "Skicka result.data efter att success har kontrollerats."),
    term("issues", "Valideringsfel", "Information om vilka regler som den inskickade datan bryter mot.", "result.error.issues kan användas för att visa användaren vad som behöver rättas."),
    term("min", "min", "En regel som sätter en lägsta gräns, till exempel strängens minsta längd.", "z.string().min(10) kräver minst tio tecken.")
  ],
  forms: [
    term("submit", "Submit", "Händelsen där användaren skickar ett formulär.", "En submit-knapp eller Enter i ett fält kan utlösa onSubmit."),
    term("prevent", "preventDefault", "Metoden som stoppar en händelses standardbeteende i webbläsaren.", "e.preventDefault() kan stoppa formulärets vanliga sidnavigation."),
    term("controlled", "Controlled input", "Ett inmatningsfält vars visade värde styrs av React-state.", "value={name} och onChange håller ett textfält kopplat till name."),
    term("validation", "Validering", "Att kontrollera att inmatningen följer de regler som krävs.", "Ett namn kan behöva minst två tecken innan en request skickas."),
    term("required", "required", "HTML-attributet som kräver att ett fält fylls i eller en checkbox markeras.", "<input required /> ger webbläsarvalidering vid vanlig submit."),
    term("checked", "checked", "Egenskapen som anger en checkboxs markerade läge som boolean.", "checked={consent} använder true eller false, inte textvärdet."),
    term("handler", "Submit-handler", "Funktionen som utför formulärets logik när submit inträffar.", "handleSubmit validerar, avbryter vid fel och skickar annars data."),
    term("feedback", "Återkoppling", "Information i gränssnittet om resultat eller vad användaren behöver göra.", "Visa Sparat! vid framgång och ett begripligt meddelande vid fel.")
  ],
  props: [
    term("props", "Props", "Indata som en parent skickar till en komponent.", "<Greeting name='Sofia' /> skickar name som prop."),
    term("readonly", "Read-only", "Att mottagen data ska läsas utan att ändras direkt av mottagaren.", "Child ska inte skriva över sina props."),
    term("destructuring", "Destructuring", "Syntax för att plocka ut enskilda fält ur ett objekt eller delar ur en array.", "function Greeting({ name }) plockar ut name från props-objektet."),
    term("type", "Props-typ", "Typbeskrivningen som anger vilka indata en komponent får ta emot.", "type Props = { title: string; price: number } beskriver två obligatoriska props."),
    term("optional", "Valfri prop", "En prop som får utelämnas av den som använder komponenten.", "description?: string kan saknas och behöver då hanteras."),
    term("default", "Standardvärde", "Ett reservvärde som används när en prop är undefined.", "{ description = 'Ingen beskrivning' } ger en text när prop-värdet saknas."),
    term("callback", "Callback-prop", "En funktion som skickas som prop så att child kan meddela en händelse.", "Parent skickar onIncrement till CounterButton."),
    term("lift", "Lyfta state", "Att flytta gemensamt state till en parent som kan dela det med flera children.", "Parent äger count och skickar värdet till CounterLabel och en callback till CounterButton.")
  ],
  databinding: [
    term("binding", "Databindning", "Kopplingen mellan data i programmet och värden som visas i gränssnittet.", "Ett input visar name och meddelar ändringar tillbaka till state."),
    term("value", "value", "Egenskapen som anger innehållet som ett textfält visar.", "value={email} gör att fältet visar email-state."),
    term("change", "onChange", "Event-propen som kopplar en handler till ändringar i ett inmatningsfält.", "onChange={e => setName(e.target.value)} uppdaterar name."),
    term("target", "event.target", "Elementet där en händelse uppstod.", "e.target.value läser text från det input som ändrades."),
    term("text", "event.target.value", "Textvärdet från ett input i en ändringshändelse.", "Ett textfält med Sofia ger strängen 'Sofia'."),
    term("boolean", "event.target.checked", "Boolean-värdet som beskriver om den ändrade checkboxen är markerad.", "setSubscribed(e.target.checked) sparar true eller false."),
    term("source", "Source of truth", "Den datakälla som används som det styrande värdet för visningen.", "I ett controlled input är React-state den styrande källan."),
    term("cycle", "Uppdateringscykel", "Flödet från inmatning via state-ändring till en ny visning.", "Användaren skriver → onChange → setName → rendering → nytt value.")
  ],
  typescript: [
    term("annotation", "Typannotering", "En uttrycklig typ som skrivs vid en variabel, parameter eller returtyp.", "const age: number = 20 har annoteringen number."),
    term("inference", "Typinferens", "När TypeScript härleder en typ från hur koden är skriven.", "let age = 20 gör att TypeScript kan härleda number."),
    term("union", "Unionstyp", "En typ som tillåter ett av flera angivna alternativ.", "type Role = 'admin' | 'user' tillåter två strängliteraler."),
    term("alias", "Typalias", "Ett namn som ges till en typbeskrivning med type.", "type Product = { title: string } namnger en objektform."),
    term("optional", "Valfri property", "Ett objektfält som får saknas enligt typbeskrivningen.", "description?: string kan vara undefined."),
    term("unknown", "unknown", "En typ för ett okänt värde som behöver kontrolleras före mer specifik användning.", "Kontrollera typeof value === 'string' innan du använder strängoperationer."),
    term("narrowing", "Narrowing", "Att med kontroller begränsa vilka typer ett värde kan ha i en viss kodgren.", "Efter typeof value === 'string' vet TypeScript att value är en sträng i grenen."),
    term("any", "any", "En typ som stänger av många av TypeScripts kontroller för värdet.", "Att byta number till any kan dölja ett typfel utan att rätta värdet.")
  ],
  hono: [
    term("route", "Route", "En serverdefinition som kopplar HTTP-metod och sökväg till en handler.", "app.get('/api/users', handler) hanterar GET på den sökvägen."),
    term("context", "Context", "Objektet som ger en Hono-handler tillgång till request och metoder för response.", "Parametern c används för c.req och c.json()."),
    term("handler", "Route-handler", "Funktionen som körs när en request matchar en serverroute.", "c => c.json({ ready: true }) bygger ett JSON-svar."),
    term("json", "c.json", "Metoden som skapar ett HTTP-response med JSON-innehåll.", "return c.json({ id: 1 }, 201) returnerar data och status."),
    term("body", "c.req.json()", "Metoden som läser och tolkar den inkommande requestens body som JSON.", "const body = await c.req.json() läser klientens inskickade data."),
    term("status", "Statuskod", "Talet i ett HTTP-response som beskriver resultatet av requesten.", "201 kan användas för skapad resurs och 400 för ogiltig input."),
    term("validation", "Servervalidering", "Kontroll av inkommande data på servern innan den används eller sparas.", "Servern kontrollerar name även om klienten redan har validerat formuläret."),
    term("contract", "API-kontrakt", "Överenskommelsen om metod, adress och dataformat mellan klient och server.", "Båda sidor använder GET /api/products och fälten id, title och price.")
  ],
  server: [
    term("reverse-proxy", "Reverse proxy", "En server framför backend-servrar som tar emot klientanrop och förmedlar dem vidare och svaren tillbaka.", "NGINX tar emot /api/orders på butikens publika adress och kontaktar en intern ordertjänst."),
    term("forward-proxy", "Forward proxy", "En mellanhand som företräder klienter när de anropar andra tjänster.", "En dator i ett företagsnät kan använda en forward proxy för utgående webbanrop."),
    term("client", "Klient", "Programmet som skickar requests och använder serverns svar.", "React-appen i webbläsaren hämtar användare med fetch."),
    term("server", "Server", "Programmet som tar emot requests, behandlar dem och skickar responses.", "En Hono-app kan läsa data och returnera en produktlista."),
    term("request", "Request", "Meddelandet från klienten med metod, adress, headers och eventuell body.", "POST /api/users kan bära ett nytt namn som JSON."),
    term("response", "Response", "Svaret med status, headers och eventuell body som skickas tillbaka till klienten.", "200 med en JSON-lista är ett lyckat svar på en hämtning."),
    term("endpoint", "Endpoint", "En kombination av HTTP-metod och adress som ett API hanterar.", "GET /api/products och POST /api/products är olika endpoints."),
    term("headers", "Headers", "Metadata om en request eller ett response.", "Content-Type: application/json beskriver meddelandets innehållsformat."),
    term("body", "Body", "Själva innehållet som skickas i en request eller ett response.", "{ title: 'Penna', price: 15 } kan skickas serialiserat som JSON-body."),
    term("method", "HTTP-metod", "Delen av en request som anger vilken sorts operation klienten begär.", "GET används för hämtning och POST används ofta för att skapa data.")
  ]
};

export type TerminologyDirection = "term" | "definition";
export type TerminologyQuestion = { id: string; termId: string; question: string; options: string[]; answer: number; explanation: string };

export function createTerminologyQuestions(slug: string, direction: TerminologyDirection, random = Math.random): TerminologyQuestion[] {
  const terms = terminology[slug] ?? [];
  return shuffle(terms, random).map(item => {
    const distractors = shuffle(terms.filter(other => other.id !== item.id), random).slice(0, 3);
    const option = (entry: Term) => direction === "term" ? entry.term : entry.definition;
    return shuffleQuestionOptions({
      id: `terminology-${slug}-${item.id}-${direction}`,
      termId: item.id,
      question: direction === "term" ? `Vilket begrepp passar? ${item.definition}` : `Vad betyder ${item.term}?`,
      options: [option(item), ...distractors.map(option)],
      answer: 0,
      explanation: `${item.term}: ${item.definition} Exempel: ${item.example}`
    }, random);
  });
}
