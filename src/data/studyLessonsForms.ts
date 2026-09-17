import type { StudyLesson } from "./studyLessons";

export const formLessons: Record<string, StudyLesson> = {
  "forms-p1": {
    code: `import { useState, type FormEvent } from "react";

export default function Form() {
  const [message, setMessage] = useState("");
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Formuläret skickades utan sidladdning");
  }
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Skicka</button>
      <p role="status">{message}</p>
    </form>
  );
}`,
    walkthrough: [
      "Skriv en form-tagg och koppla onSubmit till handleSubmit utan att anropa funktionen direkt. Knappen har type='submit' så att ett klick utlöser formulärets submit-händelse. Handlern sitter på formuläret, vilket samlar beteendet även när ett formulär skickas via tangentbordet.",
      "Parametern e är submit-eventet. FormEvent<HTMLFormElement> beskriver eventets typ i TypeScript och importeras som en typ. e.preventDefault() stoppar webbläsarens vanliga formulärnavigation. Det utför inte validering och skickar inte data till ett API.",
      "I detta första exempel sätter handlern bara ett meddelande i state. Efter klicket visas texten under knappen utan en ny sidladdning. Övningen tränar form, onSubmit och submit-knapp; i följande sidor lägger du till fält, validering och serveranrop."
    ],
    questions: [
      ["Var sitter submit-handlern i exemplet?", "På form via onSubmit", "På p via onChange", "I type-attributet på knappen", "I FormEvent-importen", "Formulärets onSubmit tar hand om submit-händelsen och anropar handleSubmit."],
      ["Vad gör preventDefault här?", "Stoppar webbläsarens vanliga formulärnavigation", "Validerar automatiskt alla state-värden", "Skickar en POST-request", "Återställer automatiskt formuläret", "preventDefault påverkar standardbeteendet. Validering, anrop och återställning behöver egen kod."]
    ],
    statements: ["type='submit' gör knappen till en submit-knapp.", "setMessage gör att resultattexten kan visas i UI:t.", "onSubmit={handleSubmit()} väntar med anropet tills submit sker.", "preventDefault skickar automatiskt formulärdata till servern."],
    statementExplanation: "onSubmit får en funktion och state visar återkoppling. preventDefault stoppar standardbeteendet, medan nätverksanrop måste skrivas separat."
  },
  "forms-p2": {
    code: `import { useState } from "react";

export default function NameField() {
  const [name, setName] = useState("");
  return (
    <>
      <label htmlFor="name">Namn</label>
      <input id="name" value={name} onChange={e => setName(e.target.value)} />
      <p>Hej {name || "besökare"}!</p>
    </>
  );
}`,
    walkthrough: [
      "Skapa state med en tom sträng innan du returnerar inputen. value={name} binder fältets text till state från första renderingen. label har htmlFor='name' som matchar inputens id, så etiketten kopplas till rätt fält.",
      "onChange läser e.target.value och skickar strängen till setName. När React renderar igen används den nya strängen både i inputen och hälsningen. Skriv Sofia och du får Hej Sofia!. Om strängen är tom väljer uttrycket med || texten besökare.",
      "Koduppgiften kräver båda delarna av kopplingen: value och onChange. defaultValue anger bara ett startvärde för ett okontrollerat fält och är inte samma sak som att styra värdet från state. Ge ett redigerbart controlled input ett strängvärde genom hela dess livstid, inte först undefined och senare text."
    ],
    questions: [
      ["Vad visar hälsningen när name är en tom sträng?", "Hej besökare!", "Hej undefined!", "Hej name!", "Ingen hälsning", "Uttrycket name || 'besökare' använder reservtexten när name är tomt."],
      ["Vilken kombination gör textfältet redigerbart och controlled?", "value={name} och onChange som anropar setName", "Bara defaultValue", "Bara ett id", "value={name} utan onChange eller readOnly", "State styr värdet och onChange uppdaterar samma state från inmatningen."]
    ],
    statements: ["label kan kopplas till input med htmlFor och id.", "e.target.value ger den nya texten i onChange.", "defaultValue följer alltid varje senare state-ändring som value gör.", "Ett redigerbart fält med value behöver aldrig en ändringshandler."],
    statementExplanation: "Etikettkoppling och databindning har olika uppgifter. Ett controlled fält behöver uppdatera sitt styrande state; defaultValue anger bara startvärdet."
  },
  "forms-p3": {
    code: `import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setMessage("Namnet måste ha minst två tecken");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email })
      });
      if (!response.ok) throw new Error("Kunde inte spara");
      setMessage("Sparat!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Okänt fel");
    } finally { setSaving(false); }
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>Namn <input required value={name} onChange={e => setName(e.target.value)} /></label>
      <label>E-post <input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <button type="submit" disabled={saving}>{saving ? "Sparar..." : "Spara"}</button>
      <p role="status">{message}</p>
    </form>
  );
}`,
    walkthrough: [
      "Här samlas två kontrollerade fält i ett riktigt formulär. required kräver innehåll och type='email' låter webbläsaren kontrollera e-postformat före en vanlig submit. Namnet har dessutom en egen regel i handlern: trim tar bort omgivande blanksteg och längden ska vara minst två.",
      "Om namnregeln misslyckas visas ett meddelande och return stoppar flödet. Annars börjar saving-läget och den validerade informationen serialiseras till JSON i en POST-request. Servern måste erbjuda /api/users och göra sin egen validering, eftersom webbläsarregler inte skyddar servern mot andra klienter.",
      "Prova fallen tom e-post, för kort namn, lyckat svar och serverfel. De ska ge olika återkoppling i stället för att alltid säga Sparat!. finally återställer knappen efter både framgång och fel. Exemplet behåller fältens innehåll även efter framgång, vilket gör det möjligt att ändra och skicka igen."
    ],
    questions: [
      ["Vad händer när name bara innehåller ett tecken och övriga fält är giltiga?", "Ett meddelande visas och ingen fetch görs", "En POST skickas ändå efter setMessage", "Namnet ändras automatiskt till Sofia", "Formuläret återställs automatiskt", "Längdkontrollen går in i felgrenen och return stoppar handlern innan nätverksanropet."],
      ["Varför kontrolleras response.ok innan Sparat! visas?", "För att servern kan ha avvisat requesten", "För att JSON.stringify behöver en statuskod", "För att required inte fungerar på email", "För att setMessage alltid gör en GET", "En mottagen HTTP-response kan fortfarande vara ett felsvar. Framgång visas bara efter en lyckad status."]
    ],
    statements: ["type='email' och required ger webbläsarvalidering vid vanlig submit.", "finally återställer saving efter anropet.", "Klientens validering gör servervalidering onödig.", "Ett mottaget HTTP-svar betyder alltid att formuläret sparades."],
    statementExplanation: "Webbläsarkontroll hjälper användaren men servern måste kontrollera sin input. HTTP-svaret behöver bedömas innan UI:t visar framgång."
  },
  "forms-p4": {
    code: `import { useState, type FormEvent } from "react";

export default function NameForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("Du skickade: " + name);
  }
  return (
    <form onSubmit={handleSubmit}>
      {/* Rättat: value kompletteras med en handler som uppdaterar name. */}
      <label>Namn <input value={name} onChange={e => setName(e.target.value)} /></label>
      <button type="submit">Skicka</button>
      <button type="button" onClick={() => setName("")}>Rensa</button>
      <p role="status">{message}</p>
    </form>
  );
}`,
    walkthrough: [
      "Utgångsfelet är ett input med value={name} men utan onChange. React fortsätter ge fältet samma state-värde även när användaren försöker skriva. Rättningen läser den nya texten från eventet och anropar setName så att nästa rendering får rätt värde.",
      "Formuläret visar också två olika knappar. Skicka har type='submit' och kör formulärets handler. Rensa har type='button' så att den bara tömmer name och inte råkar skicka formuläret. En button inuti ett formulär har annars normalt submit som standardtyp.",
      "Testa att skriva Sofia, rensa och sedan skriva ett nytt namn innan submit. Meddelandet visar namnet vid senaste submit, medan fältet visar nuvarande state. Blanda inte value och defaultValue för att försöka laga ett låst fält; välj om fältet ska styras från React och bygg hela kopplingen."
    ],
    questions: [
      ["Hur rättas ett redigerbart input som har value={name} men saknar onChange?", "Lägg till onChange som anropar setName(e.target.value)", "Lägg till defaultValue bredvid value", "Byt label till div", "Ta bort preventDefault från submit", "Fältets styrande state behöver uppdateras från ändringshändelsen."],
      ["Varför har Rensa-knappen type='button'?", "För att den inte ska skicka formuläret", "För att den ska skicka två gånger", "För att den ska återställa alla state automatiskt", "För att onClick bara fungerar på den typen", "En vanlig knapp i ett formulär kan annars utlösa submit. Här ska den bara köra sin rensningscallback."]
    ],
    statements: ["Ett state-styrt textfält behöver rätt ändringskoppling för att vara redigerbart.", "Submit-handlern kan läsa det aktuella name-värdet.", "Alla knappar inuti form bör utelämna type oavsett uppgift.", "value och defaultValue måste alltid användas tillsammans."],
    statementExplanation: "Välj controlled eller uncontrolled för fältet och ange knapptyp efter beteende. Submit och återställning är olika handlingar."
  },
  "props-p1": {
    code: `type GreetingProps = { name: string };

function Greeting({ name }: GreetingProps) {
  return <p>Hej {name}!</p>;
}

export default function App() {
  return <><Greeting name="Sofia" /><Greeting name="Anna" /></>;
}`,
    walkthrough: [
      "App är parent och Greeting är child. Varje Greeting-element skickar en prop som heter name. Funktionen tar emot ett props-objekt, och { name } i parameterlistan plockar ut just det fältet genom destructuring. GreetingProps anger att värdet ska vara en sträng.",
      "Inuti JSX används {name} för att visa det mottagna värdet. Resultatet blir två rader: Hej Sofia! och Hej Anna!. Det behövs inte två funktioner för olika namn, eftersom samma komponent kan renderas med olika indata.",
      "Uppgiften ber om Greeting som tar en name-prop, så både mottagandet och användningen ska finnas. Child ska behandla props som read-only. Om namnet ska kunna ändras bestämmer den som äger datan det, ofta genom state i parent och nya props vid nästa rendering."
    ],
    questions: [
      ["Varifrån kommer name i den första Greeting-instansen?", "Från name='Sofia' i App", "Från ett eget useState i Greeting", "Från funktionsnamnet Greeting", "Från p-elementets standardtext", "Parent skickar name som en prop. Greeting läser den genom sin parameter."],
      ["Vad visar de två Greeting-elementen?", "Hej Sofia! och Hej Anna!", "Hej name! två gånger", "Bara den sista hälsningen", "Två tomma p-element", "Varje användning får sitt eget name-värde även om komponentdefinitionen är gemensam."]
    ],
    statements: ["Props gör att samma komponent kan visa olika innehåll.", "{ name } i parameterlistan plockar ut ett fält ur props.", "Greeting behöver ändra sin prop direkt för att visa den.", "Två instanser måste alltid ha samma props."],
    statementExplanation: "Props är indata till en komponent. De läses och används för rendering utan direkt mutation i child."
  },
  "props-p2": {
    code: `type Props = {
  title: string;
  price: number;
  description?: string;
};

function Product({ title, price, description = "Ingen beskrivning" }: Props) {
  return <article><h2>{title}</h2><p>{price} kr</p><p>{description}</p></article>;
}

export default function App() {
  return <Product title="Bok" price={99} />;
}`,
    walkthrough: [
      "Definiera Props före komponenten. title och price saknar frågetecken och måste skickas in med rätt typer. description?: string är valfri; när den utelämnas blir den undefined, vilket standardvärdet i parameterlistan fångar upp.",
      "App skickar title som text och price={99} som ett tal. price='99' skulle i stället vara en sträng och ge ett typfel. Resultatet visar Bok, 99 kr och Ingen beskrivning eftersom någon description inte skickas in.",
      "Övningen kräver title:string, price:number och description?:string, samt Product och ett användningsexempel. Valfri betyder här att den som använder Product kan utelämna description, inte att du ska lämna bort fältet från typdefinitionen. TypeScript kontrollerar anropen under utveckling men validerar inte hämtad JSON vid runtime."
    ],
    questions: [
      ["Varför skrivs price={99} i App?", "För att skicka ett number i stället för en sträng", "För att göra price valfri", "För att lägga priset i state", "För att dölja priset", "Klamrarna innehåller JavaScript-talet 99. Citattecken runt 99 skulle ge text."],
      ["Vad visas när description inte skickas?", "Ingen beskrivning", "undefined som synlig text", "Ett obligatoriskt typfel", "Titeln två gånger", "description är valfri och komponenten ger den standardvärdet Ingen beskrivning."]
    ],
    statements: ["title och price är obligatoriska i Props.", "description kan utelämnas vid anropet.", "price='99' och price={99} har samma TypeScript-typ.", "Ett frågetecken gör att en property alltid blir en string oavsett värde."],
    statementExplanation: "Frågetecknet styr valfrihet, inte konvertering. Typen för varje skickat värde behöver fortfarande stämma."
  },
  "props-p3": {
    code: `import { useState } from "react";

type CounterProps = { count: number; onIncrement: () => void };
function Counter({ count, onIncrement }: CounterProps) {
  return <button type="button" onClick={onIncrement}>Antal: {count}</button>;
}

export default function App() {
  const [count, setCount] = useState(0);
  return <Counter count={count} onIncrement={() => setCount(prev => prev + 1)} />;
}`,
    walkthrough: [
      "App äger count som state. Counter får samma värde som en prop och visar det. Samma data kan alltså vara state i parent och prop i child; begreppen beskriver hur respektive komponent får och använder värdet.",
      "Counter får också callbacken onIncrement som prop. Ett klick anropar den, varpå App kör sin setter och skickar ett nytt count vid rendering. Child ändrar inte count direkt. Typen () => void anger en funktion utan parametrar vars returvärde inte används här.",
      "I förklaringsuppgiften kan du använda detta som exempel: parent behöver äga det gemensamma värdet, child visar det och meddelar en användarhandling via callback. Kopierar du i onödan count till eget state i Counter riskerar du två värden som inte längre följer varandra."
    ],
    questions: [
      ["Var är count state respektive prop i exemplet?", "State i App och prop i Counter", "Prop i App och state i Counter", "Alltid state i båda", "Alltid prop i båda", "App skapar värdet med useState och skickar det sedan som indata till Counter."],
      ["Hur kan Counter begära en ökning utan att mutera sin prop?", "Anropa onIncrement-callbacken", "Skriva count++", "Ändra CounterProps till any", "Skapa en global variabel med samma namn", "Callbacken låter parent utföra uppdateringen där state ägs."]
    ],
    statements: ["Props kan vara funktioner.", "Parent kan skicka sitt state som props till ett barn.", "Child behöver alltid en egen kopia av varje prop i useState.", "Props får ändras direkt så länge de innehåller tal."],
    statementExplanation: "Props kan bära både värden och callbacks. Ägaren sköter uppdateringen och child läser nya props utan direkt mutation eller onödiga kopior."
  },
  "databinding-p1": {
    code: `import { useState } from "react";

export default function CityField() {
  const [city, setCity] = useState("Stockholm");
  return (
    <>
      <label>Stad <input value={city} onChange={e => setCity(e.target.value)} /></label>
      <p>Vald stad: {city}</p>
    </>
  );
}`,
    walkthrough: [
      "Skapa city med useState och använd det som inputens value. Startvärdet Stockholm visas både i fältet och efter Vald stad. Att samma variabel används på båda ställena är det som håller presentationerna synkroniserade.",
      "När användaren skriver anropas onChange med ett event. setCity(e.target.value) sparar den nya strängen och begär en rendering. Bindningen sker alltså genom två uttryckliga kopplingar: value läser state och onChange uppdaterar state.",
      "Koduppgiften ber om just city-state och ett bundet inputfält. Prova att byta stad och följ texten under fältet. Om du bara ändrar inputens DOM-värde manuellt har du inte uppdaterat Reacts state, och nästa rendering kan återställa vad fältet visar."
    ],
    questions: [
      ["Vad visas från början i stadfältet?", "Stockholm", "city", "En tom sträng", "undefined", "useState('Stockholm') ger startvärdet som value använder."],
      ["Vilken del skriver användarens nya text till state?", "setCity(e.target.value) i onChange", "value={city} ensam", "p-elementet", "label-texten Stad", "value läser värdet; ändringshandlern sparar det nya värdet via setCity."]
    ],
    statements: ["Input och p-element läser samma city-state.", "onChange kopplar en UI-händelse till en state-uppdatering.", "value={city} skriver automatiskt alla ändringar tillbaka till state utan handler.", "Direkt DOM-manipulation är nödvändig för ett controlled input."],
    statementExplanation: "Bindningen bygger på state → UI och event → setter. React uppdaterar presentationen när state ändras."
  },
  "databinding-p2": {
    code: `import { useState } from "react";

export default function EmailField() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  return (
    <>
      <label>E-post <input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label><input type="checkbox" checked={subscribed} onChange={e => setSubscribed(e.target.checked)} />Nyhetsbrev</label>
      <p>{email} — {subscribed ? "Prenumererar" : "Prenumererar inte"}</p>
    </>
  );
}`,
    walkthrough: [
      "Textfältets event innehåller det nya värdet i e.target.value. Skicka det till setEmail, inte hela eventet. useState('') gör email till en sträng och handlern fortsätter ge den strängar när användaren skriver.",
      "Checkboxen visar varför rätt property spelar roll: den använder checked={subscribed} och läser e.target.checked, ett boolean-värde. Checkboxens value är inte samma sak som om den är ikryssad. Resultatraden visar båda state-värdena så att du kan följa skillnaden.",
      "Övningen gäller onChange för email; checkboxen är ett jämförelseexempel. För ett numeriskt textfält är value också text, så du behöver välja och kontrollera en konvertering om ditt state ska vara number. Vilken kontroll du använder avgör vad du ska läsa ur eventet."
    ],
    questions: [
      ["Vilket uttryck ger texten från e-postfältet?", "e.target.value", "e.target.checked", "Hela e", "e.type som e-postadress", "value innehåller textvärdet. checked hör till checkboxens boolean-status."],
      ["Vad ska en controlled checkbox läsa och styra?", "checked och e.target.checked", "value och alltid e.target.value som boolean", "Endast placeholder", "Texten i label som state", "Checkboxens kryssmarkering representeras av checked, som är true eller false."]
    ],
    statements: ["Ett textfälts value är en sträng.", "En checkbox kan bindas till ett boolean-state via checked.", "Alla inputtyper använder e.target.value som boolean.", "setEmail ska få hela event-objektet i stället för dess text."],
    statementExplanation: "Läs det värde som motsvarar kontrollens typ. State för email behöver en sträng, medan checkboxens status behöver en boolean."
  },
  "databinding-p3": {
    code: `import { useState } from "react";

export default function LiveName() {
  const [name, setName] = useState("");
  return (
    <>
      <label>Namn <input value={name} onChange={e => setName(e.target.value)} /></label>
      <p>{name}</p>
      <button type="button" onClick={() => setName("Sofia")}>Fyll i Sofia</button>
    </>
  );
}`,
    walkthrough: [
      "Följ hela kedjan när du skriver en bokstav: webbläsaren ger ett change-event, handlern läser texten, setName begär en uppdatering, React kör komponenten igen och både input och p läser det nya name. Ingen av dem behöver kopiera text direkt från det andra elementet.",
      "Knappen visar att dataflödet även fungerar från kod till UI. setName('Sofia') ändrar samma state som tangentbordsinmatningen använder. Därför fylls inputen och p-elementet samtidigt. State är källan till sanningen för båda visningarna.",
      "Övningen kräver input och p som visar samma namn live. Om bara fältet ändras kontrollerar du först att p använder {name}. Om fältet inte går att redigera kontrollerar du onChange och settern. Om knappens ändring inte når fältet kan det ha defaultValue i stället för value."
    ],
    questions: [
      ["Vad händer när Fyll i Sofia klickas?", "Både input och p visar Sofia", "Bara p visar Sofia", "Bara input visar Sofia", "State ändras men UI kan aldrig uppdateras från en knapp", "Båda elementen läser name, som knappen uppdaterar till Sofia."],
      ["Vilken ordning beskriver en textändring?", "onChange → setName → rendering med nytt state", "Rendering → serverstart → setName", "setName → automatisk formulärsubmit → onChange", "p-elementet skriver direkt till inputens DOM", "Eventet leder till en state-uppdatering som React sedan använder vid rendering."]
    ],
    statements: ["Inputen och p-elementet följer samma state.", "En knapp kan uppdatera ett controlled inputs innehåll via settern.", "p-elementet måste läsa inputen med document.querySelector.", "defaultValue ger alltid samma löpande koppling som value."],
    statementExplanation: "Ett gemensamt state håller vyerna synkade. defaultValue beskriver startvärdet för ett okontrollerat fält, inte en löpande state-bindning."
  }
};
