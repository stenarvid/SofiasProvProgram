import { useMemo, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { configureCourseEditor } from "../data/monacoCourseTypes";
import { questionBank } from "../data/questionBank";
import { recordQuestionResult } from "../data/questionProgress";
import { recordAnswer } from "../data/progress";

type Stage = "theory" | "reading" | "debug" | "coding" | "chain" | "oral" | "done";

const readingTasks = [
  {
    code: `const [count, setCount] = useState(2);
setCount(count + 1);`,
    q: "Vilket värde försöker setCount sätta?",
    answer: "3"
  },
  {
    code: `type User = { name: string; age?: number };`,
    q: "Måste age finnas?",
    answer: "Nej"
  }
];

const debugTasks = [
  {
    code: `return response.json;`,
    prompt: "Fixa raden så att JSON faktiskt läses.",
    solution: `return await response.json();`
  },
  {
    code: `<Route url="/about" component={<About />} />`,
    prompt: "Fixa routen.",
    solution: `<Route path="/about" element={<About />} />`
  }
];

const codingTasks = [
  "Gör en React-counter med useState.",
  "Gör en komponent UserCard med props name:string och age:number.",
  "Skriv getUsers som hämtar /api/users med fetch och returnerar JSON."
];

export default function FinalExamPage() {
  const theory = useMemo(
    () => [...questionBank].sort(() => Math.random() - 0.5).slice(0, 10),
    []
  );

  const [stage, setStage] = useState<Stage>("theory");
  const [theoryIndex, setTheoryIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [theoryScore, setTheoryScore] = useState(0);
  const [readingAnswers, setReadingAnswers] = useState(["", ""]);
  const [debugAnswers, setDebugAnswers] = useState(["", ""]);
  const [codingNotes, setCodingNotes] = useState(["", "", ""]);
  const [chainNotes, setChainNotes] = useState("");
  const [oralNotes, setOralNotes] = useState(["", ""]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    configureCourseEditor(editor, monaco);
  };

  const currentTheory = theory[theoryIndex];

  function submitTheory() {
    if (selected === null) return;
    const correct = selected === currentTheory.answer;
    if (correct) setTheoryScore((s) => s + 1);

    recordAnswer(currentTheory.topic, correct);
    recordQuestionResult(
      currentTheory.id,
      currentTheory.topic,
      currentTheory.question,
      correct
    );

    if (theoryIndex + 1 >= theory.length) {
      setStage("reading");
    } else {
      setTheoryIndex((i) => i + 1);
    }
    setSelected(null);
  }

  if (stage === "done") {
    return (
      <section>
        <h2>Slutprovet är klart</h2>
        <div className="panel">
          <p><strong>Teori:</strong> {theoryScore}/10</p>
          <p>
            De praktiska delarna rättar du genom att jämföra med dina vanliga
            övningar, debug-sidor och cheat sheet.
          </p>
          <p>
            Frågorna du missade i teoridelen finns nu sparade på Progress-sidan.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="final-exam-page">
      <h2>Simulerat slutprov</h2>
      <p className="muted">
        10 teori + 2 kodläsning + 2 debug + 3 programmering + 1 kedjeuppgift + 2 muntliga.
        Koddelarna använder Monaco med TSX, Router, React Query, Jotai, Zod och Hono-stöd.
      </p>

      {stage === "theory" && (
        <div className="panel">
          <span className="topic-badge">{currentTheory.topic}</span>
          <h3>Teori {theoryIndex + 1}/10</h3>
          <p>{currentTheory.question}</p>

          <div className="quiz-options">
            {currentTheory.options.map((option, i) => (
              <button
                type="button"
                key={option}
                className={`quiz-option ${selected === i ? "selected-option" : ""}`}
                onClick={() => setSelected(i)}
              >
                {option}
              </button>
            ))}
          </div>

          <button type="button" className="primary-button" disabled={selected === null} onClick={submitTheory}>
            Svara
          </button>
        </div>
      )}

      {stage === "reading" && (
        <div className="panel">
          <h3>Kodläsning</h3>
          {readingTasks.map((task, i) => (
            <div className="exam-task" key={task.code}>
              <pre><code>{task.code}</code></pre>
              <p>{task.q}</p>
              <input
                value={readingAnswers[i]}
                onChange={(e) => setReadingAnswers((a) => a.map((x, j) => j === i ? e.target.value : x))}
                placeholder="Ditt svar..."
              />
            </div>
          ))}
          <button type="button" className="primary-button" onClick={() => setStage("debug")}>Nästa del</button>
        </div>
      )}

      {stage === "debug" && (
        <div className="panel">
          <h3>Debug</h3>
          {debugTasks.map((task, i) => (
            <div className="exam-task" key={task.code}>
              <pre><code>{task.code}</code></pre>
              <p>{task.prompt}</p>
              <div className="editor-shell polished-editor">
                <Editor
                  height="190px"
                  language="typescript"
                  path={`final-debug-${i}.tsx`}
                  theme="vs-dark"
                  value={debugAnswers[i]}
                  onMount={handleEditorMount}
                  onChange={(value) =>
                    setDebugAnswers((answers) =>
                      answers.map((answer, j) => j === i ? (value ?? "") : answer)
                    )
                  }
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineHeight: 22,
                    automaticLayout: true,
                    quickSuggestions: true,
                    parameterHints: { enabled: true }
                  }}
                />
              </div>
            </div>
          ))}
          <button type="button" className="primary-button" onClick={() => setStage("coding")}>Nästa del</button>
        </div>
      )}

      {stage === "coding" && (
        <div className="panel">
          <h3>Programmering</h3>
          {codingTasks.map((task, i) => (
            <div className="exam-task" key={task}>
              <p><strong>{i + 1}. {task}</strong></p>
              <div className="editor-shell polished-editor">
                <Editor
                  height="250px"
                  language="typescript"
                  path={`final-coding-${i}.tsx`}
                  theme="vs-dark"
                  value={codingNotes[i]}
                  onMount={handleEditorMount}
                  onChange={(value) =>
                    setCodingNotes((answers) =>
                      answers.map((answer, j) => j === i ? (value ?? "") : answer)
                    )
                  }
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineHeight: 22,
                    automaticLayout: true,
                    quickSuggestions: true,
                    parameterHints: { enabled: true }
                  }}
                />
              </div>
            </div>
          ))}
          <button type="button" className="primary-button" onClick={() => setStage("chain")}>Nästa del</button>
        </div>
      )}

      {stage === "chain" && (
        <div className="panel">
          <h3>Kedjeuppgift</h3>
          <p>
            Bygg ett formulär med name/email → databind med state → validera med
            Zod → skicka med fetch → ta emot i Hono och returnera JSON.
          </p>
          <div className="editor-shell polished-editor">
            <Editor
              height="360px"
              language="typescript"
              path="final-chain.tsx"
              theme="vs-dark"
              value={chainNotes}
              onMount={handleEditorMount}
              onChange={(value) => setChainNotes(value ?? "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 22,
                automaticLayout: true,
                quickSuggestions: true,
                parameterHints: { enabled: true }
              }}
            />
          </div>
          <button type="button" className="primary-button" onClick={() => setStage("oral")}>Nästa del</button>
        </div>
      )}

      {stage === "oral" && (
        <div className="panel">
          <h3>Förklara med egna ord</h3>
          <p>1. Vad är skillnaden mellan props och state?</p>
          <textarea value={oralNotes[0]} onChange={(e) => setOralNotes([e.target.value, oralNotes[1]])} />
          <p>2. Förklara request → server → response.</p>
          <textarea value={oralNotes[1]} onChange={(e) => setOralNotes([oralNotes[0], e.target.value])} />

          <button type="button" className="primary-button" onClick={() => setStage("done")}>
            Avsluta slutprovet
          </button>
        </div>
      )}
    </section>
  );
}
