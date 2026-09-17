export type Topic = {
  id: string;
  title: string;
  description: string;
  code?: string;
  keyPoints: string[];
  question: string;
  answer: string;
};

export const topics: Topic[] = [
  {
    id: "react",
    title: "React-grunder",
    description:
      "React bygger gränssnitt med komponenter. En komponent är oftast en funktion som returnerar JSX.",
    code: `type Props = {
  name: string;
};

function Greeting({ name }: Props) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Hej {name}</h2>
      <button onClick={() => setCount(count + 1)}>
        {count}
      </button>
    </div>
  );
}`,
    keyPoints: [
      "Komponent = återanvändbar del av UI:t",
      "Props skickas in till komponenten",
      "State lagras i komponenten",
      "useState returnerar värdet och en setter-funktion",
      "JSX låter dig skriva HTML-liknande kod i JavaScript/TypeScript"
    ],
    question: "Vad är skillnaden mellan props och state?",
    answer:
      "Props skickas in utifrån, medan state ägs av komponenten själv och kan förändras."
  },
  {
    id: "typescript",
    title: "TypeScript",
    description:
      "TypeScript är JavaScript med statisk typning. Det hjälper dig hitta många fel redan när du skriver koden.",
    code: `type User = {
  id: number;
  name: string;
  age?: number;
};

function greet(user: User): string {
  return \`Hej \${user.name}\`;
}

const users: User[] = [
  { id: 1, name: "Anna" }
];`,
    keyPoints: [
      "string, number och boolean är vanliga grundtyper",
      "type och interface beskriver objekt",
      "? betyder att en property är valfri",
      "User[] betyder en array av User",
      "Union types skrivs till exempel 'loading' | 'success' | 'error'"
    ],
    question: "Vad betyder age?: number?",
    answer: "Att age är valfri men måste vara ett number om den finns."
  },
  {
    id: "databinding",
    title: "Databinding",
    description:
      "I React styr state vad som visas. Ett inputfält kan kopplas till state med value och onChange.",
    code: `const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<p>{name}</p>`,
    keyPoints: [
      "React använder främst one-way data flow",
      "value läser från state",
      "onChange uppdaterar state",
      "Detta kallas ofta controlled input"
    ],
    question: "Varför behövs onChange när input har value={name}?",
    answer:
      "För att användarens inmatning ska kunna uppdatera state. Annars blir inputfältet i praktiken skrivskyddat."
  },
  {
    id: "bundling",
    title: "Bundling",
    description:
      "Bundling/build innebär att projektets filer bearbetas och förbereds för webbläsaren.",
    code: `npm run dev
npm run build`,
    keyPoints: [
      "Vite används som dev-server och build tool",
      "TypeScript och JSX omvandlas till JavaScript",
      "Imports och filer hanteras av byggverktyget",
      "Produktionsbuilden optimeras"
    ],
    question: "Är bundling samma sak som routing?",
    answer:
      "Nej. Bundling handlar om hur koden byggs. Routing handlar om vilken vy som visas för en URL."
  },
  {
    id: "router",
    title: "React Router",
    description:
      "React Router används för klientrouting så att olika URL:er kan visa olika React-komponenter.",
    code: `<BrowserRouter>
  <nav>
    <Link to="/">Hem</Link>
    <Link to="/about">Om</Link>
  </nav>

  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>`,
    keyPoints: [
      "BrowserRouter omsluter appen",
      "Routes innehåller Route",
      "Route kopplar en path till ett element",
      "Link eller NavLink används för navigation utan full omladdning"
    ],
    question: "Varför används Link istället för vanlig a-tagg?",
    answer:
      "För att React Router ska kunna byta vy på klientsidan utan att hela sidan laddas om."
  },
  {
    id: "fetch",
    title: "Fetch",
    description:
      "fetch används för HTTP-anrop till till exempel ett API.",
    code: `async function getUsers() {
  const response = await fetch("/api/users");

  if (!response.ok) {
    throw new Error("Något gick fel");
  }

  const data = await response.json();
  return data;
}`,
    keyPoints: [
      "fetch returnerar en Promise",
      "await väntar på resultatet",
      "response.ok kan kontrollera HTTP-status",
      "response.json() läser JSON-data"
    ],
    question: "Vad gör await response.json()?",
    answer:
      "Den läser svarets body och omvandlar JSON-innehållet till JavaScript-data."
  },
  {
    id: "react-query",
    title: "React Query",
    description:
      "TanStack React Query hjälper till att hantera server state, cache, loading, errors och refetch.",
    code: `const { data, isLoading, error } = useQuery({
  queryKey: ["users"],
  queryFn: async () => {
    const response = await fetch("/api/users");
    return response.json();
  },
});`,
    keyPoints: [
      "fetch gör själva HTTP-anropet",
      "React Query hanterar server state runt anropet",
      "queryKey identifierar queryn",
      "queryFn hämtar datan",
      "Cache minskar onödiga anrop"
    ],
    question: "Vad är största skillnaden mellan fetch och React Query?",
    answer:
      "fetch gör HTTP-anropet. React Query hanterar bland annat cache, loading, errors och uppdateringar runt anropet."
  },
  {
    id: "hono",
    title: "Hono",
    description:
      "Hono är ett lätt webbframework för JavaScript/TypeScript som kan användas för backend och API-routes.",
    code: `import { Hono } from "hono";

const app = new Hono();

app.get("/api/hello", (c) => {
  return c.json({ message: "Hej!" });
});

export default app;`,
    keyPoints: [
      "Hono används på serversidan",
      "app.get skapar en GET-route",
      "c.json skickar JSON tillbaka",
      "React och Hono kan användas tillsammans som frontend + backend"
    ],
    question: "Är Hono ett React-bibliotek?",
    answer:
      "Nej. Det är ett webbframework som bland annat används för backend/API."
  },
  {
    id: "jotai",
    title: "Jotai",
    description:
      "Jotai är ett state management-bibliotek där state delas upp i små atoms.",
    code: `import { atom, useAtom } from "jotai";

const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}`,
    keyPoints: [
      "atom skapar en state-enhet",
      "useAtom läser och uppdaterar en atom",
      "Passar när flera komponenter behöver dela state",
      "useState räcker ofta för lokalt state"
    ],
    question: "När är Jotai mer användbart än useState?",
    answer:
      "När flera delar av appen behöver komma åt och uppdatera samma state."
  },
  {
    id: "zod",
    title: "Forms & Zod",
    description:
      "Zod används för att definiera schemas och validera data, till exempel formulärdata.",
    code: `import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18),
});

const result = userSchema.safeParse(formData);

if (result.success) {
  console.log(result.data);
} else {
  console.log(result.error);
}`,
    keyPoints: [
      "z.object skapar schema för objekt",
      "z.string och z.number beskriver typer",
      "min och email lägger till valideringsregler",
      "safeParse returnerar success istället för att kasta fel"
    ],
    question: "Vad används Zod till?",
    answer: "Att validera att data har rätt struktur, typer och regler."
  }
];
