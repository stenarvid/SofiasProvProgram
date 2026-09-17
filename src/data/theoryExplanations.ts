/**
 * Easy-to-read theory explanations for every study page.
 * Kept separate from studyTopics.ts so topic data remains easy to extend.
 */
import { studyLessons } from "./studyLessons";

export const theoryExplanations: Record<string, string[]> = {
  "react-p1": [
    "React hjälper dig bygga ett gränssnitt genom att dela upp sidan i små delar som kallas komponenter. En komponent är vanligtvis en JavaScript- eller TypeScript-funktion som returnerar JSX, alltså beskrivningen av vad som ska visas på sidan.",
    "I exemplet `function Hello() { return <h1>Hej!</h1>; }` är `Hello` själva React-komponenten. Funktionen returnerar ett `h1`-element. För att visa komponenten från en annan komponent skriver du `<Hello />`. Det är därför komponentnamn börjar med stor bokstav: React kan då skilja `Hello` från vanliga HTML-element som `div` och `button`.",
    "När data som komponenten använder ändras kan React rendera om den del av gränssnittet som behöver uppdateras. Du arbetar därför främst med komponenter och data i stället för att själv ändra HTML-element direkt.",
  ],
  "react-p2": [
    "JSX är syntaxen som gör att du kan skriva HTML-liknande kod inuti JavaScript eller TypeScript. Det ser ut som HTML, men det är egentligen ett sätt att beskriva vilket gränssnitt React ska skapa.",
    "Inuti JSX kan du använda JavaScript-uttryck genom att skriva dem inom `{ }`. Om du exempelvis har `const name = \"Anna\"` kan du skriva `<h1>Hej {name}</h1>`. React sätter då in värdet på rätt plats.",
    "En komponent kan returnera JSX men också exempelvis text, tal, en array av React-noder eller null. Flera JSX-element intill varandra behöver omslutas av ett gemensamt element eller ett fragment `<>...</>`; element i en array behöver stabila keys.",
  ],
  "react-p3": [
    "Komposition betyder att du bygger en större sida genom att kombinera flera mindre komponenter. I stället för att skriva hela sidan i en enda stor funktion kan du exempelvis ha `Header`, `Sidebar`, `UserCard` och `Footer`.",
    "En komponent används ungefär som ett eget HTML-element: `<UserCard />`. Den kan också ta emot props så att samma komponent kan visa olika data.",
    "Det här gör koden lättare att läsa, testa och återanvända. Om samma UI-del används på flera ställen behöver du bara underhålla komponenten på ett ställe.",
  ],
  "react-p4": [
    "Så bygger du profilen i uppgiften: skapa funktionen Profile och returnera en div som innehåller en h2 för namnet, ett p-element för titeln och en button för knappen. Här samlar div de intilliggande JSX-elementen. Ett fragment kan också användas om du inte vill lägga till ett extra DOM-element.",
    "Själva knappen skapas med <button type=\"button\">Visa profil</button>. Texten mellan starttaggen och sluttaggen blir texten på knappen. type=\"button\" gör att knappen inte råkar skicka ett formulär om den senare placeras i ett sådant. Detta räcker för att visa en knapp; för att den också ska göra något behöver du koppla ett klick till kod.",
    "I exemplet skapar vi därför funktionen handleClick inuti Profile, före return. Den kör window.alert(\"Hej från Sofia!\"), som visar en meddelanderuta. På knappen skriver vi onClick={handleClick}. När användaren klickar anropar React funktionen och meddelanderutan visas. Skriv inte onClick={handleClick()}, eftersom det skulle köra funktionen direkt när komponenten renderas.",
    "För att profilen ska synas måste den också användas på sidan. Exemplet kan skrivas i App.tsx i ett befintligt React-projekt: App returnerar <Profile /> och visar därmed namn, titel och knapp. Har du redan en App-komponent lägger du <Profile /> i dess JSX. Profile börjar med stor bokstav så att React känner igen den som en egen komponent.",
    "Om något inte syns: kontrollera att komponenten har return, att alla JSX-taggar är stängda och att Profile faktiskt används i App. className=\"card\" kopplar profilen till en CSS-klass; det ger bara ett särskilt utseende om klassen finns i din CSS. Knappen fungerar även utan egen CSS.",
  ],
  "state-p1": [
    "State är data som en komponent själv behöver komma ihåg mellan renderingar. Det kan till exempel vara ett räknarvärde, texten i ett inputfält, om en meny är öppen eller data som hämtats från en server.",
    "Vanliga variabler räcker inte när ett värde ska påverka gränssnittet över tid. När state uppdateras vet React att komponenten kan behöva renderas om med det nya värdet.",
    "Tänk därför på state som komponentens föränderliga minne: props kommer utifrån, medan state normalt ägs och uppdateras av komponenten själv.",
  ],
  "state-p2": [
    "`useState` är en React-hook för att skapa state. `const [count, setCount] = useState(0)` ger dig två saker: det aktuella värdet `count` och funktionen `setCount` som används för att ändra det.",
    "Du ska inte skriva `count = count + 1`. I stället använder du `setCount(count + 1)`. När settern körs sparar React det nya värdet och renderar om komponenten vid behov.",
    "Värdet som skickas till `useState(...)` är startvärdet. Det kan vara till exempel ett number, en string, en boolean, en array eller ett objekt.",
  ],
  "state-p3": [
    "Om nästa state beror på det föregående värdet är en functional update säkrare. Du skriver då exempelvis `setCount(prev => prev + 1)`.",
    "React kan samla flera state-uppdateringar innan nästa rendering. Därför är `prev` användbart: React ger callbacken det senaste värdet som ska användas i just den uppdateringen.",
    "Det är särskilt viktigt när du gör flera uppdateringar efter varandra eller när gamla state-värden annars riskerar att användas.",
  ],
  "state-p4": [
    "State används ofta för saker som användaren kan ändra i gränssnittet. Ett inputfält kan exempelvis ha `value={name}` och `onChange={e => setName(e.target.value)}`.",
    "Samma princip används för checkboxar, valda alternativ, öppna/stängda paneler och loading-status. UI:t läser state, användarens handling ändrar state, och React visar sedan det nya resultatet.",
    "Det skapar ett tydligt flöde: state är källan till sanningen och gränssnittet visar det som finns i state.",
  ],
  "state-p5": [
    "State ska aldrig behandlas som en vanlig variabel som du ändrar direkt. Använd alltid setter-funktionen från `useState` så att React vet att värdet har ändrats.",
    "Ett vanligt fel är också att skapa state för sådant som egentligen kan räknas ut från annan data. Om `fullName` alltid kan skapas från `firstName` och `lastName` behöver det ofta inte vara ett eget state.",
    "Fråga dig därför: behöver komponenten komma ihåg detta värde, kan det ändras, och ska en ändring påverka UI? Om svaret är ja är state ofta rätt verktyg.",
  ],
  "components-p1": [
    "En React-komponent är en återanvändbar del av gränssnittet. Den är oftast en funktion som returnerar JSX och har ett tydligt ansvar, till exempel att visa en användare, en knapp eller en navigation.",
    "En bra komponent försöker göra en tydlig sak. `UserCard` kan exempelvis ansvara för hur en användare visas, medan `UserList` ansvarar för att rendera flera `UserCard`-komponenter.",
    "Det gör stora sidor lättare att förstå eftersom du kan tänka i mindre byggblock i stället för en enda stor fil.",
  ],
  "components-p2": [
    "Komponenter ligger ofta i egna filer. För att använda en komponent i en annan fil behöver den exporteras från sin egen fil och importeras där den ska användas.",
    "Med `export default function Button()` kan du sedan skriva `import Button from \"./Button\"` i en annan fil. Efter importen kan komponenten användas i JSX som `<Button />`.",
    "Export/import handlar alltså inte om React-specifik magi, utan om JavaScript-moduler: du gör kod tillgänglig mellan filer.",
  ],
  "components-p3": [
    "När mindre komponenter sätts ihop till ett större gränssnitt kallas det komposition. En `Dashboard` kan exempelvis rendera både `<Sidebar />` och `<Stats />`.",
    "Du behöver inte bryta ut varje liten `div` till en egen komponent. Det är mest användbart när en del har ett eget tydligt ansvar, används flera gånger eller gör parent-komponenten svår att läsa.",
    "Ett bra mål är att komponentnamnen ska hjälpa dig förstå sidans struktur bara genom att läsa JSX-koden.",
  ],
  "router-p1": [
    "React Router låter en single-page application visa olika React-komponenter beroende på URL. Sidan behöver alltså inte ladda om hela dokumentet varje gång användaren byter vy.",
    "`<Route path=\"/about\" element={<About />} />` betyder att komponenten `About` ska visas när URL:en matchar `/about`.",
    "`BrowserRouter` ger appen routing-funktionalitet och `Routes` innehåller de routes som ska kunna matchas.",
  ],
  "router-p2": [
    "`Link` används för intern navigation i en React Router-app. Exempelvis tar `<Link to=\"/about\">Om oss</Link>` användaren till `/about` utan en full sidladdning.",
    "Det skiljer sig från en vanlig `<a href>` som normalt ber webbläsaren ladda en ny sida från servern.",
    "Använd därför `Link` för navigation mellan vyer i samma React-app och vanliga länkar när du faktiskt ska lämna appen.",
  ],
  "router-p3": [
    "Routes kan innehålla dynamiska delar. En route som `/users/:id` betyder att `id` kan vara olika värden, till exempel `/users/42`.",
    "Inne i komponenten kan `useParams()` användas för att läsa parametern och exempelvis hämta rätt användare.",
    "Det gör att samma komponent kan återanvändas för många olika URL:er i stället för att skapa en separat route för varje användare.",
  ],
  "router-p4": [
    "Router-fel beror ofta på att en komponent använder `Link`, `useNavigate` eller `useParams` utan att ligga under en router-provider.",
    "Kontrollera också att `Route` använder rätt `path` och `element`, och att du skickar en komponentinstans som `element={<About />}`.",
    "När navigationen inte fungerar är URL, router-context och route-definitionerna därför de första sakerna att kontrollera.",
  ],
  "fetch-p1": [
    "`fetch` används för att skicka HTTP-anrop från webbläsaren. `fetch(\"/api/users\")` startar anropet och returnerar en Promise eftersom svaret kommer senare.",
    "Med `await` kan du vänta på svaret: `const response = await fetch(...)`. `response` innehåller bland annat HTTP-status och metoder för att läsa response body.",
    "GET är standardmetoden för fetch och används normalt när du vill hämta data utan att ändra något på servern.",
  ],
  "fetch-p2": [
    "Ett lyckat `fetch`-anrop betyder inte automatiskt att servern svarade med exempelvis status 200. Därför bör du kontrollera `response.ok`.",
    "Om svaret innehåller JSON läser du datan med `await response.json()`. Det är också asynkront eftersom response body måste läsas.",
    "Ett vanligt flöde är därför: await fetch → kontrollera response.ok → await response.json → använd datan.",
  ],
  "fetch-p3": [
    "POST används ofta när klienten vill skicka ny data till servern. Då skickar du ett options-objekt som bland annat innehåller `method`, `headers` och `body`.",
    "JSON-data görs normalt om till en string med `JSON.stringify(data)`, och headern `Content-Type: application/json` berättar för servern vilket format body har.",
    "Servern måste sedan läsa body, validera innehållet och skicka tillbaka ett lämpligt response.",
  ],
  "fetch-p4": [
    "I React kombineras fetch ofta med state. Du kan exempelvis ha state för `data`, `loading` och `error` så att användaren ser vad som händer medan requesten pågår.",
    "Ett typiskt flöde är att sätta loading, göra requesten, spara datan om den lyckas och spara ett felmeddelande om något går fel.",
    "För mer avancerad server-state kan React Query sköta mycket av detta automatiskt, till exempel cache och refetch.",
  ],
  "fetch-p5": [
    "Vanliga fetch-fel är att glömma `await`, glömma kontrollera `response.ok` eller anta att response redan är färdig JSON.",
    "Ett annat vanligt problem är att skicka ett JavaScript-objekt direkt som body när servern förväntar JSON. Då behöver du `JSON.stringify` och rätt Content-Type-header.",
    "Felsök fetch genom att kontrollera URL, metod, statuskod, headers, request body och vad servern faktiskt svarar.",
  ],
  "query-p1": [
    "React Query används för server-state: data som kommer från ett API och som behöver hämtas, cachas och ibland hämtas om.",
    "Du skulle kunna göra allt med `fetch` och flera `useState`, men React Query samlar loading, error, data, cache och refetch i ett gemensamt system.",
    "Det gör särskilt stor skillnad när samma serverdata används på flera ställen eller när du vill undvika onödiga requests.",
  ],
  "query-p2": [
    "En query behöver normalt en `queryKey` och en `queryFn`. `queryKey` identifierar datan i cachen och `queryFn` är funktionen som faktiskt hämtar datan.",
    "Exempelvis kan `queryKey: [\"products\"]` betyda att queryn representerar produktlistan. React Query använder nyckeln för att veta vilken cachepost som hör till vilken data.",
    "Om queryKey ändras betraktas det normalt som en annan query, vilket är användbart för exempelvis olika user-id:n eller filter.",
  ],
  "query-p3": [
    "En query kan vara i olika tillstånd medan den arbetar. I TanStack React Query v5 är `isPending` den tydliga signalen för att queryn ännu inte har lyckad data; `isError` visar fel och `data` finns efter ett lyckat resultat.",
    "I UI:t kan du exempelvis först kontrollera `isPending`, sedan `isError` och till sist rendera `data`. `isFetching` är separat och kan även vara true under en bakgrunds-refetch när gammal data redan finns.",
    "React Query ger dig dessa statusvärden så att du slipper bygga all statuslogik från grunden själv.",
  ],
  "query-p4": [
    "Cache betyder att React Query kan behålla tidigare hämtad serverdata och återanvända den i stället för att alltid börja från noll.",
    "Det kan göra appen snabbare och ge ett bättre användarflöde. Samtidigt behöver data ibland betraktas som gammal och hämtas om.",
    "Det är därför bra att förstå skillnaden mellan data i Reacts lokala state och serverdata som React Query hanterar och synkroniserar.",
  ],
  "jotai-p1": [
    "Jotai bygger globalt eller delat state av små delar som kallas atoms. En atom är ungefär en liten state-behållare som kan läsas av flera komponenter.",
    "`const themeAtom = atom(\"dark\")` skapar en atomdefinition med startvärdet dark. Det aktuella värdet läses av komponenter via Jotais store.",
    "Det är användbart när flera delar av appen behöver samma state och du inte vill skicka värdet genom många nivåer av props.",
  ],
  "jotai-p2": [
    "`useAtom` används i en React-komponent för att läsa och uppdatera en Jotai-atom. Syntaxen liknar `useState`: `const [theme, setTheme] = useAtom(themeAtom)`.",
    "Skillnaden är att värdet kan delas mellan flera komponenter som använder samma atomdefinition i samma store. Separata stores kan ha olika värden för samma atom.",
    "När en komponent uppdaterar atomen kan andra komponenter som läser den reagera på det nya värdet.",
  ],
  "jotai-p3": [
    "Jotai passar när state verkligen behöver delas mellan komponenter som ligger på olika ställen i komponentträdet.",
    "För lokalt state som bara används av en komponent är `useState` ofta enklare. Global state ska alltså inte användas bara för att det går.",
    "En bra tumregel är att börja lokalt och lyfta eller dela state först när flera delar av appen faktiskt behöver samma information.",
  ],
  "zod-p1": [
    "Zod används för att kontrollera att data har den form och de typer som du förväntar dig. Det är viktigt eftersom TypeScript-typer försvinner när programmet körs.",
    "Data från formulär, API:er eller användare kan därför fortfarande vara fel även om din TypeScript-kod kompilerar.",
    "Med ett Zod-schema kan du kontrollera datan vid runtime innan resten av programmet börjar lita på den.",
  ],
  "zod-p2": [
    "Ett Zod-schema byggs av mindre regler. `z.string()` kräver en string, `.min(2)` kräver en minsta längd och `.email()` kontrollerar e-postformat.",
    "Med `z.object({...})` beskriver du vilka properties ett objekt ska ha och vilka regler varje property måste följa.",
    "På så sätt ligger valideringsreglerna samlade i ett schema i stället för utspridda i många if-satser.",
  ],
  "zod-p3": [
    "`parse` och `safeParse` validerar data mot ett schema, men de hanterar fel olika.",
    "`parse` returnerar validerad data när allt är rätt men kastar ett fel om valideringen misslyckas. `safeParse` kastar inte, utan returnerar ett objekt där `success` visar om det gick bra.",
    "`safeParse` är därför ofta bekvämt i formulär där du vill visa användaren valideringsfel utan att använda try/catch.",
  ],
  "zod-p4": [
    "I ett formulär kan du först samla in användarens data och sedan skicka objektet till ett Zod-schema.",
    "Om `safeParse` lyckas kan du använda `result.data`, som nu är validerad. Om det misslyckas kan `result.error` användas för att visa vad användaren behöver rätta.",
    "Det ger ett tydligt flöde: användaren skriver → submit → Zod validerar → skicka vidare endast giltig data.",
  ],
  "forms-p1": [
    "Ett React-formulär fungerar ungefär som ett vanligt HTML-formulär, men du vill ofta själv styra vad som händer när det skickas.",
    "`onSubmit` på `<form>` kör din submit-handler. `event.preventDefault()` stoppar webbläsarens vanliga beteende att ladda om sidan.",
    "Efter det kan du exempelvis validera state, göra ett API-anrop och visa ett resultat utan att lämna React-appen.",
  ],
  "forms-p2": [
    "Ett controlled input betyder att React-state bestämmer inputfältets värde. `value={name}` visar state-värdet och `onChange` uppdaterar state när användaren skriver.",
    "Det skapar en tvådelad koppling: UI läser från state och eventet skriver tillbaka till state.",
    "Fördelen är att komponenten alltid vet vilket värde formuläret innehåller och enkelt kan validera, återställa eller använda det.",
  ],
  "forms-p3": [
    "Ett bra submit-flöde är att först stoppa standard-submit, sedan validera datan och först därefter skicka den till servern.",
    "Om valideringen misslyckas visar du fel för användaren. Om den lyckas kan du göra requesten och hantera loading, success och error.",
    "Det är enklare att felsöka när varje steg har ett tydligt ansvar i stället för att all logik blandas ihop.",
  ],
  "forms-p4": [
    "Vanliga formulärfel är att glömma `preventDefault`, använda `value` utan `onChange`, eller läsa fel property från eventet.",
    "Ett input med `value={name}` men utan en fungerande `onChange` blir i praktiken låst eftersom state aldrig ändras.",
    "Kontrollera därför alltid sambandet mellan state, `value`, `onChange`, submit-handler och eventuell validering.",
  ],
  "props-p1": [
    "Props är data som en parent-komponent skickar till en child-komponent. De gör att samma komponent kan återanvändas med olika innehåll.",
    "`<Greeting name=\"Anna\" />` skickar prop:en `name` till `Greeting`. Komponenten kan sedan läsa den och rendera exempelvis `Hej Anna`.",
    "Props ska normalt behandlas som read-only. Child-komponenten använder värdet men ändrar inte parentens data direkt.",
  ],
  "props-p2": [
    "I TypeScript beskriver du ofta komponentens props med en `type` eller ett `interface`.",
    "Om `type Props = { name: string }` används vet TypeScript att komponenten måste få en string som heter `name`. Fel typ eller saknad obligatorisk prop kan då upptäckas redan när du kodar.",
    "Det gör komponentens API tydligare: typen visar exakt vad den behöver för att kunna användas.",
  ],
  "props-p3": [
    "Props och state är båda data som påverkar UI, men de kommer från olika håll. Props skickas in från en parent, medan state normalt ägs av komponenten själv.",
    "Om parenten bestämmer värdet bör det ofta vara en prop. Om komponenten själv behöver ändra och komma ihåg värdet är state ofta rätt.",
    "I praktiken samarbetar de ofta: en komponent kan få startdata eller callbacks som props och samtidigt ha eget lokalt state.",
  ],
  "databinding-p1": [
    "I React görs databindning i formulär ofta med controlled inputs. State innehåller värdet och inputfältets `value` pekar på samma state.",
    "När användaren skriver körs `onChange`, som uppdaterar state. React renderar sedan inputfältet med det nya state-värdet.",
    "Det kan kännas som tvåvägsbindning, men Reacts grundmodell är fortfarande ett tydligt dataflöde: state → UI och event → state.",
  ],
  "databinding-p2": [
    "Vid `onChange` skickar React ett event till din handler. För ett vanligt textfält finns den nya texten i `e.target.value`.",
    "`onChange={e => setName(e.target.value)}` betyder alltså: när input ändras, läs dess nya värde och spara det i state.",
    "Event-objektet innehåller information om det som hände, medan setter-funktionen är det som faktiskt uppdaterar React-state.",
  ],
  "databinding-p3": [
    "Hela flödet för ett controlled input är: `useState` skapar värdet → `value` visar värdet → användaren skriver → `onChange` körs → setter uppdaterar state → React renderar igen.",
    "Det här är en central React-princip och samma tankesätt används även för selects, checkboxar och andra interaktiva UI-element.",
    "Om inputfältet inte fungerar bör du följa kedjan steg för steg och kontrollera var värdet slutar uppdateras.",
  ],
  "typescript-p1": [
    "TypeScript är JavaScript med ett typsystem ovanpå. Typer hjälper verktygen att hitta många fel innan koden körs.",
    "Om en funktion kräver ett `number` kan TypeScript varna om du försöker skicka en `string`. Det gör stora kodbaser lättare att förstå och refaktorera.",
    "När TypeScript kompileras blir resultatet JavaScript; typerna används främst under utvecklingen och finns normalt inte kvar i browsern.",
  ],
  "typescript-p2": [
    "Vanliga grundtyper är `string`, `number` och `boolean`. Arrays kan exempelvis skrivas `string[]` eller `number[]`.",
    "Typen beskriver vilket slags värde en variabel får innehålla. `let name: string` betyder därför att `name` ska innehålla text.",
    "TypeScript kan ofta själv lista ut typen från startvärdet, så du behöver inte skriva typer överallt manuellt.",
  ],
  "typescript-p3": [
    "`type` och `interface` används ofta för att beskriva formen på objekt. Exempelvis kan en `User` kräva `id`, `name` och `email`.",
    "När en funktion eller komponent tar emot ett sådant objekt kan TypeScript kontrollera att alla nödvändiga properties finns och har rätt typ.",
    "Både `type` och `interface` fungerar bra för många objektfall. Viktigare än valet mellan dem är att typen gör datastrukturen tydlig.",
  ],
  "typescript-p4": [
    "En union type använder `|` för att säga att flera typer eller värden är tillåtna. `string | null` betyder exempelvis att värdet får vara text eller null.",
    "Funktionsparametrar kan också typas: `function greet(name: string)`. Då kan TypeScript kontrollera varje anrop av funktionen.",
    "Unioner är särskilt användbara när ett värde bara får vara ett begränsat antal alternativ, exempelvis `\"loading\" | \"success\" | \"error\"`.",
  ],
  "typescript-p5": [
    "TypeScript-fel betyder ofta att koden inte matchar typen du har lovat. Läs felmeddelandet från början och jämför den förväntade typen med den typ du faktiskt skickar.",
    "Vanliga problem är saknade properties, `undefined`, fel arraytyp eller att en funktion returnerar fel sorts värde.",
    "Försök inte lösa varje fel med `any`. Det tar bort kontrollen och döljer ofta det riktiga problemet i stället för att lösa det.",
  ],
  "hono-p1": [
    "Hono är ett lätt webbframework för att bygga backend-routes och API:er. Du skapar en app och registrerar handlers för olika HTTP-metoder och URL:er.",
    "Frontend-koden skickar requests till dessa routes, och Hono-handlern bestämmer hur servern ska svara.",
    "Det betyder att Hono ligger på serversidan av flödet, medan React normalt ligger på klientsidan.",
  ],
  "hono-p2": [
    "`app.get(\"/api/hello\", handler)` registrerar en GET-route. Handlern körs när servern får en GET-request som matchar den URL:en.",
    "Handlern får ett context-objekt, ofta kallat `c`. Med exempelvis `c.json(...)` kan du skapa ett JSON-response.",
    "Frontend kan sedan använda `fetch(\"/api/hello\")` för att anropa just den endpointen.",
  ],
  "hono-p3": [
    "En POST-route används ofta när klienten skickar data till servern. Servern behöver då läsa request body innan den kan använda datan.",
    "I Hono kan context-objektet användas för att läsa JSON-body. Efter det bör datan normalt valideras innan den sparas eller används.",
    "Flödet blir alltså frontend `fetch` med POST → Hono-route → läs body → validera → skapa response.",
  ],
  "hono-p4": [
    "Servern behöver inte alltid svara med samma statuskod. En lyckad request kan exempelvis ge 200 eller 201, medan fel kan ge 400, 404 eller 500 beroende på situationen.",
    "Hono-contexten används för att skapa response och kan även sätta statuskod.",
    "Frontend kan sedan läsa `response.ok` eller `response.status` och anpassa UI:t efter vad servern svarade.",
  ],
  "hono-p5": [
    "React och Hono möts genom HTTP. React kör på klientsidan och gör exempelvis `fetch(\"/api/users\")`; Hono har en route som tar emot requesten och skickar tillbaka data.",
    "De behöver därför vara överens om URL, HTTP-metod och dataformat.",
    "När integrationen inte fungerar är det bra att felsöka hela kedjan: vad skickar frontend, vilken route träffas, vad läser servern och vilket response kommer tillbaka.",
  ],
  "server-p1": [
    "Klienten är programmet som användaren arbetar med, till exempel React-appen i webbläsaren. Servern är programmet som tar emot requests och skickar tillbaka responses.",
    "Klienten kan be om data eller skicka data. Servern kan exempelvis validera, hämta från en databas eller utföra annan backend-logik.",
    "Det är därför viktigt att skilja på kod som körs i browsern och kod som körs på servern.",
  ],
  "server-p2": [
    "En HTTP request är ett meddelande från klienten till servern. Det innehåller bland annat metod, URL, headers och ibland en body.",
    "GET används oftast för att hämta, POST för att skapa/skicka, PUT/PATCH för att ändra och DELETE för att ta bort.",
    "När du använder `fetch` bygger du i praktiken en HTTP request som sedan skickas över nätverket till servern.",
  ],
  "server-p3": [
    "Ett HTTP response är serverns svar på en request. Det innehåller bland annat statuskod, headers och ofta en body med data.",
    "Statuskoden beskriver resultatet: 2xx betyder normalt framgång, 4xx betyder problem med requesten och 5xx betyder serverfel.",
    "Frontend läser svaret och bestämmer sedan vad användaren ska se, exempelvis data, ett felmeddelande eller en ny vy.",
  ],
  "server-p4": [
    "Hela flödet börjar med att användaren gör något i frontend, till exempel klickar på en knapp. React kan då köra `fetch`, som skickar en HTTP request till servern.",
    "Servern matchar requesten mot en route, kör sin logik och skapar ett response. Browsern tar emot svaret och frontend-koden läser exempelvis JSON-datan.",
    "Till sist sparas datan kanske i React-state och UI:t renderas om. Att kunna följa den kedjan från klick till server och tillbaka är en av de viktigaste sakerna att förstå i en webbapp.",
  ],
};

export function getTheoryExplanation(pageId: string, fallback: string) {
  return theoryExplanations[pageId] ?? [fallback];
}

export function getExampleWalkthrough(pageId: string): string[] {
  return studyLessons[pageId]?.walkthrough ?? [];
}
