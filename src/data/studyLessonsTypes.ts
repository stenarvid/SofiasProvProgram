import type { StudyLesson } from "./studyLessons";

export const typeLessons: Record<string, StudyLesson> = {
  "typescript-p1": {
    code: `const name: string = "Sofia";
const age: number = 20;
const active: boolean = true;

function birthday(currentAge: number): number {
  return currentAge + 1;
}

console.log(name, birthday(age), active); // Sofia, 21, true
// birthday("20") skulle ge typfel: string är inte number.
export {};`,
    walkthrough: [
      "Skriv typen efter variabelnamnet och ett kolon. name innehåller text, age ett tal och active en boolean. Citattecken skiljer strängen '20' från talet 20. I uppgiften tränar du dessa tre deklarationer; funktionen visar varför skillnaden spelar roll när värden används.",
      "birthday tar ett number och lovar att returnera ett number. När age skickas in beräknas 20 + 1 och konsolen visar 21. Ett anrop med strängen '20' bryter mot kontraktet och kan upptäckas av TypeScript före körning. Typannoteringen konverterar inte strängen åt dig.",
      "Exemplet kan ligga i en .ts-fil och visar sitt resultat i konsolen. export {} gör filen till en modul så att name inte krockar med webbläsarens globala namn i en fristående övning. TypeScript hjälper vid utveckling, men verkliga API-svar behöver fortfarande kontrolleras när programmet körs."
    ],
    questions: [
      ["Vad returnerar birthday(age) i exemplet?", "21", "Strängen 201", "20", "true", "age är talet 20 och funktionen adderar 1 numeriskt."],
      ["Varför ger birthday('20') ett typfel?", "Parametern kräver number men anropet skickar string", "Funktioner får inte ta parametrar", "20 är för stort för number", "Returtypen borde alltid vara boolean", "Citattecknen gör argumentet till text. TypeScript kontrollerar att argumentet passar parameterns typ."]
    ],
    statements: ["TypeScript kan hitta en felaktig argumenttyp före körning.", "string, number och boolean beskriver olika sorters värden.", "En number-annotering omvandlar automatiskt strängen '20' till talet 20.", "Typannoteringar validerar automatiskt varje nätverkssvar i webbläsaren."],
    statementExplanation: "Typer kontrollerar hur koden används under utveckling. Konvertering och runtime-validering behöver körbar kod."
  },
  "typescript-p2": {
    code: `const numbers: number[] = [10, 20, 30];
const names: string[] = ["Sofia", "Anna"];
const active: boolean = true;

const doubled: number[] = numbers.map(value => value * 2);
console.log(doubled); // [20, 40, 60]
console.log(names.length, active); // 2, true
// numbers.push("40") skulle ge typfel.
export {};`,
    walkthrough: [
      "number[] betyder en array vars element är tal, inte att arrayen måste ha ett visst antal element. Övningen kräver tre tal och exemplet börjar med 10, 20 och 30. string[] beskriver motsvarande lista med text och boolean beskriver ett enskilt true/false-värde.",
      "map går igenom numbers och skapar en ny array. Varje value är ett number, så multiplikation med 2 ger [20, 40, 60]. Ursprungliga numbers är fortfarande [10, 20, 30]. TypeScript kan ofta härleda dessa typer, men explicita annoteringar gör övningens kontrakt lätt att se.",
      "push med strängen '40' skulle bryta mot elementtypen. push(40) passar däremot typen. const betyder att variabeln inte kan tilldelas en helt annan array; det gör inte arrayens innehåll automatiskt oföränderligt. Om du behöver låsa innehållet finns readonly-typer, men de krävs inte i denna uppgift."
    ],
    questions: [
      ["Vilket värde har doubled?", "[20, 40, 60]", "[10, 20, 30, 2]", "['20', '40', '60']", "60 som ett enda tal", "map multiplicerar varje tal med två och returnerar en ny array."],
      ["Varför passar inte numbers.push('40')?", "Arrayens element måste vara number, men '40' är string", "En array får alltid exakt tre element", "const förbjuder alla metodanrop", "push fungerar bara på string[]", "number[] ställer krav på varje element. Längden är inte begränsad av den typen."]
    ],
    statements: ["number[] beskriver en array med tal som element.", "map kan skapa en ny array utan att ändra originalet.", "const gör automatiskt varje array-element skrivskyddat.", "boolean ska innehålla strängarna 'true' eller 'false'."],
    statementExplanation: "Elementtyp och muterbarhet är olika frågor. Boolean-värden är true/false utan citattecken; const låser variabelbindningen."
  },
  "typescript-p3": {
    code: `type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
};

const product: Product = { id: 1, title: "Bok", price: 99 };
function describeProduct(item: Product): string {
  return item.title + ": " + (item.description ?? "Ingen beskrivning");
}
console.log(describeProduct(product)); // Bok: Ingen beskrivning`,
    walkthrough: [
      "Skapa Product som en objekttyp med de fält uppgiften anger. Varje property får sin egen typ. id, title och price är obligatoriska, medan description med frågetecken får utelämnas. Objektet product uppfyller typen även utan description.",
      "describeProduct tar emot samma typ och kan därför läsa dess fält med editorstöd. description kan vara undefined, så ?? väljer en reservtext när beskrivningen saknas. Resultatet i konsolen blir Bok: Ingen beskrivning. Att anropa en strängmetod direkt på en saknad description vore däremot osäkert.",
      "Du kan beskriva samma objektform med interface Product och ett block med properties. Båda formerna kan återanvändas för variabler och funktionsparametrar. Att skriva en typ skapar inget produktobjekt vid körning; const product är den separata raden som skapar värdet."
    ],
    questions: [
      ["Varför är product giltig utan description?", "description är valfri genom ?", "Alla properties är alltid valfria", "TypeScript fyller i en tom sträng automatiskt", "const tar bort property-kontrollen", "Frågetecknet gör just description valfri. De andra tre fälten är fortfarande obligatoriska."],
      ["Vad gör item.description ?? 'Ingen beskrivning'?", "Använder reservtext när description är null eller undefined", "Skapar en description på alla produkter i databasen", "Gör price till en sträng", "Kontrollerar om title är tom", "Nullish coalescing ger reservvärdet när vänstersidan saknas som null eller undefined."]
    ],
    statements: ["Product kan användas som typ för flera olika produktobjekt.", "Valfria fält behöver hanteras när de kan saknas.", "En type-deklaration skapar automatiskt ett objekt vid körning.", "description?: string betyder att price också blir valfri."],
    statementExplanation: "Typen beskriver en form men skapar inte värden. Valfriheten gäller den markerade propertyn och kräver hänsyn när den läses."
  },
  "typescript-p4": {
    code: `type Role = "admin" | "user";

function describeRole(role: Role): string {
  if (role === "admin") return "Kan administrera";
  return "Vanlig användare";
}

const role: Role = "user";
console.log(describeRole(role)); // Vanlig användare
// describeRole("guest") skulle ge typfel.`,
    walkthrough: [
      "Skriv Role som en union av två strängliteraler. Det betyder att de exakta strängarna 'admin' och 'user' är tillåtna. Typen string hade tillåtit vilken sträng som helst; denna union gör kontraktet mer precist och hjälper editorn föreslå rätt värden.",
      "describeRole tar en Role och returnerar en string. Jämförelsen med 'admin' väljer text för administratören; annars återstår 'user' eftersom unionen bara har två alternativ. I exemplet blir resultatet Vanlig användare. Returtypen står efter parameterlistan.",
      "Koduppgiften tränar både Role-unionen och describeRole med parameter- och returtyp. 'guest' passar inte kontraktet. Om rollen kommer från ett API måste du kontrollera den verkliga strängen innan du litar på den; en union i TypeScript utför inte behörighetskontroll på servern."
    ],
    questions: [
      ["Vilket värde ingår inte i Role?", "'guest'", "'admin'", "'user'", "Variabeln role med värdet 'user'", "Unionen listar bara admin och user, så guest är inte ett tillåtet alternativ."],
      ["Vad beskriver : string efter describeRoles parameterlista?", "Funktionens returtyp", "Att role kan vara vilken sträng som helst", "Att funktionen inte får returnera", "Att Role blir valfri", "Parametern har typen Role och returvärdet ska vara string; de annoteras på olika platser."]
    ],
    statements: ["En union kan begränsa ett värde till bestämda strängalternativ.", "Funktionsparametrar och returvärden kan ha olika typer.", "Role tillåter alla strängar eftersom alternativen är strängar.", "En Role-typ ersätter serverns kontroll av användarens behörighet."],
    statementExplanation: "Strängliteraler ger ett smalare kontrakt än string. Statisk typkontroll är inte samma sak som runtime- eller behörighetskontroll."
  },
  "typescript-p5": {
    code: `// Fel: const age: number = "20";
const age: number = 20;

// Fel: const active: boolean = "true";
const active: boolean = true;

// Fel: const scores: number[] = [10, "20", 30];
const scores: number[] = [10, 20, 30];

function lengthOf(value: unknown): number {
  if (typeof value === "string") return value.length;
  return 0;
}
console.log(age, active, scores, lengthOf("Sofia"));`,
    walkthrough: [
      "Tre konkreta typfel står som kommentarer och följs av rättad kod. Jämför förväntad typ med verkligt värde: age kräver ett tal, active en boolean och varje scores-element ett tal. Här är rättningen att använda värden av rätt typ, inte att byta allt till any.",
      "När data kommer som text från ett formulär kan du behöva konvertera med exempelvis Number, men då måste även ett misslyckat resultat som NaN hanteras. I dessa fasta deklarationer räcker det att ta bort citattecken där de gav fel typ. En cast ändrar inte värdet vid körning.",
      "lengthOf visar ett annat felsökningsmönster: value är unknown och får därför inte användas som sträng direkt. typeof-kontrollen begränsar typen i den grenen, där length blir tillgänglig. I övningen rättar du de tre deklarationerna utan any eller casts och skriver lengthOf; testa både 'Sofia' och 42. Den körbara koden visar facit."
    ],
    questions: [
      ["Vilken rättning behåller age som number och ger ett korrekt värde?", "const age: number = 20", "const age: any = '20'", "const age: number = '20'", "const age: number = true", "Talet 20 passar number. any skulle dölja problemet utan att göra strängen till ett tal."],
      ["Varför kan value.length läsas inne i typeof-grenen?", "TypeScript vet där att value är en string", "unknown innebär alltid string", "typeof gör automatiskt alla värden till text", "length finns på alla JavaScript-värden", "Typkontrollen smalnar av unknown i just den gren där jämförelsen visar att värdet är text."]
    ],
    statements: ["Ett enda string-element kan bryta mot number[]-typen.", "En typeof-kontroll kan göra ett unknown-värde säkert att använda som string.", "En cast konverterar alltid värdet vid körning.", "any är nödvändigt för att rätta en boolean som fått strängen 'true'."],
    statementExplanation: "Rätta värdets typ eller kontrollera det innan användning. Cast och any ersätter inte konvertering och validering."
  }
};
