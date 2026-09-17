import { describe, expect, it } from "vitest";
import {
  getPageCodeGradeMode,
  gradePageCode
} from "./pageCodeGrader";

describe("pageCodeGrader", () => {
  it("accepts the React JSX name exercise from the reported screenshot", async () => {
    const result = await gradePageCode(
      "react-p2",
      `function ShowName() {
        const name = "Anna";
        return <p>{name}</p>;
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
       const themeAtom = atom("dark");`
    );

    expect(result.passed).toBe(true);
  });

  it("grades a Hono GET route exercise", async () => {
    const result = await gradePageCode(
      "hono-p2",
      `import { Hono } from "hono";
       const app = new Hono();
       app.get("/api/hello", (c) => c.json({ message: "Hej!" }));`
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
      "Knapp"
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
      "react-p1": `function Hello() { return <h1>Hej!</h1>; }`,
      "react-p2": `function ShowName() { const name = "Anna"; return <p>{name}</p>; }`,
      "react-p3": `function Header(){return <header />}; function Footer(){return <footer />}; function App(){return <><Header /><Footer /></>}`,
      "react-p4": `function Profile(){ const name="Anna"; const title="Utvecklare"; return <><h2>{name}</h2><p>{title}</p><button>Visa</button></>; }`
    } as const;

    for (const [pageId, code] of Object.entries(samples)) {
      const result = await gradePageCode(pageId, code);
      expect(result.score, pageId).toBe(100);
      expect(result.passed, pageId).toBe(true);
    }
  });

});
