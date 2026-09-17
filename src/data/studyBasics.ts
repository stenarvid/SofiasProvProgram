// Short prerequisite explanations, shown on each subject's pages before practice.
export const studyBasics: Record<string, string[]> = {
  react: [
    "HTML beskriver sidans element: h1 är en huvudrubrik, p ett textstycke och button en knapp. JSX liknar HTML men skrivs i JavaScript/TypeScript; filer med JSX och TypeScript har ändelsen .tsx. function Hello() definierar en funktion och return lämnar tillbaka dess resultat. <Hello /> låter React använda den som komponent.",
    "const name = 'Sofia' skapar en variabel med en sträng. I JSX läser {name} variabeln medan text utan klamrar visas bokstavligt. En callback är en funktion som lämnas till annan kod för senare anrop: onClick={handleClick} väntar på klick, medan handleClick() anropas direkt. Hooks som useState anropas högst upp i en komponent eller egen hook, inte i villkor eller eventhandlers.",
    "Exemplen förutsätter ett befintligt React + TypeScript-projekt. I ett eget övningsprojekt visar startfilen normalt App; en komponentdefinition ensam syns inte. Vite sköter utvecklingsserver och bygger JavaScript/CSS för webbläsaren. Det skapar inte ett API. Editorn här sparar dina svar; den installerar eller startar inte ett nytt projekt åt dig."
  ],
  state: [
    "useState ger ett par: [aktuelltVärde, setter]. Hakparenteserna packar upp paret, så const [count, setCount] = useState(0) ger ett tal och en funktion. Settern begär nästa värde; nuvarande rendering behåller sin ögonblicksbild. Varje monterad komponentinstans har sitt eget lokala state.",
    "En arrow-funktion som prev => prev + 1 tar en parameter och returnerar ett uttryck. Med klamrar behövs return: prev => { return prev + 1; }. ! byter true och false, villkor ? a : b väljer mellan två värden, och boolean && JSX visar innehåll när boolean är true. React renderar inte false som synlig text.",
    "För objekt och arrayer i state skapar du normalt ett nytt värde: setUser(prev => ({ ...prev, name: 'Sofia' })) eller setItems(prev => [...prev, newItem]). Spread (...) kopierar de befintliga fälten eller elementen; det är en ytlig kopia. Undvik att mutera det gamla state-objektet och skicka tillbaka samma referens."
  ],
  components: [
    "En komponent definierar en återanvändbar UI-del. Props är fälten i objektet den tar emot. function Card({ title }: { title: string }) plockar ut title ur props och anger dess typ. <Card title='Bok' /> skickar in värdet. Komponenten måste både vara tillgänglig och användas i JSX för att synas.",
    "En modul är en fil med import eller export. En standardexport importeras utan klamrar; en namngiven export importeras med klamrar. './Button' är en relativ filsökväg. Kommentarer med filnamn i exemplen visar hur du delar upp koden; de skapar inte riktiga filer i editorn."
  ],
  router: [
    "En frontend-route kopplar en URL till en vy. Den skickar inte i sig ett API-anrop. Kursen använder den deklarativa varianten i installerade react-router-dom: en BrowserRouter ger context, Routes väljer route och Route kopplar path till element. En komponent som använder Link eller useParams behöver finnas under routern.",
    "Link använder to för måladressen; Route använder path för matchning. :id är ett dynamiskt segment och useParams läser det som text. Direkt besök eller omladdning på /about går först till webbservern, som behöver kunna leverera appens HTML på den adressen."
  ],
  fetch: [
    "En Promise beskriver ett framtida resultat eller fel. En async-funktion returnerar alltid en Promise. await pausar den funktionens fortsättning tills resultatet finns; den blockerar inte hela webbläsaren. then använder ett lyckat resultat, catch hanterar ett fel och finally kör städning efter båda utfallen.",
    "fetch ger först ett Response med status och body. response.json() läser body asynkront och tolkar JSON-text som ett JavaScript-värde. HTTP 404 och 500 rejectar inte fetch i sig; kontrollera ok. throw avslutar den normala vägen med ett fel som anroparen kan fånga.",
    "API-exemplen är kontrakt, inte en inbyggd backend. GET /api/users förutsätts ge [{ id: 1, name: 'Sofia' }]. En relativ adress använder sidans origin; en separat backend behöver rätt adress eller proxy. Kontrollera verklig nätverksdata om den inte kan antas följa formatet."
  ],
  query: [
    "TanStack React Query v5 hanterar serverdata runt en funktion som hämtar den. QueryClient håller cachen och QueryClientProvider gör klienten tillgänglig för komponenterna. Skapa inte en ny klient vid varje rendering. queryKey är en array som identifierar datan; queryFn ska vara en funktion, inte resultatet av ett omedelbart anrop.",
    "För en användarlista anger Promise<User[]> det förväntade returformatet; det validerar inte JSON vid körning. data.map(user => ...) omvandlar arrayens element till JSX, och key={user.id} hjälper React identifiera syskon över renderingar. Queryns nyckel och JSX-key har olika uppgifter.",
    "En queryFn behöver kasta eller returnera en avvisad Promise för att Query ska upptäcka ett fel; därför behövs ok-kontrollen med fetch. Standardinställningar kan göra flera försök innan felvyn visas. staleTime anger hur länge data är färsk, inte ett intervall för polling."
  ],
  jotai: [
    "atom('dark') skapar en definition av state. Värdet finns i en store; komponenter delar det när de använder samma atomdefinition och store. Här används Jotais standard-store utan en egen Provider. Separata providers kan isolera värdena.",
    "useAtom på en skrivbar atom ger [värde, setter]. Anropa hooken i komponenten och definiera atomen stabilt, här utanför komponenten. En temasträng ändrar inte färger av sig själv; UI måste använda värdet i text, klasser eller annan presentation. Varken useState eller en vanlig atom sparar automatiskt efter omladdning."
  ],
  zod: [
    "Exemplen använder projektets Zod 3. z.object beskriver ett objekts fält och z.string kräver text. Kedjade regler som .min(8) lägger ytterligare krav på just det fältet. Ett schema är körbar kod; det validerar först när du anropar exempelvis parse eller safeParse.",
    "safeParse ger antingen { success: true, data } eller { success: false, error }. if (result.success) skiljer grenarna så att TypeScript vet vilket fält som finns. parse returnerar data men kastar vid valideringsfel. unknown betyder att värdet måste kontrolleras före användning; as är en typassertion, inte en konvertering eller validering.",
    "Validering och JSON-parsning är olika steg: giltig JSON kan innehålla fel fält. Använd result.data efter lyckad validering, särskilt när schemat transformerar data med exempelvis trim. Klientvalidering hjälper användaren; servern behöver också kontrollera sin input."
  ],
  forms: [
    "form samlar fält och skickas via sin onSubmit-handler. En button i ett formulär är normalt submit om du inte anger en annan typ. preventDefault stoppar webbläsarens vanliga formulärnavigation, inte händelsens spridning och inte valideringsfel i din egen kod.",
    "Ett controlled textfält visar value från state och uppdaterar samma state i onChange. Ett uncontrolled fält kan få ett startvärde via defaultValue. required och type='email' ger webbläsarkontroller före vanlig submit; noValidate stänger av just dem, inte din egen Zod-kod.",
    "När en egen regel misslyckas visar du fel och returnerar innan requesten. Att bara visa ett meddelande stoppar inte funktionen. Håll isär sparar, lyckat och fel och kontrollera response.ok före framgångsmeddelandet."
  ],
  props: [
    "Props är indata från den som använder komponenten. Parent betyder föräldern som renderar child. function Greeting({ name }: Props) plockar ut name ur props-objektet; kolon anger TypeScript-typen. I JSX skickar name='Sofia' text och age={20} ett tal.",
    "En property med ? kan utelämnas. Ett standardvärde i destructuring används när värdet är undefined. Props ska behandlas som read-only. Ett barn kan be sin parent göra något genom en callback-prop; () => void beskriver här en funktion utan parametrar vars returvärde inte används."
  ],
  databinding: [
    "Textfältets value läser state och onChange får en händelse med den nya texten i e.target.value. Settern begär nästa rendering. Det är två uttryckliga kopplingar, inte automatisk tvåvägsbindning. Ett p-element kan läsa samma state utan att fråga inputens DOM efter text.",
    "Checkboxar styrs med checked och läses med e.target.checked, som är boolean. Ett vanligt inputs value är en sträng även för type='number'; välj och kontrollera en konvertering när state ska vara ett tal. valueAsNumber kan ge NaN för ett tomt eller ogiltigt numeriskt fält."
  ],
  typescript: [
    "En variabel håller ett värde; const hindrar att variabeln tilldelas ett annat värde. Objektets fält och arrayens innehåll blir inte automatiskt oföränderliga. string, number och boolean är olika typer; '20' och 20 är därför olika värden och typer. Kolon anger en typ, likhetstecken tilldelar ett värde.",
    "function birthday(age: number): number har en parameter och en returtyp. En array som number[] har tal som element; map skapar en ny array genom att anropa en callback för varje element. type och interface kan beskriva objekt. ? gör ett fält valfritt, | anger en union och ?? väljer ett reservvärde när vänstersidan är null eller undefined.",
    "TypeScript gör statisk kontroll före körning och tar normalt bort typerna när JavaScript skapas. unknown behöver kontrolleras, till exempel med typeof; any stänger av mycket av kontrollen. as påstår en typ men ändrar inte värdet. En typ på API-data garanterar inte att serverns JSON har rätt form."
  ],
  hono: [
    "Hono är här serverns webbframework. new Hono skapar appen; app.get eller app.post registrerar en handler för metod och sökväg. c är context för en request. c.req.json() läser inkommande JSON; c.json(data, status) skapar ett utgående Response. Handlern måste returnera svaret.",
    "Serverkoden och React-klienten är separata program. export default app startar inte automatiskt en serverport. I ett eget serverprojekt används runtime-specifik startkod. För att prova en Hono-handler utan nätverksserver kan du använda await app.request('/api/hello') och sedan läsa Response-status och json().",
    "En array i serverprocessen är bara minneslagring. Den försvinner när processen startar om och ersätter inte en databas. Validera även på servern: webbläsarens formulärkontroller kan kringgås av andra klienter."
  ],
  server: [
    "Klienten, exempelvis en webbläsare, skickar en HTTP-request. Servern tar emot den och väljer en handler utifrån metod och sökväg. Requesten kan ha headers med metadata och en body med innehåll. Servern skickar ett Response med status, headers och eventuell body.",
    "GET läser normalt data. POST används här för att skapa eller skicka data till en samling. Status 200 betyder OK, 201 skapad resurs, 400 felaktig request och 404 saknad resurs. 500 betyder ett oväntat internt fel; en process som kraschar helt kanske inte kan svara alls.",
    "JSON är ett textformat för data, inte en databas. JSON.stringify serialiserar ett JavaScript-värde till text; response.json() läser och tolkar svarets text asynkront. Servern uppdaterar inte React-state direkt: klienten läser svaret och använder det för att uppdatera sitt eget UI."
  ]
};
