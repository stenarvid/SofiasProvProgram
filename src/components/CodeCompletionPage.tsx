import { useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { configureCourseEditor } from "../data/monacoCourseTypes";

const tasks = [
  {
    topic: "State",
    title: "Fyll i useState",
    code: `import { useState } from "react";

function Counter() {
  // TODO: skapa count och setCount här

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}`,
    solution: `const [count, setCount] = useState(0);`
  },
  {
    topic: "Fetch",
    title: "Fyll i fetch",
    code: `async function getUsers() {
  // TODO: hämta /api/users
  // TODO: returnera JSON
}`,
    solution: `const response = await fetch("/api/users");
return await response.json();`
  },
  {
    topic: "Router",
    title: "Fyll i Route",
    code: `function App() {
  return (
    <Routes>
      {/* TODO: /about ska visa <About /> */}
    </Routes>
  );
}`,
    solution: `<Route path="/about" element={<About />} />`
  },
  {
    topic: "Zod",
    title: "Fyll i valideringen",
    code: `const schema = z.object({
  name: // TODO: string minst 2 tecken,
  email: // TODO: giltig email
});`,
    solution: `name: z.string().min(2),
email: z.string().email()`
  }
];

export default function CodeCompletionPage() {
  const [index, setIndex] = useState(0);
  const [code, setCode] = useState(tasks[0].code);
  const [show, setShow] = useState(false);

  const task = tasks[index];

  const handleEditorMount: OnMount = (editor, monaco) => {
    configureCourseEditor(editor, monaco);
  };

  function next() {
    const nextIndex = (index + 1) % tasks.length;
    setIndex(nextIndex);
    setCode(tasks[nextIndex].code);
    setShow(false);
  }

  return (
    <section className="coding-page">
      <span className="topic-badge">{task.topic}</span>
      <h2>{task.title}</h2>
      <p>Fyll i TODO-delarna. Resten av koden är redan given.</p>

      <div className="editor-shell">
        <Editor
          height="340px"
          language="typescript"
          path={`completion-${index}.tsx`}
          onMount={handleEditorMount}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            quickSuggestions: true,
            parameterHints: { enabled: true }
          }}
        />
      </div>

      <div className="coding-actions">
        <button type="button" onClick={() => setShow((v) => !v)}>
          {show ? "Dölj lösning" : "Visa lösning"}
        </button>
        <button type="button" className="primary-button auto-width" onClick={next}>
          Nästa
        </button>
      </div>

      {show && (
        <div className="solution-box">
          <pre><code>{task.solution}</code></pre>
        </div>
      )}
    </section>
  );
}
