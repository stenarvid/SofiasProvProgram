const sections = [
  ["React", `function Hello() {
  return <h1>Hej</h1>;
}`],
  ["State", `const [count, setCount] = useState(0);`],
  ["Props", `type Props = { name: string };

function User({ name }: Props) {
  return <p>{name}</p>;
}`],
  ["Databindning", `<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>`],
  ["Router", `<Routes>
  <Route path="/about" element={<About />} />
</Routes>

<Link to="/about">Om</Link>`],
  ["Fetch", `const res = await fetch("/api/users");
if (!res.ok) throw new Error("Fel");
const data = await res.json();`],
  ["React Query", `useQuery({
  queryKey: ["users"],
  queryFn: getUsers
});`],
  ["Jotai", `const countAtom = atom(0);
const [count, setCount] = useAtom(countAtom);`],
  ["Zod", `const schema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});`],
  ["Forms", `<form onSubmit={(e) => {
  e.preventDefault();
}}>
  ...
</form>`],
  ["TypeScript", `type User = {
  id: number;
  name: string;
  age?: number;
};`],
  ["Hono", `app.get("/api/hello", (c) => {
  return c.json({ message: "Hej!" });
});`],
  ["Server", `Klient -> HTTP request -> Server
Server -> HTTP response -> Klient`]
];

export default function CheatSheetPage() {
  return (
    <section>
      <h2>Sista-minuten cheat sheet</h2>
      <p>Kortaste versionen av det viktigaste du bör känna igen och kunna skriva.</p>

      <div className="cheat-grid">
        {sections.map(([title, code]) => (
          <article className="cheat-card" key={title}>
            <h3>{title}</h3>
            <pre><code>{code}</code></pre>
          </article>
        ))}
      </div>
    </section>
  );
}
