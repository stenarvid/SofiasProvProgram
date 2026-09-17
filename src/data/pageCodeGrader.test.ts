import { describe, expect, it } from "vitest";
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
import {
  getPageCodeGradeMode,
  gradePageCode
} from "./pageCodeGrader";

describe("pageCodeGrader", () => {
  it("checks the password length rule on password, not another field or a string", async () => {
    for (const code of [
      'const schema = z.object({ password: z.string(), name: z.string().min(8) });',
      'const example = "password: z.string().min(8)";',
      'const schema = z.object({ password: z.string().min(80) });'
    ]) expect((await gradePageCode("zod-p2", code)).passed, code).toBe(false);
    expect((await gradePageCode("zod-p2", 'const schema = z.object({ password: z.string().min(8, "För kort"), displayName: z.string().min(3) });')).passed).toBe(true);
    expect((await gradePageCode("zod-p2", 'const schema = z.object({ "password": (z.string().min(8)), displayName: z.string().min(3) });')).passed).toBe(true);
  });

  it("requires exactly the requested Role union", async () => {
    for (const code of [
      'type Role = "admin" | "user" | "guest";',
      'type Role = "admin" | "user" | string;',
      'const example = `type Role = "admin" | "user"`;'
    ]) expect((await gradePageCode("typescript-p4", code)).passed, code).toBe(false);
    expect((await gradePageCode("typescript-p4", 'type Role = ("user" | "admin"); function isAdmin(role: Role): boolean { return role === "admin"; }')).passed).toBe(true);
  });

  it("accepts functional updates with parenthesized or typed parameters", async () => {
    const code = `function Counter() {
      const [count, setCount] = useState(0);
      function increment() {
        setCount((previous: number) => previous + 1);
        setCount((previous) => { return previous + 1; });
      }
      return <><button onClick={increment}>{count}</button><button onClick={() => setCount(0)}>Nollställ</button></>;
    }`;
    expect((await gradePageCode("state-p3", code)).passed).toBe(true);
    expect((await gradePageCode("state-p3", code.split("previous + 1").join("count + 1"))).passed).toBe(false);
  });

  it("does not award a pass to unchanged TypeScript errors or an empty answer", async () => {
    expect(getPageCodeGradeMode("typescript-p5")).toBe("self");
    for (const code of ["", 'const age: number = "20"; const active: boolean = "true"; const scores: number[] = [10, "20", 30];']) {
      expect((await gradePageCode("typescript-p5", code)).passed).toBe(false);
    }
  });

  it("does not award a pass merely for mentioning HTTP status codes in wrong roles", async () => {
    expect(getPageCodeGradeMode("server-p3")).toBe("self");
    expect((await gradePageCode("server-p3", 'const success = 404; const created = 200; const missing = 201;')).passed).toBe(false);
  });

  it("does not accept a Hello component that creates JSX without returning it", async () => {
    expect((await gradePageCode("react-p1", 'function Hello() { const unused = <h1>Hej!</h1>; return null; }')).passed).toBe(false);
  });

  it("does not accept required code hidden in comments", async () => {
    const result = await gradePageCode("react-p2", 'function ShowName() { const name = "Anna"; /* <p>{name}</p> */ return null; }');
    expect(result.passed).toBe(false);
  });

  it("preserves strings containing URL and comment markers", async () => {
    const result = await gradePageCode("react-p2", 'function ShowName() { const name = "https://example.test/*name*/"; return <><p>{name}</p><p>{name.toUpperCase()}</p></>; }');
    expect(result.passed).toBe(true);
  });
  it("accepts the React JSX name exercise with its required application", async () => {
    const result = await gradePageCode(
      "react-p2",
      `function ShowName() {
        const name = "Anna";
        return <><p>{name}</p><p>{name.toUpperCase()}</p></>;
      }`
    );

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("rejects react-p2 when the variable is not rendered", async () => {
    const result = await gradePageCode(
      "react-p2",
      `function ShowName() {
        const name = "Anna";
        return <p>Anna</p>;
      }`
    );

    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(100);
  });

  it("grades a Jotai atom exercise", async () => {
    const result = await gradePageCode(
      "jotai-p1",
      `import { atom } from "jotai";
       const themeAtom = atom("dark");
       const languageAtom = atom("sv");`
    );

    expect(result.passed).toBe(true);
  });

  it("grades a Hono GET route exercise", async () => {
    const result = await gradePageCode(
      "hono-p2",
      `import { Hono } from "hono";
       const app = new Hono();
       app.get("/api/hello", (c) => c.json({ message: "Hej!" }));
       app.get("/api/goodbye", (c) => c.json({ message: "Hej då!" }));`
    );

    expect(result.passed).toBe(true);
  });

  it("marks explanation tasks as self-assessed", () => {
    expect(getPageCodeGradeMode("query-p4")).toBe("self");
    expect(getPageCodeGradeMode("server-p4")).toBe("self");
  });

  it("grades react-p4 Profile independently from react-p2", async () => {
    const profileCode = `function Profile() {
      const name = "Anna";
      const title = "Frontendutvecklare";

      return (
        <div>
          <h2>{name}</h2>
          <p>{title}</p>
          <button>Visa profil</button>
          <button onClick={() => window.alert('Kontakt: Sofia')}>Kontakta</button>
        </div>
      );
    }`;

    const result = await gradePageCode("react-p4", profileCode);

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.tests.map((test) => test.name)).toEqual([
      "Profile",
      "Namn",
      "Titel",
      "Knapp",
      "Tillämpa själv"
    ]);
  });

  it("does not use react-p2 rule names for react-p4", async () => {
    const result = await gradePageCode(
      "react-p4",
      `function Profile() {
        const name = "Anna";
        const title = "Frontendutvecklare";
        return <><h2>{name}</h2><p>{title}</p><button>Visa profil</button></>;
      }`
    );

    const names = result.tests.map((test) => test.name);
    expect(names).not.toContain("name-variabel");
    expect(names).not.toContain("p-element");
    expect(names).not.toContain("JSX-uttryck");
  });

  it("keeps all four React page graders distinct", async () => {
    const samples = {
      "react-p1": `function Hello() { return <><h1>Hej!</h1><p>Jag tränar React</p></>; }`,
      "react-p2": `function ShowName() { const name = "Anna"; return <><p>{name}</p><p>{name.toUpperCase()}</p></>; }`,
      "react-p3": `function Header(){return <header />}; function MainContent(){return <main />}; function Footer(){return <footer />}; function App(){return <><Header /><MainContent /><Footer /></>}`,
      "react-p4": `function Profile(){ const name="Anna"; const title="Utvecklare"; return <><h2>{name}</h2><p>{title}</p><button onClick={() => window.alert('Kontakt: Sofia')}>Kontakta</button></>; }`
    } as const;

    for (const [pageId, code] of Object.entries(samples)) {
      const result = await gradePageCode(pageId, code);
      expect(result.score, pageId).toBe(100);
      expect(result.passed, pageId).toBe(true);
    }
  });

});
