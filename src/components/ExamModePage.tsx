import { shuffle } from "../data/quizShuffle";
import { useEffect, useMemo, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { configureCourseEditor } from "../data/monacoCourseTypes";

const practicalTasks = [
  "Gör en counter i React med useState.",
  "Skapa en komponent UserCard med props name och age.",
  "Gör ett controlled input som visar texten under fältet.",
  "Skriv en fetch-funktion som hämtar /api/users.",
  "Skapa en Route för /about.",
  "Skapa ett Zod-schema för name och email.",
  "Skapa en Jotai-atom för count.",
  "Skapa en GET-route /api/hello i Hono."
];

export default function ExamModePage() {
  const [minutes, setMinutes] = useState(30);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [tasks, setTasks] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    configureCourseEditor(editor, monaco);
  };

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;

    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [running, secondsLeft]);

  const display = useMemo(() => {
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const s = (secondsLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [secondsLeft]);

  function start() {
    const nextTasks = shuffle(practicalTasks).slice(0, 5);
    setTasks(nextTasks);
    setAnswers(nextTasks.map(() => ""));
    setSecondsLeft(minutes * 60);
    setRunning(true);
  }

  return (
    <section>
      <h2>Provläge</h2>
      <p>
        Inga ledtrådar eller facit. Du får fem slumpade praktiska uppgifter och en timer.
      </p>

      {!running && secondsLeft === 0 && (
        <div className="panel">
          <label className="quiz-select-label">
            Tid
            <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
              <option value={15}>15 minuter</option>
              <option value={30}>30 minuter</option>
              <option value={45}>45 minuter</option>
              <option value={60}>60 minuter</option>
            </select>
          </label>

          <button type="button" className="primary-button" onClick={start}>
            Starta provläge
          </button>
        </div>
      )}

      {tasks.length > 0 && (
        <>
          <div className="exam-timer">{display}</div>

          <div className="panel">
            <h3>Praktiska uppgifter</h3>
            <p className="muted">
              Skriv dina lösningar direkt här. Editorn använder samma TSX- och bibliotekstyper
              som resten av sidan.
            </p>

            <div className="exam-editor-list">
              {tasks.map((task, index) => (
                <article className="exam-task exam-editor-task" key={`${task}-${index}`}>
                  <p><strong>{index + 1}. {task}</strong></p>
                  <div className="editor-shell polished-editor">
                    <Editor
                      height="240px"
                      language="typescript"
                      path={`mock-exam-${index}.tsx`}
                      theme="vs-dark"
                      value={answers[index] ?? ""}
                      onMount={handleEditorMount}
                      onChange={(value) =>
                        setAnswers((current) =>
                          current.map((answer, i) => i === index ? (value ?? "") : answer)
                        )
                      }
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineHeight: 22,
                        automaticLayout: true,
                        readOnly: !running,
                        quickSuggestions: true,
                        parameterHints: { enabled: true },
                        padding: { top: 12, bottom: 12 }
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>

          {running && <button type="button" className="secondary-button" onClick={() => {
            setRunning(false);
            setSecondsLeft(0);
          }}>
            Avsluta provläge
          </button>}
        </>
      )}

      {!running && secondsLeft === 0 && tasks.length > 0 && (
        <div className="warning-box">
          Provläget är avslutat. Dina svar finns kvar ovan för jämförelse med kodövningarna. Ett nytt prov ersätter svaren.
        </div>
      )}
    </section>
  );
}
