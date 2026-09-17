import React, { useMemo, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { LiveError, LivePreview, LiveProvider } from "react-live";
import * as ts from "typescript";
import { atom, useAtom } from "jotai";
import { gradeExercise, type GradeResult } from "../data/codeGrader";
import { recordCodeAttempt, recordHintUse, recordSolutionView } from "../data/codeProgress";
import { configureCourseEditor } from "../data/monacoCourseTypes";

type Difficulty = "easy" | "normal" | "hard";

type PreviewConfig = {
  componentName: string;
  props?: string;
};

type Exercise = {
  id: string;
  topic: string;
  title: string;
  easyDescription: string;
  normalDescription: string;
  hardDescription: string;
  easyStarter: string;
  normalStarter: string;
  hardStarter: string;
  solution: string;
  hints: string[];
  preview?: PreviewConfig;
};

const exercises: Exercise[] = [
  {
    id: "counter",
    topic: "State",
    title: "Counter",
    easyDescription:
      "Gör en counter i React. Börja med useState(0). Spara värdet i count och setter-funktionen i setCount. Visa count i en button och använd onClick={() => setCount(count + 1)} för att öka värdet.",
    normalDescription:
      "Gör en React-counter med useState. Knappen ska visa värdet och öka det med 1.",
    hardDescription:
      "Gör en counter i React.",
    easyStarter: `import { useState } from "react";

function Counter() {
  // 1. Skapa state som börjar på 0:
  // const [count, setCount] = useState(0);

  return (
    <button
      // 2. Lägg till onClick som ökar count
    >
      {/* 3. Visa count här */}
    </button>
  );
}
`,
    normalStarter: `import { useState } from "react";

function Counter() {
  // state här

  return (
    <button>
      Count: {/* visa count */}
    </button>
  );
}
`,
    hardStarter: `import { useState } from "react";

function Counter() {

}
`,
    solution: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
    hints: ["useState(0)", "onClick behöver en funktion", "setCount(count + 1)"],
    preview: { componentName: "Counter" }
  },
  {
    id: "greeting",
    topic: "Props",
    title: "Greeting med props",
    easyDescription:
      "Skapa typen Props med name:string. Ta emot name genom destructuring i Greeting och visa Hej + namnet i ett h2-element.",
    normalDescription:
      "Skapa Greeting som tar emot name:string som prop och visar Hej + namnet.",
    hardDescription:
      "Gör en komponent som använder props.",
    easyStarter: `type Props = {
  // 1. Lägg till name: string
};

function Greeting({ name }: Props) {
  return (
    // 2. Visa "Hej" och name i ett element
    <div></div>
  );
}
`,
    normalStarter: `type Props = {
  name: string;
};

function Greeting({ name }: Props) {
  // rendera här
}
`,
    hardStarter: `function Greeting() {

}
`,
    solution: `type Props = {
  name: string;
};

function Greeting({ name }: Props) {
  return <h2>Hej {name}</h2>;
}`,
    hints: ["Props kan beskrivas med type", "Använd { name }", "JSX-uttryck skrivs inom { }"],
    preview: { componentName: "Greeting", props: `name="Sofia"` }
  },
  {
    id: "name-form",
    topic: "Databindning",
    title: "Controlled input",
    easyDescription:
      "Skapa state name med useState(''). Sätt inputens value till name och uppdatera state med onChange={(e) => setName(e.target.value)}. Visa sedan name under inputfältet.",
    normalDescription:
      "Gör ett controlled input med state name och visa texten under fältet.",
    hardDescription:
      "Gör databindning i ett React-inputfält.",
    easyStarter: `import { useState } from "react";

function NameForm() {
  const [name, setName] = useState("");

  return (
    <>
      <input
        // value={name}
        // onChange={...}
      />
      <p>
        {/* Visa name här */}
      </p>
    </>
  );
}
`,
    normalStarter: `import { useState } from "react";

function NameForm() {
  const [name, setName] = useState("");

  return (
    <>
      <input />
      <p></p>
    </>
  );
}
`,
    hardStarter: `import { useState } from "react";

function NameForm() {

}
`,
    solution: `import { useState } from "react";

function NameForm() {
  const [name, setName] = useState("");

  return (
    <>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>{name}</p>
    </>
  );
}`,
    hints: ["value={name}", "onChange får eventet e", "e.target.value"],
    preview: { componentName: "NameForm" }
  },
  {
    id: "fetch-users",
    topic: "Fetch",
    title: "Hämta users",
    easyDescription:
      "Skapa async-funktionen getUsers. Använd await fetch('/api/users'), kontrollera response.ok och kasta ett Error om requesten misslyckas. Returnera sedan await response.json().",
    normalDescription:
      "Skriv getUsers som hämtar /api/users, kontrollerar response.ok och returnerar JSON.",
    hardDescription:
      "Hämta users från /api/users med fetch.",
    easyStarter: `async function getUsers() {
  // 1. const response = await fetch(...)

  // 2. if (!response.ok) { ... }

  // 3. return await response.json()
}
`,
    normalStarter: `async function getUsers() {
  // fetch
  // response.ok
  // json
}
`,
    hardStarter: `async function getUsers() {

}
`,
    solution: `async function getUsers() {
  const response = await fetch("/api/users");

  if (!response.ok) {
    throw new Error("Kunde inte hämta användare");
  }

  return await response.json();
}`,
    hints: ["fetch returnerar Promise", "Kontrollera response.ok", "response.json() måste anropas"]
  },
  {
    id: "zod-form",
    topic: "Zod",
    title: "Form schema",
    easyDescription:
      "Importera z från zod. Skapa formSchema med z.object. name ska vara z.string().min(2) och email ska vara z.string().email().",
    normalDescription:
      "Skapa ett Zod-schema för name (minst 2 tecken) och giltig email.",
    hardDescription:
      "Validera name och email med Zod.",
    easyStarter: `import { z } from "zod";

const formSchema = z.object({
  // name: z.string().min(2),
  // email: ...
});
`,
    normalStarter: `import { z } from "zod";

const formSchema = z.object({

});
`,
    hardStarter: `import { z } from "zod";
`,
    solution: `import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});`,
    hints: ["z.object", "z.string().min(2)", "z.string().email()"]
  },
  {
    id: "hono-get",
    topic: "Hono",
    title: "GET-route",
    easyDescription:
      "Skapa app = new Hono(). Lägg till app.get('/api/hello', (c) => { ... }). Returnera c.json({ message: 'Hej!' }).",
    normalDescription:
      "Skapa GET /api/hello som returnerar JSON med message: Hej!.",
    hardDescription:
      "Gör en GET-route i Hono.",
    easyStarter: `import { Hono } from "hono";

const app = new Hono();

// app.get(...)

export default app;
`,
    normalStarter: `import { Hono } from "hono";

const app = new Hono();

export default app;
`,
    hardStarter: `import { Hono } from "hono";
`,
    solution: `import { Hono } from "hono";

const app = new Hono();

app.get("/api/hello", (c) => {
  return c.json({ message: "Hej!" });
});

export default app;`,
    hints: ["app.get", "Callback får c", "c.json(...)"]
  }
];

function getStarter(exercise: Exercise, difficulty: Difficulty) {
  if (difficulty === "easy") return exercise.easyStarter;
  if (difficulty === "hard") return exercise.hardStarter;
  return exercise.normalStarter;
}

function getDescription(exercise: Exercise, difficulty: Difficulty) {
  if (difficulty === "easy") return exercise.easyDescription;
  if (difficulty === "hard") return exercise.hardDescription;
  return exercise.normalDescription;
}

function stripImports(code: string) {
  return code.replace(/import\s+(?:[\s\S]*?)\s+from\s+["'][^"']+["'];?\s*/g, "");
}

function makePreviewCode(code: string, preview?: PreviewConfig) {
  if (!preview) return "";

  const transpiled = ts.transpileModule(stripImports(code), {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None
    }
  }).outputText;

  const props = preview.props ? ` ${preview.props}` : "";
  return `${transpiled}\nrender(<${preview.componentName}${props} />);`;
}

export default function PracticePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [index, setIndex] = useState(0);
  const exercise = exercises[index];

  const [code, setCode] = useState(getStarter(exercise, difficulty));
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [grading, setGrading] = useState(false);

  const previewCode = useMemo(
    () => makePreviewCode(code, exercise.preview),
    [code, exercise]
  );

  function changeDifficulty(next: Difficulty) {
    setDifficulty(next);
    setCode(getStarter(exercise, next));
    setShowHints(false);
    setShowSolution(false);
    setGrade(null);
  }

  function openExercise(nextIndex: number) {
    const next = (nextIndex + exercises.length) % exercises.length;
    setIndex(next);
    setCode(getStarter(exercises[next], difficulty));
    setShowHints(false);
    setShowSolution(false);
    setGrade(null);
  }

  const handleMount: OnMount = (editor, monaco) => {
    configureCourseEditor(editor, monaco);
  };

  const liveScope = { React, useState, atom, useAtom };

  async function runGrade() {
    setGrading(true);
    setGrade(null);

    const result = await gradeExercise(exercise.id, code);

    setGrade(result);
    setGrading(false);

    recordCodeAttempt(
      exercise.id,
      exercise.topic,
      exercise.title,
      result.score,
      result.passed,
      code
    );
  }

  return (
    <section className="coding-page">
      <div className="coding-header">
        <div>
          <span className="topic-badge">{exercise.topic}</span>
          <span className="quiz-progress">Uppgift {index + 1} / {exercises.length}</span>
        </div>

        <label className="difficulty-control">
          Hjälpnivå
          <select value={difficulty} onChange={(e) => changeDifficulty(e.target.value as Difficulty)}>
            <option value="easy">Lätt</option>
            <option value="normal">Normal</option>
            <option value="hard">Svår</option>
          </select>
        </label>
      </div>

      <article className="coding-task">
        <h2>{exercise.title}</h2>
        <p>{getDescription(exercise, difficulty)}</p>

        <div className="difficulty-info">
          {difficulty === "easy" && "Lätt: detaljerad instruktion + kommentarer i startkoden."}
          {difficulty === "normal" && "Normal: kort instruktion + lite startkod."}
          {difficulty === "hard" && "Svår: bara målet och minimal hjälp."}
        </div>

        <div className="editor-shell">
          <Editor
            height="430px"
            language="typescript"
            path={`exercise-${index}-${difficulty}.tsx`}
            value={code}
            onChange={(value) => setCode(value ?? "")}
            onMount={handleMount}
            theme="vs-dark"
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              automaticLayout: true,
              quickSuggestions: true,
              parameterHints: { enabled: true }
            }}
          />
        </div>

        <section className="preview-section">
          <div className="preview-heading">
            <div>
              <h3>Live preview</h3>
              <p>Visuella uppgifter uppdateras direkt.</p>
            </div>
            {exercise.preview && <span className="preview-live-badge">LIVE</span>}
          </div>

          {exercise.preview ? (
            <LiveProvider code={previewCode} scope={liveScope} noInline>
              <div className="preview-browser">
                <div className="preview-browser-bar">
                  <span /><span /><span /><strong>Preview</strong>
                </div>
                <div className="preview-canvas">
                  <LivePreview />
                </div>
              </div>
              <LiveError className="preview-error" />
            </LiveProvider>
          ) : (
            <div className="preview-unavailable">
              <strong>Ingen visuell preview.</strong>
              <p>Detta är logik/server/API-kod och renderar normalt inget UI.</p>
            </div>
          )}
        </section>

        <div className="coding-actions">
          <button
            type="button"
            className="primary-button auto-width"
            onClick={runGrade}
            disabled={grading}
          >
            {grading ? "Testar koden..." : "Rätta min kod"}
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !showHints;
              setShowHints(next);
              if (next) {
                recordHintUse(exercise.id, exercise.topic, exercise.title);
              }
            }}
          >
            {showHints ? "Dölj ledtrådar" : "Visa ledtrådar"}
          </button>
          <button
            type="button"
            onClick={() => {
              const next = !showSolution;
              setShowSolution(next);
              if (next) {
                recordSolutionView(exercise.id, exercise.topic, exercise.title);
              }
            }}
          >
            {showSolution ? "Dölj facit" : "Visa facit"}
          </button>
          <button type="button" className="primary-button auto-width" onClick={() => openExercise(index + 1)}>
            Nästa uppgift
          </button>
        </div>

        {grade && (
          <div className={`grade-box ${grade.passed ? "grade-pass" : "grade-partial"}`}>
            <div className="grade-summary">
              <div>
                <h3>Automatisk rättning</h3>
                <p>
                  Testerna kontrollerar funktion/beteende där det går, inte om
                  din kod ser exakt ut som facit.
                </p>
              </div>
              <strong>{grade.score}%</strong>
            </div>

            {grade.compileError && (
              <div className="grade-compile-error">
                <strong>Koden kunde inte testas:</strong>
                <pre><code>{grade.compileError}</code></pre>
              </div>
            )}

            <div className="grade-tests">
              {grade.tests.map((test) => (
                <div
                  className={`grade-test ${test.passed ? "grade-test-pass" : "grade-test-fail"}`}
                  key={test.name}
                >
                  <span>{test.passed ? "✓" : "✗"}</span>
                  <div>
                    <strong>{test.name}</strong>
                    <p>{test.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showHints && (
          <div className="hint-box">
            <h3>Ledtrådar</h3>
            <ol>{exercise.hints.map((hint) => <li key={hint}>{hint}</li>)}</ol>
          </div>
        )}

        {showSolution && (
          <div className="solution-box code-compare-box">
            <h3>Jämför din kod med exempellösningen</h3>
            <p className="muted">Det behöver inte se exakt likadant ut. Fokusera på beteende och viktiga byggstenar.</p>
            <div className="code-compare-grid">
              <section>
                <span className="study-tool-label">Din kod</span>
                <pre><code>{code}</code></pre>
              </section>
              <section>
                <span className="study-tool-label">Exempellösning</span>
                <pre><code>{exercise.solution}</code></pre>
              </section>
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
