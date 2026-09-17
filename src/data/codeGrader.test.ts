import { describe, expect, it, vi } from "vitest";
import { gradeExercise } from "./codeGrader";

(globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;

describe("codeGrader", () => {
  it("grades interactive code through the production update path", async () => {
    vi.stubEnv("PROD", true);
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = false;
    try {
      const result = await gradeExercise("counter", 'function Counter() { const [count, setCount] = useState(0); return <button onClick={() => setCount(c => c + 1)}>{count}</button>; }');
      expect(result.score).toBe(100);
    } finally {
      vi.unstubAllEnvs();
      (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    }
  });
  it("accepts a working counter using functional state updates", async () => {
    const result = await gradeExercise("counter", `
      import { useState } from "react";
      function Counter() {
        const [value, update] = useState(0);
        return <button onClick={() => update(v => v + 1)}>Count: {value}</button>;
      }
    `);
    expect(result.score).toBe(100);
  });

  it("rejects a counter that does not increment", async () => {
    const result = await gradeExercise("counter", `
      import { useState } from "react";
      function Counter() {
        const [value] = useState(0);
        return <button>Count: {value}</button>;
      }
    `);
    expect(result.score).toBeLessThan(100);
  });

  it("accepts a prop-driven Greeting and prevents hardcoded output", async () => {
    const good = await gradeExercise("greeting", `
      type Props = { name: string };
      function Greeting(props: Props) { return <h2>Hej {props.name}</h2>; }
    `);
    const bad = await gradeExercise("greeting", `
      type Props = { name: string };
      function Greeting(_props: Props) { return <h2>Hej TestPerson</h2>; }
    `);
    expect(good.score).toBe(100);
    expect(bad.score).toBeLessThan(100);
  });

  it("accepts a genuinely controlled input and rejects a static one", async () => {
    const good = await gradeExercise("name-form", `
      import { useState } from "react";
      function NameForm() {
        const [name, setName] = useState("");
        return <><input value={name} onChange={e => setName(e.target.value)} /><p>{name}</p></>;
      }
    `);
    const bad = await gradeExercise("name-form", `
      function NameForm() { return <><input /><p>static</p></>; }
    `);
    expect(good.score).toBe(100);
    expect(bad.score).toBeLessThan(100);
  });

  it("accepts fetch success+error handling and rejects comment-only response.ok", async () => {
    const good = await gradeExercise("fetch-users", `
      async function getUsers() {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("bad");
        return await response.json();
      }
    `);
    const bad = await gradeExercise("fetch-users", `
      async function getUsers() {
        // response.ok
        const response = await fetch("/api/users");
        return await response.json();
      }
    `);
    expect(good.score).toBe(100);
    expect(bad.score).toBeLessThan(100);
  });

  it("accepts correct Zod behavior and rejects a loose schema", async () => {
    const good = await gradeExercise("zod-form", `
      import { z } from "zod";
      const formSchema = z.object({ name: z.string().min(2), email: z.string().email() });
    `);
    const bad = await gradeExercise("zod-form", `
      import { z } from "zod";
      const formSchema = z.object({ name: z.string(), email: z.string() });
    `);
    expect(good.score).toBe(100);
    expect(bad.score).toBeLessThan(100);
  });

  it("accepts correct Hono route including export default and rejects wrong message", async () => {
    const good = await gradeExercise("hono-get", `
      import { Hono } from "hono";
      const app = new Hono();
      app.get("/api/hello", c => c.json({ message: "Hej!" }));
      export default app;
    `);
    const bad = await gradeExercise("hono-get", `
      import { Hono } from "hono";
      const app = new Hono();
      app.get("/api/hello", c => c.json({ message: "Banan" }));
      export default app;
    `);
    expect(good.score).toBe(100);
    expect(bad.score).toBeLessThan(100);
  });

  it("accepts a counter even when the button also contains another static number", async () => {
    const result = await gradeExercise("counter", `
      import { useState } from "react";
      function Counter() {
        const [count, setCount] = useState(0);
        return <button onClick={() => setCount(v => v + 1)}>Count {count} / Goal 10</button>;
      }
    `);
    expect(result.score).toBe(100);
  });

  it("accepts a props string type through a local type alias", async () => {
    const result = await gradeExercise("greeting", `
      type Name = string;
      interface Props { name: Name }
      function Greeting({ name }: Props) { return <p>{name}</p>; }
    `);
    expect(result.score).toBe(100);
  });

  it("rejects an optional name prop when the task requires name", async () => {
    const result = await gradeExercise("greeting", `
      type Props = { name?: string };
      function Greeting({ name }: Props) { return <p>{name}</p>; }
    `);
    expect(result.score).toBeLessThan(100);
  });

  it("rejects fetch using the wrong endpoint", async () => {
    const result = await gradeExercise("fetch-users", `
      async function getUsers() {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("bad");
        return response.json();
      }
    `);
    expect(result.score).toBeLessThan(100);
  });

  it("rejects a Hono route with the right body on the wrong path", async () => {
    const result = await gradeExercise("hono-get", `
      import { Hono } from "hono";
      const app = new Hono();
      app.get("/api/other", c => c.json({ message: "Hej!" }));
      export default app;
    `);
    expect(result.score).toBeLessThan(100);
  });

  it("rejects syntax errors", async () => {
    const result = await gradeExercise("counter", `function Counter( { return <button>0</button>; }`);
    expect(result.score).toBe(0);
    expect(result.compileError).toBeTruthy();
  });
});
