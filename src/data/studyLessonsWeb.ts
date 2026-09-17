import type { StudyLesson } from "./studyLessons";

export const webLessons: Record<string, StudyLesson> = {
  "components-p1": {
    code: `type ProductCardProps = { title: string; price: number };

function ProductCard({ title, price }: ProductCardProps) {
  return <article><h2>{title}</h2><p>{price} kr</p></article>;
}

export default function App() {
  return (
    <main>
      <ProductCard title="Anteckningsbok" price={49} />
      <ProductCard title="Penna" price={15} />
    </main>
  );
}`,
    walkthrough: [
      "ProductCard har ansvaret att visa en produkt med titel och pris. Skapa först funktionen och låt den returnera ett article-element med en h2 och ett p-element. TypeScript-typen ovanför funktionen beskriver att title är text och price är ett tal.",
      "App återanvänder samma komponent två gånger med olika indata. title skickas som en sträng och price som ett JavaScript-tal inom klamrar. Resultatet blir två kort: Anteckningsbok med 49 kr och Penna med 15 kr. Strukturen är gemensam men innehållet skiljer sig.",
      "Ändrar du hur priset skrivs i ProductCard påverkas båda korten. App behöver inte känna till kortets interna HTML. I övningen skapar du ProductCard; börja med en tydlig visuell struktur och lägg sedan till de props exemplet visar. Komponentindelning handlar om ansvar och återanvändning, inte en viss maximal fillängd."
    ],
    questions: [
      ["Hur många produktkort visar App?", "Två, med olika titel och pris", "Ett, eftersom funktionen bara definieras en gång", "Två med samma innehåll", "Inga, eftersom price är ett tal", "Varje ProductCard-element använder samma komponent med sina egna props."],
      ["Var ändrar du prisets presentation för båda produkterna?", "I ProductCards p-element", "Genom att kopiera hela App", "I TypeScript-typens namn", "Genom att lägga till en tredje ProductCard", "Presentationens gemensamma struktur ligger i ProductCard och återanvänds av båda instanserna."]
    ],
    statements: ["ProductCard ansvarar för presentationen av en produkt.", "Samma komponent kan få olika props vid olika användningar.", "Varje produkt kräver en separat komponentdefinition.", "Ett komponentnamn måste matcha en inbyggd HTML-tagg."],
    statementExplanation: "Komponenter har egna namn och återanvändbar struktur. Props gör att innehållet kan variera utan nya komponentdefinitioner."
  },
  "components-p2": {
    code: `// Button.tsx
export default function Button() {
  return <button type="button">Spara</button>;
}

// App.tsx — separat fil
import Button from "./Button";

export default function App() {
  return <Button />;
}`,
    walkthrough: [
      "Detta exempel består av två filer, inte ett enda block att klistra in i App.tsx. Lägg Button-funktionen i Button.tsx och den andra delen i App.tsx i samma mapp. export default gör Button till filens standardexport och import hämtar den i filen som ska använda den.",
      "Importvägen ./Button betyder filen Button relativt App.tsx. Därefter används den importerade funktionen som <Button /> i return. När App renderas visas en knapp med texten Spara. En export delar kod mellan moduler men placerar inte knappen på sidan.",
      "Med en namngiven export, exempelvis export function Button, ska importen i stället vara import { Button } from './Button'. Blanda inte ihop formerna. Kontrollera också sökväg och bokstäver i filnamnet om importen misslyckas; rätt funktion måste finnas tillgänglig innan JSX kan använda den."
    ],
    questions: [
      ["Vilken import passar export default function Button?", "import Button from './Button'", "import { Button } from './Button' utan namngiven export", "import './Button' as Button", "export Button from './Button' inuti return", "En standardexport importeras utan klamrar. Importnamnet används sedan i JSX."],
      ["Varför är de två delarna märkta Button.tsx och App.tsx?", "De ska ligga i separata filer som kopplas med import", "Kommentarerna skapar automatiskt filer", "React väljer en del slumpmässigt", "Två default-exporter behövs i samma fil", "En fil kan inte ha två standardexporter. Kommentarerna visar var koden hör hemma och importen kopplar ihop filerna."]
    ],
    statements: ["./Button är en relativ importsökväg.", "<Button /> använder den importerade komponenten i JSX.", "export default visar automatiskt komponenten i webbläsaren.", "Standardexport och namngiven export importeras alltid med samma syntax."],
    statementExplanation: "Export och import gör kod tillgänglig mellan filer. Rendering kräver att komponenten används, och namngivna importer skiljer sig från standardimporter."
  },
  "components-p3": {
    code: `function Header() { return <header><h1>Butiken</h1></header>; }
function MainContent() { return <main><p>Våra produkter</p></main>; }
function Footer() { return <footer>Kontakta oss</footer>; }

export default function App() {
  return <><Header /><MainContent /><Footer /></>;
}`,
    walkthrough: [
      "Utgå från sidans tre tydliga områden: rubrik, huvudinnehåll och sidfot. Ge varje område en funktion med ett beskrivande namn. Här används dessutom header, main och footer för att uttrycka områdenas betydelse i HTML, medan funktionsnamnen hjälper dig organisera React-koden.",
      "App visar hur delarna sätts ihop. All kod finns i samma fil i exemplet, men delarna kan senare exporteras och importeras om filen blir svåröverskådlig. Resultatet är en sida med Butiken, Våra produkter och Kontakta oss i den ordningen.",
      "Koduppgiften tränar just uppdelningen i Header, MainContent och Footer. Kontrollera att alla tre definieras och också används; en oanvänd definition bidrar inte till sidan. Bryt gärna ut ett återkommande produktkort senare, men varje liten text behöver inte automatiskt en egen komponent."
    ],
    questions: [
      ["Vilken komponent ansvarar för texten Våra produkter?", "MainContent", "Header", "Footer", "Fragmentet", "Texten ligger i MainContents return. App ansvarar för att använda MainContent tillsammans med de andra delarna."],
      ["Du definierar MainContent men glömmer <MainContent /> i App. Vad händer?", "Huvudinnehållet visas inte", "React lägger automatiskt in det mellan Header och Footer", "Footer byter namn till MainContent", "Alla komponenter blir globala", "Definitionen beskriver komponenten; användningen i Apps JSX gör den till en del av sidan."]
    ],
    statements: ["Ett tydligt område kan få en egen komponent.", "App kan ansvara för ordningen mellan sidans delar.", "Komposition kräver att varje komponent ligger i en egen fil.", "Varje enskilt HTML-element måste bli en React-komponent."],
    statementExplanation: "Komposition handlar om att kombinera delar med tydliga ansvar. Filindelning och detaljnivå väljs efter vad som gör koden begriplig."
  },
  "router-p1": {
    code: `import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() { return <h1>Hem</h1>; }
function About() { return <h1>Om oss</h1>; }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}`,
    walkthrough: [
      "Exemplet använder deklarativ routing från react-router-dom. Installationen behöver biblioteket och appen ska ha en BrowserRouter runt sina routes. Om startfilen redan omsluter App med BrowserRouter använder du den befintliga routern i stället för att lägga en router inuti en annan.",
      "Routes väljer en matchande Route. path beskriver URL:en och element innehåller JSX för vyn som ska visas. På / visas Hem och på /about visas Om oss. Home och About är definierade ovanför App, så båda vyerna finns när routingen använder dem.",
      "Skapa först de två sidkomponenterna, lägg sedan in båda Route-elementen i Routes och kontrollera båda adresserna. Vid publicering behöver webbservern kunna leverera appens HTML även för en direkt begäran till /about. BrowserRouter hanterar navigation i appen men konfigurerar inte webbservern."
    ],
    questions: [
      ["Vilken vy visar exemplet på /about?", "About med rubriken Om oss", "Home med rubriken Hem", "Båda vyerna samtidigt", "Ingen eftersom /about inte är en fil", "Route med path /about matchar URL:en och använder element={<About />}."],
      ["Var ska Route-elementen i exemplet placeras?", "Inuti Routes under en BrowserRouter", "Direkt inuti en button", "Inuti en useState-callback", "I en vanlig CSS-fil", "BrowserRouter ger routing-context och Routes hanterar matchningen av sina Route-barn."]
    ],
    statements: ["path beskriver vilken URL en route matchar.", "element={<About />} beskriver vyn som ska visas.", "BrowserRouter skapar automatiskt Home- och About-funktionerna.", "Varje Route behöver sin egen nästlade BrowserRouter."],
    statementExplanation: "En gemensam router ger context åt routes. Sidkomponenterna måste definieras eller importeras, och path kopplas till ett JSX-element."
  },
  "router-p2": {
    code: `import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Hem</Link>
        <Link to="/contact">Kontakt</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Hem</h1>} />
        <Route path="/contact" element={<h1>Kontakta oss</h1>} />
      </Routes>
    </BrowserRouter>
  );
}`,
    walkthrough: [
      "Skapa en Link för varje intern destination och skriv destinationsadressen i to. Texten mellan taggarna är det användaren klickar på. Link måste finnas under en router; här ligger både navigation och routes i samma BrowserRouter.",
      "Ett vanligt klick på Kontakt uppdaterar adressen till /contact och gör att motsvarande Route visar Kontakta oss. React Router hanterar navigationen utan en full dokumentladdning. Link skapar däremot inte en ny route: destinationen behöver fortfarande en matchande Route.",
      "Övningen ber om länkarna / och /contact, och exemplet visar båda tillsammans med sina vyer. Kontrollera att to och path använder samma adress. För en extern webbplats använder du normalt en vanlig a-länk med href. Lägg inte en extra BrowserRouter här om projektet redan har en runt App."
    ],
    questions: [
      ["Vad ska Link använda för att gå till kontaktvyn?", "to='/contact'", "path='/contact'", "element='/contact'", "route='/contact'", "Link använder to för destinationen. path hör till Route som matchar adressen."],
      ["En Link pekar på /contact men ingen Route matchar adressen. Vad saknas?", "En matchande route för kontaktvyn", "En andra BrowserRouter runt länken", "Ett nytt state för varje bokstav i URL:en", "En onChange på Link", "Länken kan ändra URL:en men definierar inte själv vad som ska visas på destinationen."]
    ],
    statements: ["Texten Kontakt är länkens synliga innehåll.", "Link och dess destination behöver stämma med routingen.", "Link skapar automatiskt en sidkomponent med samma namn som adressen.", "Link använder element för att ange sin destination."],
    statementExplanation: "Link använder to och visar sitt innehåll som länktext. Route använder path och element för att definiera vyn."
  },
  "router-p3": {
    code: `import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

function Product() {
  const { id } = useParams();
  return <h1>Produkt {id}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products/:id" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}`,
    walkthrough: [
      "Kolonet i :id markerar att en del av adressen är en parameter. Skriv mönstret /products/:id i Route, men öppna en konkret adress som /products/42 i webbläsaren. Samma route kan även matcha /products/7 utan en separat Route för varje produkt.",
      "Product anropar useParams för att läsa de matchade parametrarna. På /products/42 är id strängen '42', och rubriken blir Produkt 42. Parametern blir inte automatiskt ett tal eller ett produktobjekt. Om du behöver räkna med den måste du först kontrollera och konvertera värdet.",
      "Koduppgiften kräver både den dynamiska routen och Product-vyn som läser id. Parameternamnet måste stämma: om path använder :productId ska du läsa productId. Att adressen matchar garanterar inte att produkten finns på servern, så en senare datahämtning behöver även hantera saknad produkt."
    ],
    questions: [
      ["Vad är id på adressen /products/42 i exemplet?", "Strängen '42'", "Talet 42 automatiskt", "Strängen ':id'", "Hela produktobjektet", "URL-parametrar läses som text. useParams hämtar segmentet men laddar inte produktdata."],
      ["Vilket path kan matcha både /products/7 och /products/42?", "/products/:id", "/products/id", "/products/42", "/products?id", "Det dynamiska segmentet :id kan ta olika värden i samma position i sökvägen."]
    ],
    statements: ["useParams kan läsa en matchad URL-parameter.", "En dynamisk route kan återanvända samma Product-vy för flera id:n.", "En matchad parameter betyder att produkten säkert finns i databasen.", "useParams konverterar alla numeriska segment till number."],
    statementExplanation: "Routingen matchar adressens struktur och ger textparametrar. Datatyp och resursens existens kontrolleras separat."
  },
  "router-p4": {
    code: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function About() { return <h1>Om oss</h1>; }

export default function App() {
  return (
    <BrowserRouter>
      <Link to="/about">Om oss</Link>
      <Routes>
        {/* Rättat: path och element används för denna deklarativa route. */}
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}`,
    walkthrough: [
      "Uppgiftens felaktiga rad använder url och component. I syntaxen som kursen använder ska den bli <Route path='/about' element={<About />} />. path är mönstret och element tar emot färdig JSX för vyn. Det är en rättning av route-definitionen, inte ett nytt navigationsanrop.",
      "Exemplet visar också omgivningen som en ensam Route-rad saknar: importerna, About-funktionen, Routes och BrowserRouter. Länken Om oss ligger under samma router och använder to='/about'. När du klickar matchas adressen och rubriken visas.",
      "Felsök i tre steg: finns routing-context, stämmer länkens adress med path, och finns komponenten som element använder? Ett fel om saknad router löses inte genom att byta knapptext. Om appen redan har en router behåller du den och lägger routes under den, i stället för att nästla en ny BrowserRouter."
    ],
    questions: [
      ["Vilken rad rättar uppgiftens route?", "<Route path='/about' element={<About />} />", "<Route url='/about' element={<About />} />", "<Route to='/about' component={<About />} />", "<Route href='/about' view={<About />} />", "I kursens deklarativa route-syntax används path och element."],
      ["Link ger ett fel om att den används utanför en router. Vad kontrollerar du först?", "Att Link ligger under appens router", "Att About har en CSS-klass", "Att länktexten börjar med stor bokstav", "Att varje Link har ett eget useState", "Link behöver routing-context från en överordnad router. CSS och lokal state påverkar inte det felet."]
    ],
    statements: ["Routes och Link behöver rätt omgivande routing-struktur.", "element={<About />} använder About som JSX.", "Att byta path till url löser en route som inte matchar.", "En saknad About-definition skapas automatiskt från path."],
    statementExplanation: "Kontrollera context, path och komponenten var för sig. En URL definierar inte komponenten, och fel propnamn ger inte rätt matchning."
  },
  "fetch-p1": {
    code: `async function getUsers() {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error("Kunde inte hämta användare");
  return response.json();
}

getUsers()
  .then(users => console.log(users))
  .catch(error => console.error(error.message));`,
    walkthrough: [
      "Lägg anropet i en async-funktion så att await kan användas. getUsers är funktionens namn och /api/users är den adress som servern måste erbjuda. En relativ adress anropas på samma origin som sidan; detta exempel förutsätter ett JSON-API där och skapar inte servern åt dig.",
      "fetch startar en GET-request eftersom ingen annan metod anges. await ger dig ett Response-objekt när svaret finns, inte den färdiga användarlistan. Sedan kontrolleras status och response.json() läser innehållet. Nästa sida går djupare in på just dessa två steg.",
      "Anropet längst ned använder resultatet i then och visar fel i catch. Listan skrivs i utvecklarverktygens konsol, inte automatiskt på webbsidan. I koduppgiften skriver du både getUsers och ett anrop som hanterar resultat eller fel. För att visa data i React behövs dessutom en koppling till JSX, vilket en senare sida visar."
    ],
    questions: [
      ["Vad returnerar fetch('/api/users') direkt, innan await?", "En Promise som kan ge ett Response", "En färdig användarlista", "En JSON-sträng i alla fall", "En React-komponent", "fetch är asynkront. Promise-resultatet blir ett Response vars body sedan kan läsas."],
      ["Var syns användarna efter ett lyckat anrop i just detta exempel?", "I utvecklarverktygens konsol", "Automatiskt i en lista på sidan", "I adressfältet", "I en ny HTML-fil", "console.log skriver till konsolen. Kod som hämtar data skapar inte automatiskt JSX som visar den."]
    ],
    statements: ["GET används när ingen method anges i fetch.", "Servern måste erbjuda den anropade adressen.", "await fetch ger direkt den parsade JSON-listan.", "Att definiera getUsers gör att funktionen automatiskt körs."],
    statementExplanation: "Funktionen måste anropas och en server behöver svara. fetch ger först Response, sedan läser json() dess body."
  },
  "fetch-p2": {
    code: `async function getUsers() {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("HTTP-fel: " + response.status);
  }
  const data = await response.json();
  return data;
}`,
    walkthrough: [
      "Response innehåller statuskod och metoder för att läsa svaret. ok är true för status 200–299. fetch avvisar normalt inte sin Promise bara för att servern svarar 404 eller 500, så kontrollen behövs för att behandla sådana svar som fel i din egen kod.",
      "Vid en misslyckad HTTP-status kastar funktionen ett Error innan JSON läses. Vid framgång väntar await response.json() på att body läses och tolkas, och return lämnar datan till den som anropade getUsers. Ett nätverksfel eller ogiltig JSON kan också ge ett fel som anroparen behöver fånga.",
      "Prova att följa två fall: 200 med en JSON-lista når return data, medan 404 stannar vid throw. API:et förutsätts returnera JSON vid framgång; ett svar utan body, som 204, ska inte läsas med json(). Kroppen är en ström och ska normalt inte läsas flera gånger på samma Response."
    ],
    questions: [
      ["Servern svarar 404. Vilken rad gör att funktionen behandlar svaret som fel?", "if (!response.ok) följt av throw", "const response = await fetch i sig garanterar detta", "return data", "Funktionsnamnet getUsers", "fetch kan lyckas ta emot ett HTTP-felsvar. Din ok-kontroll omvandlar det till ett kastat fel."],
      ["Vad ger await response.json() vid ett giltigt JSON-svar?", "Det parsade JavaScript-värdet från body", "HTTP-statuskoden", "Requestens headers", "En referens till json-funktionen", "json() läser och tolkar body asynkront. Parenteserna behövs för att anropa metoden."]
    ],
    statements: ["response.ok är false för 404 och 500.", "JSON-läsningen kan misslyckas även efter en lyckad HTTP-status.", "fetch kastar alltid automatiskt vid status 404.", "Ett tomt 204-svar kan alltid läsas som JSON."],
    statementExplanation: "HTTP-status, nätverk och parsning är olika felkällor. Ett lyckat tomt svar innehåller ingen JSON att tolka."
  },
  "fetch-p3": {
    code: `async function createPost() {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Hej" })
  });
  if (!response.ok) throw new Error("Kunde inte skapa inlägget");
  return response.json();
}`,
    walkthrough: [
      "Uppgiften skickar ett inlägg med title till /api/posts. Skapa en async-funktion och ge fetch ett andra argument med inställningar. method väljer POST i stället för standardmetoden GET. Servern behöver ha en POST-route på samma adress som förstår den här datan.",
      "body är requestens innehåll. JSON.stringify omvandlar objektet till JSON-text, och Content-Type berättar hur servern ska tolka den. Headern gör inte om objektet åt dig; båda delarna behövs när du skickar JSON på detta sätt. Titeln är data, inte en del av URL:en.",
      "Efter anropet kontrolleras HTTP-resultatet och ett JSON-svar läses. Exemplet förutsätter att servern svarar med den skapade resursen som JSON. Om API:et i stället dokumenterar ett tomt svar ska json()-raden tas bort. Att definiera createPost skickar inget; anropa den exempelvis i en submit-handler och fånga eventuella fel där."
    ],
    questions: [
      ["Vilken del innehåller själva titeln som skickas?", "body: JSON.stringify({ title: 'Hej' })", "method: 'POST'", "Content-Type-headern ensam", "Funktionsnamnet createPost", "body bär innehållet. method anger handlingen och Content-Type beskriver formatet."],
      ["Vad gör JSON.stringify här?", "Omvandlar JavaScript-objektet till JSON-text", "Läser serverns svar", "Validerar att titeln är tillåten på servern", "Skickar requesten utan fetch", "Serialisering ger text för body. Det varken validerar serverns regler eller skickar nätverksanropet."]
    ],
    statements: ["method: 'POST' väljer requestens HTTP-metod.", "Content-Type beskriver att body skickas som JSON.", "Content-Type omvandlar automatiskt ett vanligt objekt till JSON-text.", "En POST-request behöver aldrig kontrollera serverns svar."],
    statementExplanation: "Metod, format och innehåll är separata delar. Klienten serialiserar body och kontrollerar sedan om servern accepterade requesten."
  },
  "fetch-p4": {
    code: `import { useState } from "react";

type User = { id: number; name: string };

export default function Users() {
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
    } finally {
      setLoading(false);
    }
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
      "Detta exempel hämtar data vid ett knappklick, så ingen effect behövs. Skapa separata state-värden för listan, laddningen och feltexten. User[] gör att den tomma startlistan har rätt TypeScript-typ. API:et förutsätts svara med objekt som innehåller id och name; typannoteringen validerar inte verklig nätverksdata.",
      "Handlern sätter loading till true och rensar föregående fel. try utför requesten, kontrollerar ok och sparar listan. catch gör felet synligt för användaren. finally körs i båda fallen och återställer loading så att knappen kan användas igen.",
      "Under hämtningen visas Laddar... och knappen är avstängd. Vid framgång visar map en li per användare, med ett stabilt id som key. Ett misslyckat nytt anrop visar fel och behåller här eventuell tidigare lista. Lägg inte loadUsers() direkt i komponentkroppen, eftersom en ny rendering då kan starta ytterligare requests."
    ],
    questions: [
      ["Varför sätts loading till false i finally?", "För att avsluta laddningsläget både vid framgång och fel", "För att hoppa över catch", "För att alltid radera users", "För att starta nästa request automatiskt", "finally körs efter try/catch oavsett utfall, så UI:t fastnar inte i laddningsläge vid fel."],
      ["Vilken rad gör att hämtade användare kan visas i nästa rendering?", "setUsers(data)", "console.log(response)", "setError('')", "type User = ...", "setUsers uppdaterar den state-lista som JSX mappar till li-element."]
    ],
    statements: ["Knappens onClick startar datahämtningen.", "catch sparar ett felmeddelande för UI:t.", "User[] kontrollerar automatiskt serverns JSON vid runtime.", "loadUsers() bör anropas direkt vid varje rendering."],
    statementExplanation: "Hämtningen är händelsestyrd och resultatet hanteras i state. TypeScript ersätter inte runtime-validering, och anrop i renderingskroppen kan upprepas oavsiktligt."
  },
  "fetch-p5": {
    code: `async function getUsers() {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error("HTTP-fel: " + response.status);

  // Fel: return response.json;
  const users = await response.json();
  return users;
}`,
    walkthrough: [
      "Uppgiftens return response.json returnerar själva metoden i stället för att läsa body. Lägg till parenteser för anropet. I exemplet används dessutom await för att kunna spara den färdiga datan i users innan den returneras.",
      "return response.json() fungerar också inne i en async-funktion när du bara vill vidarebefordra resultatet. Om du däremot ska använda datan direkt på nästa rad behöver du invänta den. Skillnaden mellan funktionsreferens, Promise och färdig data är viktigare än att alltid lägga await på samma plats.",
      "Kontrollera sedan Network-fliken vid fel: stämmer URL och metod, vilken status kom tillbaka och är innehållet verkligen JSON? En HTML-felsida kan inte parsas som JSON bara för att du anropar json(). Uppgiftens lilla rättning tränar metodanropet, medan det kompletta exemplet visar sammanhanget."
    ],
    questions: [
      ["Vad returnerar den felaktiga raden return response.json?", "En funktionsreferens", "Den färdiga användarlistan", "Ett automatiskt JSON-anrop", "HTTP-statusen", "Utan parenteser läser du metodens värde i stället för att anropa den."],
      ["Servern skickar HTML med status 200 men koden väntar sig JSON. Vad kan misslyckas?", "response.json() när body tolkas", "Funktionsnamnet getUsers", "Att const används", "Att URL:en är en sträng", "En lyckad status garanterar inte JSON-format. Parsningen kan därför kasta ett fel."]
    ],
    statements: ["json() anropar en metod som läser response body.", "return response.json() kan vidarebefordra resultatet från en async-funktion.", "response.json utan parenteser läser body direkt.", "HTTP 200 garanterar alltid att svaret innehåller giltig JSON."],
    statementExplanation: "Parenteser skiljer anrop från referens. Async-funktioner kan vidarebefordra en Promise, och formatet behöver stämma även om status är lyckad."
  }
};
