import { webLessons } from "./studyLessonsWeb";
import { libraryLessons } from "./studyLessonsLibraries";
import { formLessons } from "./studyLessonsForms";
import { typeLessons } from "./studyLessonsTypes";
import { serverLessons } from "./studyLessonsServer";

/** Page-specific examples and questions. Correct single-choice answer is first
 * here; the quiz UI receives deterministically shuffled options. */
export type LessonQuestion = [question: string, correct: string, wrong1: string, wrong2: string, wrong3: string, explanation: string];
export type StudyLesson = {
  code: string;
  walkthrough: string[];
  questions: [LessonQuestion, LessonQuestion];
  /** Two true statements followed by two plausible misconceptions. */
  statements: [string, string, string, string];
  statementExplanation: string;
};

export const studyLessons: Record<string, StudyLesson> = {
  ...webLessons,
  ...libraryLessons,
  ...formLessons,
  ...typeLessons,
  ...serverLessons,
  "react-p1": {
    code: `function Hello() {
  return <h1>Hej!</h1>;
}

export default function App() {
  return <Hello />;
}`,
    walkthrough: [
      "Skriv exemplet i App.tsx i ett befintligt React-projekt. Hello är en funktion utan parametrar. return lämnar tillbaka beskrivningen av en rubrik, och texten mellan h1-taggarna blir rubrikens innehåll. JSX skrivs i en .tsx-fil när du använder TypeScript.",
      "App använder Hello genom att returnera <Hello />. Att enbart definiera Hello gör inte att den syns; den måste ingå i det komponentträd som appen visar. Projektets startfil monterar normalt App i HTML-sidans rotelement, så du behöver inte montera varje liten komponent själv.",
      "När sidan öppnas ser du rubriken Hej!. Prova att ändra texten och sedan använda två <Hello /> inuti ett fragment i App: då får du två rubriker från samma komponent. I koduppgiften räcker själva Hello-funktionen. Kontrollera stor bokstav, return och avslutande h1-tagg om den inte fungerar."
    ],
    questions: [
      ["Vad visas när App i exemplet renderas?", "En h1-rubrik med texten Hej!", "Texten Hello utan rubrik", "Ingenting eftersom Hello saknar props", "Två rubriker eftersom det finns två funktioner", "App renderar Hello, och Hello returnerar ett enda h1-element med texten Hej!."],
      ["Du har skrivit Hello men använder den ingenstans. Vad behöver du lägga i Apps JSX?", "<Hello />", "Hello utan JSX eller klamrar", "<hello />", "export default Hello inuti return", "<Hello /> gör komponenten till en del av gränssnittet. En funktionsdefinition eller export visar den inte automatiskt."]
    ],
    statements: ["Hello returnerar JSX som beskriver en rubrik.", "App kan använda samma Hello-komponent flera gånger.", "En komponent visas automatiskt så snart funktionen definieras.", "Egna komponenter måste skrivas med liten begynnelsebokstav i JSX."],
    statementExplanation: "Hello beskriver innehållet och App bestämmer var det används. Egna komponenter börjar med stor bokstav; en definition ensam monterar ingen UI-del."
  },
  "react-p2": {
    code: `function Greeting() {
  const name = "Anna";
  return (
    <div className="greeting">
      <p>Hej {name}</p>
      <p>Namnet har {name.length} bokstäver.</p>
    </div>
  );
}

export default function App() {
  return <Greeting />;
}`,
    walkthrough: [
      "Börja med variabeln name före return. Inuti ett p-element betyder {name} att React ska läsa variabelns värde. Skriver du name utan klamrar mellan taggarna blir det den bokstavliga texten name. Citattecken används för strängvärdet i JavaScript, men behövs inte runt vanlig text mellan JSX-taggar.",
      "Exemplet visar Hej Anna och Namnet har 4 bokstäver. Uttrycket name.length beräknas när komponenten renderas. Du kan använda ett uttryck i klamrarna, men inte lägga en hel const-deklaration där. De två p-elementen ligger i samma div för att returnera en sammanhängande JSX-struktur.",
      "className kopplar elementet till en CSS-klass om du har definierat den; det ändrar inte textinnehållet. Prova att byta Anna till Sofia och följ både hälsningen och längden. I uppgiften ska just ett p-element visa {name}; App visar hur Greeting kopplas in i en färdig sida."
    ],
    questions: [
      ["Vilken text visar det första p-elementet?", "Hej Anna", "Hej name", "Hej {name}", "Anna.length", "Klamrarna gör att variabeln name läses; den har värdet Anna."],
      ["Vad händer med den andra raden om name ändras till Sofia?", "Den visar att namnet har 5 bokstäver", "Den fortsätter visa 4 eftersom length är en prop", "Den visar texten name.length", "Den försvinner eftersom strängen blivit längre", "name.length beräknas från strängens aktuella värde varje gång komponenten renderas."]
    ],
    statements: ["{name} läser en JavaScript-variabel i JSX.", "En gemensam div kan omsluta flera p-element.", "Texten name utan klamrar läser automatiskt variabeln.", "En const-deklaration kan placeras direkt mellan JSX-klamrar."],
    statementExplanation: "JSX-klamrar tar uttryck som name eller name.length. Deklarationer hör hemma före return, och flera syskonelement behöver en gemensam omslutning."
  },
  "react-p3": {
    code: `function Header() {
  return <header><h1>Min studiesida</h1></header>;
}

function Footer() {
  return <footer>Skapad av Sofia</footer>;
}

export default function App() {
  return (
    <>
      <Header />
      <Footer />
    </>
  );
}`,
    walkthrough: [
      "Skapa först Header och Footer så att namnen som App använder faktiskt finns. Header ansvarar för sidans överdel och Footer för sidfoten. I det här exemplet ligger allt i App.tsx, så inga egna importvägar behövs. Varje funktion returnerar sin egen del av sidan.",
      "App kombinerar delarna i den ordning de ska visas. Fragmentet <>...</> samlar två syskon utan att lägga till en extra div i sidans HTML. Header visas över Footer eftersom den står först i JSX. Om du byter ordning i App byter delarna också plats.",
      "Komposition gör det möjligt att ändra rubriken i Header utan att leta igenom Footer. Det räcker däremot inte att skriva <Header /> om funktionen varken finns lokalt eller är importerad. Träna genom att lägga till en MainContent mellan de två delarna och låta den returnera ett main-element."
    ],
    questions: [
      ["Vilken del bestämmer att Header visas före Footer?", "Ordningen på elementen i App", "Ordningen på funktionsdefinitionerna", "Komponenternas namn i alfabetisk ordning", "Att Footer använder en footer-tagg", "App komponerar sidan. Ordningen i den returnerade JSX-koden avgör elementens ordning."],
      ["Varför används <>...</> i App?", "För att samla syskonelement utan extra HTML-element", "För att importera Header", "För att köra Footer vid ett klick", "För att skapa en ny webbsida per komponent", "Ett fragment är en gemensam JSX-omslutning som inte skapar en egen div i DOM-trädet."]
    ],
    statements: ["App kan kombinera flera mindre komponenter.", "Header måste vara definierad eller importerad där den används.", "En komponent får bara användas en gång.", "Fragmentet gör att barnkomponenterna inte renderas."],
    statementExplanation: "Komposition bygger UI av tillgängliga komponenter som kan återanvändas. Fragment samlar barnen och låter dem renderas utan en extra behållare."
  },
  "react-p4": {
    code: `function Profile() {
  function handleClick() {
    window.alert("Hej från Sofia!");
  }
  return (
    <div className="card">
      <h2>Sofia</h2>
      <p>Frontendutvecklare</p>
      <button type="button" onClick={handleClick}>Visa profil</button>
    </div>
  );
}

export default function App() {
  return <Profile />;
}`,
    walkthrough: [
      "Följ ett klick genom exemplet: knappen finns först på sidan, användaren klickar, React kör handleClick och webbläsaren visar meddelandet. Inget i knappens text kör JavaScript; det är onClick som kopplar händelsen till funktionen.",
      "Testa felsökningen genom att tänka igenom ett fel åt gången. Utan <Profile /> i App används profilen inte. Utan return lämnar Profile inte tillbaka sitt innehåll. Med onClick={handleClick()} visas meddelandet vid rendering i stället för att vänta på klicket.",
      "I koduppgiften bygger du samma struktur med namn, titel och knapp. Du kan välja egen text, men behåll en riktig button-tagg och stäng den efter knapptexten. Om du vill ändra utseendet behöver du dessutom CSS för card; beteendet vid klick styrs separat av funktionen."
    ],
    questions: [
      ["När körs handleClick med onClick={handleClick}?", "När användaren klickar på knappen", "Varje gång Profile renderas", "När CSS-klassen card laddas", "När funktionen definieras", "onClick får en funktionsreferens. React anropar den först när klickhändelsen inträffar."],
      ["Varför är onClick={handleClick()} fel för den här knappen?", "Det anropar funktionen under renderingen", "Det stänger inte button-taggen", "Det gör handleClick till en CSS-klass", "Det hindrar Profile från att ta emot props", "Parenteserna utför anropet direkt. Händelsen ska få funktionen att köra senare, inte returvärdet från ett redan utfört anrop."]
    ],
    statements: ["Texten mellan button-taggarna syns på knappen.", "<Profile /> i App gör profilen till en del av sidan.", "className gör att knappen automatiskt får ett klickbeteende.", "onClick={handleClick()} väntar tills användaren klickar."],
    statementExplanation: "Knappens innehåll och placering skapas av JSX. onClick kopplar beteendet; className kopplar CSS och ett direkt funktionsanrop väntar inte på ett klick."
  },
  "state-p1": {
    code: `import { useState } from "react";

export default function Panel() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(open => !open)}>
        {isOpen ? "Stäng" : "Öppna"}
      </button>
      {isOpen && <p>Här finns mer information.</p>}
    </>
  );
}`,
    walkthrough: [
      "Importera useState och anropa den högst upp inuti Panel, före return. false är startvärdet, så paneltexten visas inte från början. isOpen innehåller värdet för den aktuella renderingen och setIsOpen är funktionen som ber React uppdatera det.",
      "Knappens callback använder !open för att vända false till true eller tvärtom. När state ändras kör React komponenten igen med det nya värdet. Villkoret isOpen && visar texten endast när isOpen är true, och uttrycket med ? väljer rätt knapptext.",
      "Efter första klicket står det Stäng på knappen och informationen syns. Nästa klick döljer den igen. En vanlig lokal variabel skulle inte själv utlösa detta flöde och återställs när funktionen körs igen. State sparas mellan renderingar, men inte automatiskt efter en omladdning av webbsidan."
    ],
    questions: [
      ["Vad syns innan användaren klickar?", "Knappen Öppna, men inte informationstexten", "Knappen Stäng och informationstexten", "Informationstexten utan knapp", "Ingenting eftersom false inte kan vara state", "isOpen börjar som false. Det väljer Öppna och gör att villkoret för p-elementet inte är uppfyllt."],
      ["Vad gör setIsOpen(open => !open)?", "Vänder det senaste boolean-värdet och begär en uppdatering", "Ändrar en CSS-klass direkt", "Sparar värdet automatiskt på servern", "Återställer alltid värdet till false", "Callbacken får föregående värde och returnerar dess motsats. React kan sedan rendera den nya vyn."]
    ],
    statements: ["isOpen börjar som false i exemplet.", "State kan bevaras mellan komponentens renderingar.", "En vanlig variabeltilldelning får alltid React att rendera om.", "useState sparar automatiskt värdet efter att sidan laddats om."],
    statementExplanation: "useState ger komponenten minne under dess livstid och en setter för uppdateringar. Det är varken automatisk disk- eller serverlagring."
  },
  "state-p2": {
    code: `import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(5);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      Antal: {count}
    </button>
  );
}`,
    walkthrough: [
      "Här matchar startvärdet koduppgiften: useState(5) ger count värdet 5 vid första renderingen. Hakparenteserna plockar ut värde och setter ur resultatet. Namnet setCount är en namnkonvention som gör sambandet tydligt; det är fortfarande en vanlig variabel som refererar till en funktion.",
      "Knappen visar Antal: 5. Vid ett klick räknar callbacken ut count + 1 och skickar det till setCount. Vid nästa rendering har count det nya värdet och knapptexten blir Antal: 6. Funktionen skickas till onClick för att uppdateringen ska ske som svar på användaren.",
      "State-värdet i en redan pågående handler är en ögonblicksbild av den renderingen. Ett setCount-anrop skriver alltså inte om den lokala count-variabeln direkt. För en enkel ökning vid ett klick fungerar detta exempel; nästa sida visar hur du köar flera ökningar som ska bygga på varandra."
    ],
    questions: [
      ["Vad visar räknaren efter ett klick från startläget?", "Antal: 6", "Antal: 1", "Antal: 5", "Antal: 10", "Startvärdet är 5 och klicket begär värdet 5 + 1, alltså 6."],
      ["Vilken del av const [count, setCount] = useState(5) används för att begära ett nytt värde?", "setCount", "count", "Siffran 5", "Hakparenteserna själva", "setCount är setter-funktionen. count är värdet för renderingen och 5 anger startvärdet."]
    ],
    statements: ["useState(5) anger räknarens startvärde.", "setCount används för att begära en state-uppdatering.", "count ändras omedelbart i den redan körande handlern efter setCount.", "useState måste anropas inuti onClick vid varje klick."],
    statementExplanation: "Hooken anropas högst upp i komponenten. Settern köar en uppdatering, medan den nuvarande handlern fortfarande läser sin renderings värde."
  },
  "state-p3": {
    code: `import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  function addTwo() {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  }
  return <button type="button" onClick={addTwo}>Antal: {count}</button>;
}`,
    walkthrough: [
      "Skapa en handler som innehåller två setter-anrop. Varje anrop får en funktion i stället för ett färdigräknat tal. React behandlar uppdateringarna i ordning: den första får 0 och ger 1, den andra får resultatet 1 och ger 2.",
      "Om du i stället skrev setCount(count + 1) två gånger i samma handler skulle båda läsa count från samma rendering. Från 0 begär båda då värdet 1. Functional updates behövs här för att den andra ökningen ska bygga vidare på den första.",
      "Efter ett klick visar exemplet 2 och efter två klick 4. prev är ett valfritt parameternamn, inte en särskild React-variabel. Uppdateringsfunktionen ska bara beräkna nästa state utan sidoeffekter; lägg därför inte API-anrop eller meddelanderutor inuti den."
    ],
    questions: [
      ["Vad visar count efter ett klick i exemplet?", "2", "1", "0", "4", "De två funktionerna behandlas i ordning: 0 → 1 → 2."],
      ["Vad skulle två setCount(count + 1) i samma handler ge från count = 0?", "1", "2", "3", "Ett syntaxfel", "Båda uttrycken räknas ut med samma count-värde, så båda begär att state ska bli 1."]
    ],
    statements: ["Den andra uppdateringen kan få resultatet från den första.", "prev är en parameter vars namn kan ändras.", "Två uppdateringar med count + 1 använder alltid olika count-värden.", "En state-uppdateringsfunktion bör skicka HTTP-anrop som sidoeffekt."],
    statementExplanation: "Funktionella uppdateringar beräknar nästa värde från köns föregående resultat. De ska vara rena beräkningar, och en renderings count ändras inte mitt i handlern."
  },
  "state-p4": {
    code: `import { useState } from "react";

export default function NameEditor() {
  const [name, setName] = useState("");
  return (
    <>
      <label>Namn <input value={name} onChange={e => setName(e.target.value)} /></label>
      <p>Du skrev: {name}</p>
      <button type="button" onClick={() => setName("")}>Rensa</button>
    </>
  );
}`,
    walkthrough: [
      "Skapa name-state med en tom sträng så att fältet är tomt och styrt från första renderingen. value={name} gör state till källan för inputens text. label beskriver vad användaren ska skriva och omsluter fältet så att etiketten hör ihop med det.",
      "När du skriver skickar React ett event till onChange. e.target.value är den nya texten, och setName sparar den för nästa rendering. Samma name används i p-elementet, så både fältet och raden Du skrev visar samma uppdaterade värde.",
      "Rensa-knappen uppdaterar state till en tom sträng. Då töms både fältet och texten utan att du letar upp ett HTML-element manuellt. Prova att ta bort onChange i tanken: value fortsätter styra fältet men inget nytt värde sparas, så det går inte att redigera normalt."
    ],
    questions: [
      ["Vad händer när användaren klickar på Rensa?", "Både inputen och texten efter Du skrev töms", "Bara p-elementet töms", "Bara inputen töms", "Webbsidan laddas om", "Båda läser samma name-state, som setName sätter till en tom sträng."],
      ["Vilket värde ska skickas till setName vid en textändring?", "e.target.value", "Hela e", "name.length", "Inputens className", "e.target.value innehåller texten. Event-objektet självt är inte strängen som state ska innehålla."]
    ],
    statements: ["value={name} låter state styra inputtexten.", "Samma state kan visas i flera element.", "Ett controlled input uppdaterar automatiskt state utan onChange.", "Rensa-knappen behöver ändra DOM direkt för att tömma fältet."],
    statementExplanation: "value läser state och onChange skriver nästa värde. Alla element som läser name följer dess uppdateringar, även vid återställning."
  },
  "state-p5": {
    code: `import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const doubled = count * 2;
  return (
    <>
      <p>Antal: {count}. Dubbelt: {doubled}</p>
      <button type="button" onClick={() => setCount(prev => prev + 1)}>+1</button>
      <button type="button" onClick={() => setCount(prev => prev - 1)}>-1</button>
    </>
  );
}`,
    walkthrough: [
      "Båda knapparna skickar callbacks till onClick. Inuti callbacken begär en funktionell uppdatering nästa värde. På så sätt kan plus och minus arbeta mot samma state utan count++ eller annan direkt tilldelning.",
      "doubled beräknas från count vid varje rendering och behöver inget separat useState. Om du sparade båda skulle du behöva hålla dem synkroniserade vid varje ändring. Här ger count = 3 automatiskt doubled = 6 eftersom beräkningen alltid görs från samma count.",
      "Från start ger ett plusklick 1 och ett efterföljande minusklick 0. Exemplet tillåter negativa tal; en gräns vid noll vore en extra regel som måste kodas. Vid felsökning kontrollerar du att uppdateringen ligger i en callback och att det som UI visar faktiskt läser state."
    ],
    questions: [
      ["Varför har doubled inget eget state?", "Det kan räknas ut direkt från count", "React tillåter bara ett state per komponent", "Tal kan inte lagras i state", "Vanliga variabler sparas alltid mellan renderingar", "doubled är härledd data. En beräkning undviker att två state-värden behöver hållas synkroniserade."],
      ["Vilken kod ökar count först när knappen klickas?", "onClick={() => setCount(prev => prev + 1)}", "onClick={setCount(count + 1)}", "onClick={count + 1}", "onClick={count++}", "onClick behöver en funktion. Callbacken skjuter upp setter-anropet tills klicket sker."]
    ],
    statements: ["Plus och minus kan uppdatera samma count-state.", "doubled beräknas på nytt när komponenten renderas.", "count++ är rätt sätt att begära en React-uppdatering.", "Varje beräknat tal som visas måste ha eget useState."],
    statementExplanation: "State ändras via settern. Värden som kan räknas ut från state kan beräknas under rendering i stället för att lagras separat."
  },
};

export function getLessonPageContent(pageId: string) {
  const lesson = studyLessons[pageId];
  if (!lesson) throw new Error(`Saknar lektionsinnehåll för ${pageId}`);
  const [question, correct, wrong1, wrong2, wrong3, explanation] = lesson.questions[0];
  return {
    code: lesson.code,
    quiz: { question, options: [correct, wrong1, wrong2, wrong3], answer: 0, explanation }
  };
}
