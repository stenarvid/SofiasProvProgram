import { useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { configureCourseEditor } from "../data/monacoCourseTypes";

type DebugExercise = {
  topic: string;
  title: string;
  description: string;
  code: string;
  solution: string;
  explanation: string;
};

const exercises: DebugExercise[] = [
  {
    topic: "State",
    title: "Counter som inte uppdateras",
    description: "Hitta felet och fixa countern så att knappen ökar värdet.",
    code: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={setCount(count + 1)}>
      {count}
    </button>
  );
}`,
    solution: `onClick={() => setCount(count + 1)}`,
    explanation:
      "onClick ska få en funktion. I den trasiga koden körs setCount direkt under renderingen."
  },
  {
    topic: "Props",
    title: "Fel typ på props",
    description: "Fixa typen så att komponenten accepterar age korrekt.",
    code: `type Props = {
  name: string;
  age: string;
};

function UserCard({ name, age }: Props) {
  return <p>{name} är {age} år</p>;
}

<UserCard name="Anna" age={20} />;`,
    solution: `age: number;`,
    explanation:
      "Komponenten får age={20}, alltså ett number. Props-typen måste matcha datan."
  },
  {
    topic: "Fetch",
    title: "JSON hämtas aldrig",
    description: "Fixa funktionen så att den faktiskt returnerar JSON-data.",
    code: `async function getUsers() {
  const response = await fetch("/api/users");
  return response.json;
}`,
    solution: `return await response.json();`,
    explanation:
      "response.json är själva funktionen. Du måste anropa den med parenteser."
  },
  {
    topic: "Router",
    title: "Fel property på Route",
    description: "Fixa routen så att About visas på /about.",
    code: `<Route url="/about" component={<About />} />`,
    solution: `<Route path="/about" element={<About />} />`,
    explanation:
      "I modern React Router används path och element."
  },
  {
    topic: "Zod",
    title: "För svag validering",
    description: "Gör så att email måste vara giltig e-post.",
    code: `const schema = z.object({
  email: z.string()
});`,
    solution: `email: z.string().email()`,
    explanation:
      "z.string() kontrollerar bara typen. email() lägger till formatvalidering."
  }
];

export default function DebugPage() {
  const [index, setIndex] = useState(0);
  const [code, setCode] = useState(exercises[0].code);
  const [show, setShow] = useState(false);

  const exercise = exercises[index];

  const handleEditorMount: OnMount = (editor, monaco) => {
    configureCourseEditor(editor, monaco);
  };

  function go(next: number) {
    const i = (next + exercises.length) % exercises.length;
    setIndex(i);
    setCode(exercises[i].code);
    setShow(false);
  }

  return (
    <section className="coding-page">
      <div className="coding-header">
        <div>
          <span className="topic-badge">{exercise.topic}</span>
          <span className="quiz-progress">Debug {index + 1} / {exercises.length}</span>
        </div>
      </div>

      <article className="coding-task">
        <h2>{exercise.title}</h2>
        <p>{exercise.description}</p>

        <div className="editor-shell">
          <Editor
            height="330px"
            language="typescript"
            path={`debug-${index}.tsx`}
            onMount={handleEditorMount}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={{ minimap: { enabled: false }, fontSize: 15 }}
          />
        </div>

        <div className="coding-actions">
          <button type="button" onClick={() => setShow((v) => !v)}>
            {show ? "Dölj förklaring" : "Visa lösning & förklaring"}
          </button>
          <button type="button" className="primary-button auto-width" onClick={() => go(index + 1)}>
            Nästa debug-uppgift
          </button>
        </div>

        {show && (
          <div className="solution-box">
            <h3>Lösning</h3>
            <pre><code>{exercise.solution}</code></pre>
            <p>{exercise.explanation}</p>
          </div>
        )}
      </article>
    </section>
  );
}
