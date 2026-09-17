import { useState } from "react";
import { gradeExercise, type GradeResult } from "../data/codeGrader";

type Props = {
  reading: string[];
  debug: string[];
  coding: string[];
  chain: string;
  oral: string[];
};

export default function FinalExamReview({ reading, debug, coding, chain, oral }: Props) {
  const [results, setResults] = useState<(GradeResult | null)[]>([null, null]);
  const [busy, setBusy] = useState(false);

  async function checkCode() {
    setBusy(true);
    const next: GradeResult[] = [];
    for (const [id, code] of [["counter", coding[0]], ["fetch-users", coding[2]]]) {
      try {
        next.push(await gradeExercise(id, code));
      } catch (error) {
        next.push({ score: 0, passed: false, tests: [], compileError: error instanceof Error ? error.message : "Koden kunde inte köras." });
      }
    }
    setResults(next);
    setBusy(false);
  }

  const sections = [
    { title: "Kodläsning 1", answer: reading[0], guide: "3. count är 2 och uttrycket count + 1 blir 3." },
    { title: "Kodläsning 2", answer: reading[1], guide: "Nej. age?: number betyder att age är valfri." },
    { title: "Debug 1", answer: debug[0], guide: "return await response.json(); anropar metoden. I en async-funktion fungerar också return response.json(); eftersom promisen returneras." },
    { title: "Debug 2", answer: debug[1], guide: 'Använd <Route path="/about" element={<About />} />. path matchar URL:en och element anger vad som visas.' },
    { title: "Counter", answer: coding[0], guide: "Counter ska visa 0 i en knapp och sedan 1 och 2 efter två klick. Använd useState och en klickfunktion." },
    { title: "Props – självbedömning", answer: coding[1], guide: "UserCard tar emot name:string och age:number som obligatoriska props och visar båda. Testa med två olika namn och åldrar; texten ska följa props, inte vara hårdkodad." },
    { title: "Fetch", answer: coding[2], guide: "getUsers ska hämta /api/users, kontrollera response.ok, kasta vid HTTP-fel och returnera resultatet från response.json()." },
    { title: "Kedjeuppgift – självbedömning", answer: chain, guide: "Kontrollera value/onChange för båda fälten, preventDefault vid submit, safeParse och synliga valideringsfel, POST med JSON-body och Content-Type, matchande Hono-route, validering även på servern och JSON-response. Testa giltig data, ogiltig e-post och serverfel." },
    { title: "Props och state – självbedömning", answer: oral[0], guide: "Props kommer från den som använder komponenten och behandlas som read-only. State ägs av komponenten och uppdateras med en setter. Ge ett eget exempel och förklara hur barnet kan be en parent ändra data via en callback." },
    { title: "Request och response – självbedömning", answer: oral[1], guide: "Klienten skickar metod, URL och eventuell body. Servern matchar en route, validerar och bearbetar data och skickar status och body tillbaka. Klienten kontrollerar status, läser datan och uppdaterar UI." }
  ];

  return <div className="panel">
    <h3>Gå igenom dina svar</h3>
    <p>Teoripoängen gäller bara flervalsfrågorna. Jämför övriga svar med förklaringarna och testa koden. Ett tomt svar är inte en klarad uppgift.</p>
    {sections.map(section => <article className="exam-task" key={section.title}>
      <h4>{section.title}</h4>
      <pre style={{ whiteSpace: "pre-wrap" }}><code>{section.answer.trim() || "Inget svar lämnat."}</code></pre>
      <p>{section.guide}</p>
    </article>)}
    <button className="primary-button" type="button" disabled={busy} onClick={checkCode}>
      {busy ? "Testar koden..." : "Testa counter och fetch"}
    </button>
    <p>Testerna kör counter-klick och fetch med simulerade lyckade svar och HTTP-fel. Övriga uppgifter har bedömningsstöd ovan.</p>
    {results.map((result, index) => result && <div key={index} role="status">
      <h4>{index === 0 ? "Counter" : "Fetch"}: {result.score}% av testerna klarade</h4>
      {result.compileError && <p>{result.compileError}</p>}
      <ul>{result.tests.map(test => <li key={test.name}>{test.passed ? "✓" : "✗"} {test.name}: {test.details}</li>)}</ul>
    </div>)}
  </div>;
}
