import { expect, it } from "vitest";
import { studyTopics } from "./studyTopics";
import { studyLessons } from "./studyLessons";
import { studyGuidance } from "./studyGuidance";
import { transferPractice } from "./transferPractice";
import { gradePageCode, getPageCodeGradeMode } from "./pageCodeGrader";
import { extendedCodePages } from "./extendedPageGrader";
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

it("adds a required application task to every lesson without changing the teaching example", () => {
  expect(Object.keys(transferPractice).sort()).toEqual(studyTopics.flatMap(topic => topic.pages.map(page => page.id)).sort());
  for (const [id, extension] of Object.entries(transferPractice)) {
    expect(studyGuidance[id].task).toBe(`Tillämpa själv: ${extension.task}`);
    expect(studyGuidance[id].checks.join(" ")).toContain(extension.check);
    if (getPageCodeGradeMode(id) === "auto" && !extendedCodePages.includes(id)) expect(extension.pattern, id).toBeDefined();
  }
});

it.each(Object.keys(studyLessons).filter(id => getPageCodeGradeMode(id) === "auto"))(
  "%s does not pass when submitting the unchanged lesson example", async id => {
    const result = await gradePageCode(id, studyLessons[id].code);
    expect(result.passed).toBe(false);
    expect(result.tests.some(test => test.name.startsWith("Tillämpa själv") && !test.passed)).toBe(true);
  }
);

it("does not count an extension hidden in a comment or a string", async () => {
  for (const extra of ['// setCount(5)', 'const hint = "setCount(5)";']) {
    const result = await gradePageCode("state-p2", studyLessons["state-p2"].code + "\n" + extra);
    expect(result.tests.find(test => test.name === "Tillämpa själv")?.passed).toBe(false);
  }
});

it.each([
  ["state-p2", `import { useState } from 'react';
    function Counter() {
      const [count, setCount] = useState(5);
      return <><button onClick={() => setCount(count + 1)}>{count}</button>
        <button onClick={() => setCount(5)}>Återställ</button></>;
    }`],
  ["state-p4", `import { useState } from 'react';
    function NameEditor() {
      const [name, setName] = useState('');
      return <><input value={name} onChange={e => setName(e.target.value)} /><p>{name}</p>
        <button onClick={() => setName('Kim')}>Fyll i Kim</button></>;
    }`],
  ["router-p1", `import { BrowserRouter, Routes, Route } from 'react-router-dom';
    function Home(){return <h1>Hem</h1>}
    function About(){return <h1>Om oss</h1>}
    function Contact(){return <h1>Kontakt</h1>}
    function App(){return <BrowserRouter><Routes>
      <Route path='/' element={<Home />} /><Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
    </Routes></BrowserRouter>}`],
  ["fetch-p1", `async function getUsers(){const response = await fetch('/api/users');
    if (!response.ok) throw new Error('HTTP-fel'); return response.json();}
    async function getProducts(){const response = await fetch('/api/products');
    if (!response.ok) throw new Error('HTTP-fel'); return response.json();}
    getProducts().then(console.log).catch(console.error);`],
  ["fetch-p2", `async function getUsers(){const response = await fetch('/api/users');
    if (!response.ok) throw new Error('HTTP-fel'); return response.json();}
    async function getProducts(){const response = await fetch('/api/products');
    if (!response.ok) throw new Error('HTTP-fel'); return response.json();}`],
  ["fetch-p3", `async function createPost(){ const response = await fetch('/api/posts', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title: 'Hej', published: false}) });
    if (!response.ok) throw new Error('HTTP-fel'); return response.json(); }`],
  ["query-p2", `function useProducts(productId: string) {
    const list = useQuery({queryKey: ['products'], queryFn: getProducts});
    const detail = useQuery({queryKey: ['product', productId], queryFn: () => getProduct(productId)});
    return {list, detail};
  }`],
  ["databinding-p2", `function Fields(){
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    return <><input type='email' value={email} onChange={e => setEmail(e.target.value)} />
      <input type='checkbox' checked={subscribed} onChange={e => setSubscribed(e.target.checked)} />
      <button onClick={() => setSubscribed(false)}>Avsluta prenumeration</button></>;
  }`],
  ["typescript-p1", `const name: string = 'Sofia'; const age: number = 20; const active: boolean = true;
    const nextAge: number = age + 1; console.log(nextAge); export {};`],
  ["typescript-p2", `const numbers: number[] = [10,20,30];
    const doubled: number[] = numbers.map(value => value * 2);
    const tripled: number[] = numbers.map(value => value * 3);
    console.log(doubled, tripled); export {};`],
  ["typescript-p3", `type Product = { id: number; title: string; price: number; description?: string; stock: number };
    const product: Product = {id: 1, title: 'Bok', price: 99, stock: 3};
    console.log(product.description ?? 'Ingen beskrivning');`],
  ["hono-p1", `import { Hono } from 'hono'; const app = new Hono();
    app.get('/api/status', c => c.json({ready: true})); export default app;`]
])("%s accepts an applied solution beyond the reference example", async (id, code) => {
  const result = await gradePageCode(id, code);
  expect(result.tests.filter(test => !test.passed), id).toEqual([]);
  expect(result.passed).toBe(true);
  expect(result.score).toBe(100);
});
