import { getLessonPageContent } from "./studyLessons";

/**
 * Topic order, page metadata and exercises live here.
 * Worked examples, walkthroughs and quizzes live in studyLessons*.ts.
 *
 * To add a subject:
 * 1. Copy one object inside `studyTopics`.
 * 2. Give it a unique `slug`.
 * 3. Change `title` and `summary`.
 * 4. Add pages and corresponding entries in studyLessons*.ts.
 * 5. Connect their examples/questions with getLessonPageContent(pageId).
 *
 * The left-hand subject menu, page counter, Previous/Next navigation,
 * page-specific cheat sheet, page quiz, and page code exercise are all
 * generated automatically from this data.
 */

export type StudyQuiz = {
  question: string;
  options: [string, string, string, string] | string[];
  answer: number;
  explanation?: string;
};

export type StudyPage = {
  /** Stable unique id, e.g. "redux-p1". Do not reuse an id from another page. */
  id: string;
  title: string;
  intro: string;
  bullets: string[];
  code: string;
  quiz: StudyQuiz;
  cheat: string[];
  codeTask: string;
};

export type StudyTopic = {
  /** URL/data-friendly unique id, e.g. "react-query" */
  slug: string;
  title: string;
  summary: string;
  pages: StudyPage[];
};

export const studyTopics: StudyTopic[] = [
{
      slug: "react",
      title: "React",
      summary: "Komponenter, JSX och rendering.",
      pages: [
        {
          id: "react-p1",
          title: "Vad är React?",
          intro: "React är ett JavaScript-bibliotek för att bygga interaktiva användargränssnitt med återanvändbara komponenter.",
          bullets: ["React delar upp UI i komponenter.", "När data ändras kan React rendera om UI.", "Komponentnamn börjar med stor bokstav."],
          ...getLessonPageContent("react-p1"),
          cheat: ["React = UI-bibliotek", "UI delas upp i komponenter", "Ändrad data kan leda till ny rendering"],
          codeTask: "Skapa en React-komponent Hello som returnerar en h1 med texten Hej!."
        },{
          id: "react-p2",
          title: "JSX och rendering",
          intro: "JSX låter dig beskriva UI med HTML-liknande syntax direkt i JavaScript/TypeScript.",
          bullets: ["JavaScript-uttryck skrivs inom { }.", "class heter className i JSX.", "En komponent returnerar normalt JSX."],
          ...getLessonPageContent("react-p2"),
          cheat: ["{ expression } kör JavaScript i JSX", "Använd className", "Returnera ett överordnat element/Fragment"],
          codeTask: "Skapa en variabel name och visa den inuti ett p-element med JSX."
        },{
          id: "react-p3",
          title: "Komponenter och komposition",
          intro: "Större React-sidor byggs genom att mindre komponenter kombineras.",
          bullets: ["En komponent bör ha tydligt ansvar.", "Komponenter kan rendera andra komponenter.", "Små delar är lättare att återanvända."],
          ...getLessonPageContent("react-p3"),
          cheat: ["Komposition = komponenter inuti komponenter", "Dela upp ansvar", "Återanvänd delar"],
          codeTask: "Skapa App som renderar komponenterna Header och Footer."
        },{
          id: "react-p4",
          title: "Vanliga fel och repetition",
          intro: "Vanliga React-fel är ofta små JSX- eller komponentmisstag.",
          bullets: ["Returnera namn, titel och knapp i ett gemensamt element.", "Skapa knappen med <button type=\"button\">Visa profil</button>.", "Koppla klicket med onClick={handleClick}, utan att anropa funktionen direkt.", "Visa komponenten genom att skriva <Profile /> i App.", "Använd className för CSS-klasser och stor bokstav för egna komponenter."],
          ...getLessonPageContent("react-p4"),
          cheat: ["<button>Text</button> visar en knapp", "onClick={handleClick} kör funktionen vid klick", "<Profile /> visar profilen i App", "return behövs och komponentnamn börjar med stor bokstav", "className kopplar till en CSS-klass"],
          codeTask: "Skriv en Profile-komponent med namn, titel och knapp."
        }
      ]
    },
{
      slug: "state",
      title: "State",
      summary: "Data som förändras och uppdaterar UI.",
      pages: [
        {
          id: "state-p1",
          title: "Vad är state?",
          intro: "State är data som komponenten själv håller reda på och som kan ändras medan appen används.",
          bullets: ["State passar för värden som ändras.", "State-ändringar kan orsaka re-render.", "Props och state är inte samma sak."],
          ...getLessonPageContent("state-p1"),
          cheat: ["State = ändringsbar komponentdata", "Setter uppdaterar state", "UI kan renderas om"],
          codeTask: "Skapa state isOpen med startvärdet false."
        },{
          id: "state-p2",
          title: "useState",
          intro: "useState returnerar det aktuella värdet och en setter-funktion.",
          bullets: ["Första delen är värdet.", "Andra delen är setter-funktionen.", "Argumentet är startvärdet."],
          ...getLessonPageContent("state-p2"),
          cheat: ["[värde, setter]", "useState(0) startar på 0", "Ändra via setter"],
          codeTask: "Gör en counter som börjar på 5 och ökar med 1."
        },{
          id: "state-p3",
          title: "Functional updates",
          intro: "När nytt state beror på gammalt state är functional update ofta säkrast.",
          bullets: ["prev representerar föregående state.", "Bra vid flera snabba uppdateringar.", "Undviker beroende på en gammal closure."],
          ...getLessonPageContent("state-p3"),
          cheat: ["Använd prev när nästa värde bygger på föregående", "Ändra inte state direkt", "Functional update: setCount(prev => prev + 1)"],
          codeTask: "Gör två funktionella uppdateringar så count ökar med 2."
        },{
          id: "state-p4",
          title: "State i formulär och UI",
          intro: "State används ofta för inputfält, toggles, selected values och loading-status.",
          bullets: ["Controlled inputs använder state.", "Boolean state passar för öppna/stängda element.", "State bör ligga där det behövs."],
          ...getLessonPageContent("state-p4"),
          cheat: ["Inputvärden", "UI-status", "Valda objekt"],
          codeTask: "Skapa state name och bind det till ett inputfält."
        },{
          id: "state-p5",
          title: "Vanliga state-fel",
          intro: "State ska uppdateras genom Reacts setter-funktioner.",
          bullets: ["Ändra inte count direkt.", "onClick ska få en funktion.", "Skapa inte onödigt state för konstanter."],
          ...getLessonPageContent("state-p5"),
          cheat: ["Setter i callback", "Direkt mutation är fel", "Skilj state från props"],
          codeTask: "Bygg en counter med +1 och -1 utan direkt mutation."
        }
      ]
    },
{
      slug: "components",
      title: "Components",
      summary: "Återanvändbara byggblock.",
      pages: [
        {
          id: "components-p1",
          title: "Komponentens ansvar",
          intro: "En komponent är en avgränsad del av UI:t med ett tydligt ansvar.",
          bullets: ["Små komponenter är lättare att förstå.", "De kan återanvändas.", "De kan ta emot props."],
          ...getLessonPageContent("components-p1"),
          cheat: ["Tydligt ansvar", "Återanvändning", "Lättare underhåll"],
          codeTask: "Skapa ProductCard som tar title och price som props och visar dem i ett article med rubrik och pristext."
        },{
          id: "components-p2",
          title: "Export, import och användning",
          intro: "Komponenter kan ligga i olika filer och importeras där de används.",
          bullets: ["export default exporterar standardvärdet.", "import hämtar komponenten.", "Komponenten används som ett JSX-element."],
          ...getLessonPageContent("components-p2"),
          cheat: ["export från källfil", "import i användande fil", "<UserCard /> renderar"],
          codeTask: "Skriv Button.tsx med en standardexporterad Button som visar en knapp. Skriv sedan importen och <Button /> i App.tsx. Markera de två filerna med kommentarer som i exemplet."
        },{
          id: "components-p3",
          title: "Komposition och uppdelning",
          intro: "Komposition betyder att flera komponenter kombineras till större UI.",
          bullets: ["Parent kan rendera child-komponenter.", "Upprepad UI passar ofta i egen komponent.", "För stora komponenter kan delas upp."],
          ...getLessonPageContent("components-p3"),
          cheat: ["Komponera små delar", "Bryt ut återanvändbara sektioner", "Undvik onödigt stora komponenter"],
          codeTask: "Dela upp en sida i Header, MainContent och Footer."
        }
      ]
    },
{
      slug: "router",
      title: "React Router",
      summary: "Navigation och URL-baserade vyer.",
      pages: [
        {
          id: "router-p1",
          title: "Routing-grunder",
          intro: "Routing kopplar URL:er till olika vyer i en single-page application.",
          bullets: ["BrowserRouter ger routing-context.", "Routes innehåller Route.", "Route använder path och element."],
          ...getLessonPageContent("router-p1"),
          cheat: ["BrowserRouter", "Routes", "Route path + element"],
          codeTask: "Skapa routes för / och /about."
        },{
          id: "router-p2",
          title: "Navigation med Link",
          intro: "Link navigerar inom React Router utan full sidladdning.",
          bullets: ["to anger destination.", "Link är bättre än a för intern SPA-navigation.", "URL:en uppdateras."],
          ...getLessonPageContent("router-p2"),
          cheat: ["Link + to", "Intern navigation", "Undvik full reload"],
          codeTask: "Skapa två Link-element: / och /contact."
        },{
          id: "router-p3",
          title: "Parametrar och struktur",
          intro: "Routes kan innehålla parametrar och mer avancerad struktur.",
          bullets: ["Dynamiska segment skrivs ofta :id.", "useParams kan läsa parametrar.", "Routes kan organiseras efter sida."],
          ...getLessonPageContent("router-p3"),
          cheat: ["Dynamiska segment", "useParams", "Tänk URL → vy"],
          codeTask: "Skapa route /products/:id."
        },{
          id: "router-p4",
          title: "Vanliga Router-fel",
          intro: "De vanligaste felen är fel props eller saknad router-context.",
          bullets: ["Använd path och element i modern Router.", "Glöm inte BrowserRouter.", "Använd Link för intern navigation."],
          ...getLessonPageContent("router-p4"),
          cheat: ["path, inte url", "element, inte äldre component-prop", "BrowserRouter runt appen"],
          codeTask: "Fixa: <Route url=\"/about\" component={<About />} />."
        }
      ]
    },
{
      slug: "fetch",
      title: "Fetch",
      summary: "HTTP-anrop från frontend.",
      pages: [
        {
          id: "fetch-p1",
          title: "GET med fetch",
          intro: "fetch skickar ett HTTP-anrop och returnerar en Promise med ett Response.",
          bullets: ["GET är standardmetoden.", "await väntar på Promise.", "Response innehåller status och body."],
          ...getLessonPageContent("fetch-p1"),
          cheat: ["fetch → Promise", "await Response", "GET är standard"],
          codeTask: "Skriv getUsers som anropar /api/users."
        },{
          id: "fetch-p2",
          title: "JSON och response.ok",
          intro: "Efter svaret behöver du ofta kontrollera status och läsa JSON.",
          bullets: ["response.ok är false vid t.ex. 404/500.", "response.json() är en funktion.", "JSON-parsning är asynkron."],
          ...getLessonPageContent("fetch-p2"),
          cheat: ["Kontrollera ok", "Anropa json()", "Hantera errors"],
          codeTask: "Skriv en async getUsers som hämtar /api/users, kastar ett fel när response.ok är false och returnerar den lästa JSON-datan."
        },{
          id: "fetch-p3",
          title: "POST och request body",
          intro: "POST används ofta när klienten skickar ny data till servern.",
          bullets: ["method anger HTTP-metod.", "Content-Type beskriver JSON.", "JSON.stringify gör objekt till JSON-text."],
          ...getLessonPageContent("fetch-p3"),
          cheat: ["POST", "headers", "body", "JSON.stringify"],
          codeTask: "Skicka { title: 'Hej' } till /api/posts med POST."
        },{
          id: "fetch-p4",
          title: "Fetch i React",
          intro: "Datahämtning kombineras ofta med state för loading, data och error.",
          bullets: ["Spara data i state.", "Visa loading medan request pågår.", "Visa fel på ett begripligt sätt."],
          ...getLessonPageContent("fetch-p4"),
          cheat: ["loading", "data", "error", "state"],
          codeTask: "Skissa en komponent som hämtar users och visar Laddar... under tiden."
        },{
          id: "fetch-p5",
          title: "Vanliga Fetch-fel",
          intro: "Många fetch-buggar är små men viktiga.",
          bullets: ["response.json måste anropas.", "HTTP-fel kräver egen kontroll.", "await behövs när du vill använda resultatet."],
          ...getLessonPageContent("fetch-p5"),
          cheat: ["json() med parenteser", "ok-kontroll", "await där det behövs"],
          codeTask: "Fixa: return response.json;"
        }
      ]
    },
{
      slug: "query",
      title: "React Query",
      summary: "Server state, cache och request-status.",
      pages: [
        {
          id: "query-p1",
          title: "Varför React Query?",
          intro: "React Query hanterar server state runt själva datahämtningen.",
          bullets: ["Cache minskar onödiga requests.", "Loading/error-status hanteras tydligt.", "Data kan refetchas."],
          ...getLessonPageContent("query-p1"),
          cheat: ["Server state", "Cache", "Loading/error", "Refetch"],
          codeTask: "Skapa en useQuery för users."
        },{
          id: "query-p2",
          title: "queryKey och queryFn",
          intro: "queryKey identifierar datan i cachen och queryFn hämtar den.",
          bullets: ["queryKey bör beskriva datan.", "queryFn returnerar Promise/data.", "Parametrar kan ingå i queryKey."],
          ...getLessonPageContent("query-p2"),
          cheat: ["queryKey = identitet", "queryFn = hämtning", "queryKey ska innehålla värden som queryFn beror på"],
          codeTask: "Gör en query med nyckeln ['products']."
        },{
          id: "query-p3",
          title: "Status och rendering",
          intro: "Query-resultatet ger data och status som UI:t kan reagera på.",
          bullets: ["isPending betyder pending-status utan lyckat resultat.", "isError och error beskriver queryns fel.", "data används på success-grenen.", "isFetching visar pågående hämtning, även i bakgrunden.", "isLoading är isPending och isFetching samtidigt i v5."],
          ...getLessonPageContent("query-p3"),
          cheat: ["Kontrollera isPending, sedan isError, sedan data", "isFetching kan gälla bakgrundshämtning", "isLoading = isPending && isFetching"],
          codeTask: "Visa loading, error och sedan users-listan från en query."
        },{
          id: "query-p4",
          title: "Cache och repetition",
          intro: "Cachen är en central anledning att använda React Query.",
          bullets: ["Samma queryKey kan återanvända data.", "Refetch kan uppdatera data.", "Server state skiljer sig från lokalt UI-state."],
          ...getLessonPageContent("query-p4"),
          cheat: ["Cache kopplas till queryKey", "Refetch uppdaterar", "Skilj server state från UI-state"],
          codeTask: "Förklara när du skulle välja React Query istället för enbart useState + fetch."
        }
      ]
    },
{
      slug: "jotai",
      title: "Jotai",
      summary: "Delat globalt state med atoms.",
      pages: [
        {
          id: "jotai-p1",
          title: "Atoms",
          intro: "En atom är en liten state-enhet som kan delas mellan komponenter.",
          bullets: ["atom(startvärde) skapar state.", "Atomen definieras utanför komponenten.", "Flera komponenter kan använda samma atom."],
          ...getLessonPageContent("jotai-p1"),
          cheat: ["atom(value)", "Delbart state", "Definieras utanför komponent"],
          codeTask: "Skapa themeAtom med startvärdet 'dark'."
        },{
          id: "jotai-p2",
          title: "useAtom",
          intro: "useAtom läser och uppdaterar en atom ungefär som useState.",
          bullets: ["Returnerar värde och setter.", "Samma atom ger delat state.", "Komponenter uppdateras när atomvärdet ändras."],
          ...getLessonPageContent("jotai-p2"),
          cheat: ["useAtom(atom)", "[value, setter]", "Delas mellan komponenter"],
          codeTask: "Använd themeAtom i en komponent och lägg till knapp som byter tema."
        },{
          id: "jotai-p3",
          title: "När Jotai passar",
          intro: "Globalt state behövs inte för allt.",
          bullets: ["useState passar lokalt state.", "Jotai passar state som delas långt mellan komponenter.", "Undvik globalisering utan behov."],
          ...getLessonPageContent("jotai-p3"),
          cheat: ["Lokalt vs delat", "Minimera prop drilling", "Använd rätt verktyg"],
          codeTask: "Beskriv ett exempel där Jotai är bättre än att skicka props genom fyra komponentnivåer."
        }
      ]
    },
{
      slug: "zod",
      title: "Zod",
      summary: "Runtime-validering av data.",
      pages: [
        {
          id: "zod-p1",
          title: "Varför Zod?",
          intro: "TypeScript kontrollerar typer under utveckling; Zod kan validera verklig data när programmet körs.",
          bullets: ["Bra för formulär och API-data.", "Skyddar mot felaktig extern data.", "Schema beskriver krav."],
          ...getLessonPageContent("zod-p1"),
          cheat: ["Runtime", "Extern data", "Schemas"],
          codeTask: "Skapa ett Zod-schema med username:string."
        },{
          id: "zod-p2",
          title: "Regler i schema",
          intro: "Zod kan kontrollera mer än grundtypen.",
          bullets: ["min för minsta längd.", "email för e-postformat.", "number för numeriska värden."],
          ...getLessonPageContent("zod-p2"),
          cheat: ["string().min", "string().email", "number"],
          codeTask: "Skapa schema för password med minst 8 tecken."
        },{
          id: "zod-p3",
          title: "parse och safeParse",
          intro: "parse kastar fel vid invalid data, safeParse returnerar ett resultatobjekt.",
          bullets: ["safeParse ger success true/false.", "Vid success finns validerad data.", "Vid failure finns error."],
          ...getLessonPageContent("zod-p3"),
          cheat: ["safeParse", "result.success", "result.data/error"],
          codeTask: "Validera ett user-objekt med safeParse och kontrollera success."
        },{
          id: "zod-p4",
          title: "Zod med formulär",
          intro: "Zod passar bra i submit-flödet innan data skickas till servern.",
          bullets: ["Läs form state.", "safeParse datan.", "Skicka endast giltig data."],
          ...getLessonPageContent("zod-p4"),
          cheat: ["Form state", "safeParse", "Visa valideringsfel"],
          codeTask: "Skissa handleSubmit som validerar name/email innan fetch."
        }
      ]
    },
{
      slug: "forms",
      title: "Forms",
      summary: "Submit, controlled inputs och validering.",
      pages: [
        {
          id: "forms-p1",
          title: "Form och onSubmit",
          intro: "React-formulär hanteras vanligtvis via formens onSubmit.",
          bullets: ["preventDefault stoppar full sidreload.", "Submit-logik samlas i en handler.", "Knappen kan ha type='submit'."],
          ...getLessonPageContent("forms-p1"),
          cheat: ["onSubmit", "preventDefault", "submit button"],
          codeTask: "Skapa ett form med onSubmit och en submit-knapp."
        },{
          id: "forms-p2",
          title: "Controlled inputs",
          intro: "Ett controlled input hämtar sitt värde från React state och skriver tillbaka via onChange.",
          bullets: ["value från state.", "onChange uppdaterar state.", "UI och data hålls synkade."],
          ...getLessonPageContent("forms-p2"),
          cheat: ["value", "onChange", "e.target.value"],
          codeTask: "Gör name-input controlled."
        },{
          id: "forms-p3",
          title: "Validering och submit-flöde",
          intro: "Ett komplett formulär validerar innan data skickas.",
          bullets: ["Samla state.", "Validera.", "Visa fel eller skicka fetch.", "Hantera success/error."],
          ...getLessonPageContent("forms-p3"),
          cheat: ["State", "Validering", "Fetch", "Feedback"],
          codeTask: "Bygg name + email-form och validera innan submit."
        },{
          id: "forms-p4",
          title: "Vanliga formulärfel",
          intro: "Formulärbuggar uppstår ofta av saknad binding eller fel submit-flöde.",
          bullets: ["Glöm inte preventDefault.", "Undvik okontrollerad blandning av value/defaultValue.", "Visa valideringsfel tydligt."],
          ...getLessonPageContent("forms-p4"),
          cheat: ["Controlled input behöver onChange", "Submit via form", "Visa errors"],
          codeTask: "Fixa ett input som har value={name} men saknar onChange."
        }
      ]
    },
{
      slug: "props",
      title: "Props",
      summary: "Data från parent till child.",
      pages: [
        {
          id: "props-p1",
          title: "Props-grunder",
          intro: "Props är indata som en parent skickar till en child-komponent.",
          bullets: ["Props är read-only i child.", "De gör komponenter återanvändbara.", "Olika props ger olika rendering."],
          ...getLessonPageContent("props-p1"),
          cheat: ["Parent → child", "Read-only", "Återanvändning"],
          codeTask: "Skapa Greeting som tar name-prop."
        },{
          id: "props-p2",
          title: "Props med TypeScript",
          intro: "En Props-type dokumenterar och kontrollerar komponentens indata.",
          bullets: ["Obligatoriska properties saknar ?.", "Optional properties använder ?.", "Typer hindrar många fel."],
          ...getLessonPageContent("props-p2"),
          cheat: ["Props type", "Optional ?", "Destructuring"],
          codeTask: "Skapa typen Props för Product med title:string och price:number. Använd typen i en Product-komponent och visa ett anrop med ett numeriskt pris."
        },{
          id: "props-p3",
          title: "Props vs state",
          intro: "Props och state fyller olika roller.",
          bullets: ["Props kommer utifrån.", "State ägs av komponenten.", "Child bör inte mutera props."],
          ...getLessonPageContent("props-p3"),
          cheat: ["Props = input", "State = lokal ändringsbar data", "Props behandlas som read-only"],
          codeTask: "Förklara med ett exempel när något bör vara prop istället för state."
        }
      ]
    },
{
      slug: "databinding",
      title: "Databindning",
      summary: "Input ↔ state i React.",
      pages: [
        {
          id: "databinding-p1",
          title: "Controlled databindning",
          intro: "React använder ofta controlled components för databindning.",
          bullets: ["value läser från state.", "onChange skriver nytt värde till state.", "Ny state renderar UI igen."],
          ...getLessonPageContent("databinding-p1"),
          cheat: ["value", "onChange", "state"],
          codeTask: "Bind ett city-input till city-state."
        },{
          id: "databinding-p2",
          title: "Event och e.target.value",
          intro: "Eventobjektet innehåller information om det input som ändrades.",
          bullets: ["e.target är elementet.", "e.target.value är textvärdet.", "Setter sparar värdet i state."],
          ...getLessonPageContent("databinding-p2"),
          cheat: ["event", "target", "value"],
          codeTask: "Skriv onChange för email-state."
        },{
          id: "databinding-p3",
          title: "Hela flödet",
          intro: "Databindning är en cykel mellan UI och state.",
          bullets: ["Input visar state.", "Användaren ändrar input.", "onChange ändrar state.", "React renderar nya värdet."],
          ...getLessonPageContent("databinding-p3"),
          cheat: ["State är source of truth", "UI speglar state", "onChange uppdaterar state"],
          codeTask: "Bygg input + p som visar samma name live."
        }
      ]
    },
{
      slug: "typescript",
      title: "TypeScript",
      summary: "Typer, objekt och felsökning.",
      pages: [
        {
          id: "typescript-p1",
          title: "Varför TypeScript?",
          intro: "TypeScript lägger statisk typkontroll ovanpå JavaScript.",
          bullets: ["Fel hittas före runtime.", "IntelliSense blir bättre.", "Kodens kontrakt blir tydligare."],
          ...getLessonPageContent("typescript-p1"),
          cheat: ["Typer", "Tidigare fel", "Bättre editorstöd"],
          codeTask: "Typa variablerna name:string, age:number och active:boolean."
        },{
          id: "typescript-p2",
          title: "Grundtyper och arrays",
          intro: "Vanliga typer är string, number, boolean och arrays.",
          bullets: ["string för text.", "number för tal.", "boolean för true/false.", "User[] för array av User."],
          ...getLessonPageContent("typescript-p2"),
          cheat: ["string", "number", "boolean", "T[]"],
          codeTask: "Skapa numbers:number[] med tre tal."
        },{
          id: "typescript-p3",
          title: "type och interface",
          intro: "Objektstrukturer kan beskrivas med type eller interface.",
          bullets: ["Properties får egna typer.", "? gör property optional.", "Samma typ kan återanvändas."],
          ...getLessonPageContent("typescript-p3"),
          cheat: ["type/interface", "Properties", "Optional ?"],
          codeTask: "Skapa type Product med id, title, price och optional description."
        },{
          id: "typescript-p4",
          title: "Union och funktionsparametrar",
          intro: "Union types beskriver flera tillåtna typer eller värden.",
          bullets: ["type Status = \"idle\" | \"loading\" | \"done\";", "Union betyder att flera specificerade alternativ är tillåtna.", "function greet(name: string): string {\n  return `Hej ${name}`;\n}"],
          ...getLessonPageContent("typescript-p4"),
          cheat: ["Union", "Parametertyper", "Returtyp"],
          codeTask: "Skapa type Role = 'admin' | 'user'."
        },{
          id: "typescript-p5",
          title: "TypeScript-fel och repetition",
          intro: "Att kunna läsa felmeddelanden är viktigare än att memorera alla typer.",
          bullets: ["Läs vilken typ som förväntas.", "Jämför med typen du skickar.", "Fixa orsaken, inte bara cast:a bort felet."],
          ...getLessonPageContent("typescript-p5"),
          cheat: ["Expected vs actual type", "Undvik onödiga any", "Läs felmeddelandet"],
          codeTask: "Rätta dessa tre deklarationer utan any eller casts: const age: number = '20'; const active: boolean = 'true'; const scores: number[] = [10, '20', 30];. Behåll de angivna typerna och ge dem värden av rätt typ."
        }
      ]
    },
{
      slug: "hono",
      title: "Hono",
      summary: "API-routes och serverhandlers.",
      pages: [
        {
          id: "hono-p1",
          title: "Hono-grunder",
          intro: "Hono är ett lätt framework för att skapa webb- och API-routes.",
          bullets: ["new Hono() skapar appen.", "Routes matchar metod + path.", "Handlern får context c."],
          ...getLessonPageContent("hono-p1"),
          cheat: ["App", "Route", "Context"],
          codeTask: "Skapa app = new Hono()."
        },{
          id: "hono-p2",
          title: "GET-route",
          intro: "GET används normalt för att läsa data.",
          bullets: ["app.get registrerar GET-route.", "c.json returnerar JSON.", "Path måste matcha requesten."],
          ...getLessonPageContent("hono-p2"),
          cheat: ["app.get", "path", "c.json"],
          codeTask: "Skapa GET /api/hello som returnerar message: Hej!."
        },{
          id: "hono-p3",
          title: "POST och request body",
          intro: "POST används ofta när klienten skickar ny data.",
          bullets: ["c.req.json() läser JSON-body.", "Validera input innan användning.", "Returnera lämplig status/data."],
          ...getLessonPageContent("hono-p3"),
          cheat: ["app.post", "c.req.json", "Validering"],
          codeTask: "Skapa POST /api/users och läs request body."
        },{
          id: "hono-p4",
          title: "Responses och status",
          intro: "Servern bör returnera tydliga responses och statuskoder.",
          bullets: ["c.json för JSON.", "404 när resurs saknas.", "201 kan användas när resurs skapats."],
          ...getLessonPageContent("hono-p4"),
          cheat: ["JSON response", "Statuskod", "Felhantering"],
          codeTask: "Returnera JSON med status 201 från en create-route."
        },{
          id: "hono-p5",
          title: "Hono + frontend",
          intro: "Frontend fetch och Hono-route måste komma överens om metod, path och dataformat.",
          bullets: ["GET fetch matchar GET route.", "POST-body läses på servern.", "Response läses på klienten."],
          ...getLessonPageContent("hono-p5"),
          cheat: ["Client/server-kontrakt", "Method", "Path", "JSON"],
          codeTask: "Skriv frontend fetch och matchande Hono GET-route för /api/products."
        }
      ]
    },
{
      slug: "server",
      title: "Server",
      summary: "Request, response, status och klient/server.",
      pages: [
        {
          id: "server-p1",
          title: "Klient vs server",
          intro: "Frontend visar UI medan servern behandlar requests och data.",
          bullets: ["Klient kör användargränssnitt.", "Server tar emot requests.", "Ansvaren är separata men samarbetar."],
          ...getLessonPageContent("server-p1"),
          cheat: ["Klient", "Server", "HTTP"],
          codeTask: "Beskriv vad som händer när användaren trycker 'Ladda användare'."
        },{
          id: "server-p2",
          title: "HTTP request",
          intro: "En request beskriver vad klienten vill göra.",
          bullets: ["Metod: GET/POST/etc.", "Path/URL.", "Headers.", "Eventuell body."],
          ...getLessonPageContent("server-p2"),
          cheat: ["Method", "URL", "Headers", "Body"],
          codeTask: "Beskriv en request för att skapa en user."
        },{
          id: "server-p3",
          title: "HTTP response",
          intro: "Servern svarar med statuskod, headers och ofta en body.",
          bullets: ["200 = OK.", "201 = Created.", "404 = Not Found.", "500 = serverfel."],
          ...getLessonPageContent("server-p3"),
          cheat: ["Status", "Headers", "Body"],
          codeTask: "Välj lämplig status för lyckad GET, skapad resurs och saknad resurs."
        },{
          id: "server-p4",
          title: "Hela request-response-flödet",
          intro: "Förstå hela kedjan från UI till server och tillbaka.",
          bullets: ["Event i React triggar fetch.", "Server route matchas.", "Server skapar response.", "Frontend uppdaterar state/UI."],
          ...getLessonPageContent("server-p4"),
          cheat: ["UI event", "Request", "Route", "Response", "State/render"],
          codeTask: "Förklara request → server → response med GET /api/users."
        }
      ]
    }
];

/**
 * Optional development-time validation.
 * This catches the easiest mistakes when adding new subjects.
 */
export function validateStudyTopics(topics: StudyTopic[] = studyTopics): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const pageIds = new Set<string>();

  for (const topic of topics) {
    if (!topic.slug.trim()) errors.push("Ett ämne saknar slug.");
    if (!topic.title.trim()) errors.push(`Ämnet "${topic.slug}" saknar title.`);
    if (slugs.has(topic.slug)) errors.push(`Duplicerad slug: ${topic.slug}`);
    slugs.add(topic.slug);

    if (topic.pages.length === 0) {
      errors.push(`Ämnet "${topic.title}" har inga sidor.`);
    }

    topic.pages.forEach((page, index) => {
      if (pageIds.has(page.id)) errors.push(`Duplicerat page id: ${page.id}`);
      pageIds.add(page.id);

      if (!page.title.trim()) {
        errors.push(`${topic.title} sida ${index + 1} saknar title.`);
      }

      if (page.quiz.options.length !== 4) {
        errors.push(`${page.id} måste ha exakt 4 quiz-alternativ.`);
      }

      if (page.quiz.answer < 0 || page.quiz.answer >= page.quiz.options.length) {
        errors.push(`${page.id} har ogiltigt quiz-answer index.`);
      }
    });
  }

  return errors;
}
