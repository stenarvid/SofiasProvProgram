import TrainingSession from "./TrainingSession";
import { shuffle } from "../data/quizShuffle";
import { useMemo, useState } from "react";

const tasks = [
  {
    prompt: "Du vill hämta en lista med användare.",
    answer: "GET",
    options: ["GET", "POST", "DELETE", "500"],
    explanation: "GET används normalt för att läsa/hämta data."
  },
  {
    prompt: "API:et låter servern välja id. Vilken metod används normalt för att skapa en användare via /api/users?",
    answer: "POST",
    options: ["GET", "POST", "404", "PUT"],
    explanation: "POST används ofta när en ny resurs skapas."
  },
  {
    prompt: "Servern hittar inte /api/users/999.",
    answer: "404",
    options: ["200", "201", "404", "500"],
    explanation: "404 Not Found betyder att den efterfrågade resursen inte hittades."
  },
  {
    prompt: "Requesten lyckades och servern returnerar data.",
    answer: "200",
    options: ["200", "404", "500", "DELETE"],
    explanation: "200 OK är en vanlig statuskod för lyckade requests."
  },
  {
    prompt: "Servern kan svara men ett oväntat internt fel hindrar den från att slutföra requesten. Vilken status passar?",
    answer: "500",
    options: ["200", "201", "404", "500"],
    explanation: "500 Internal Server Error betyder fel på serversidan."
  },
  {
    prompt: "Var ligger data som skickas med en POST-request ofta?",
    answer: "Request body",
    options: ["Request body", "CSS", "React props", "Route element"],
    explanation: "POST-data skickas ofta i request body, till exempel som JSON."
  }
];

export default function HttpTrainerPage() {
  return <TrainingSession items={tasks} topics={(_item) => ["Server / HTTP"]}>
    {(item, index, next) => <TrainingTask item={item} index={index} nextTask={next} />}
  </TrainingSession>;
}

function TrainingTask({ item: source, nextTask }: { item: (typeof tasks)[number]; index: number; nextTask: () => void }) {
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const task = useMemo(() => {
    return { ...source, options: shuffle(source.options) };
  }, [source]);

  const next = nextTask;

  return (
    <section className="quiz-page">
      <h2>HTTP-träning</h2>
      <div className="server-flow-mini">
        Klient → Request → Server → Response → Klient
      </div>

      <h3>{task.prompt}</h3>

      <div className="quiz-options">
        {task.options.map((option) => (
          <button
            type="button"
            key={option}
            aria-pressed={option === selected}
            disabled={checked}
            className={`quiz-option ${!checked && option === selected ? "selected-option" : ""} ${checked && option === task.answer ? "correct-option" : ""} ${checked && option === selected && option !== task.answer ? "wrong-option" : ""}`}
            onClick={() => !checked && setSelected(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {!checked ? (
        <button type="button" className="primary-button" disabled={!selected} onClick={() => setChecked(true)}>
          Rätta
        </button>
      ) : (
        <>
          <div className={selected === task.answer ? "feedback feedback-correct" : "feedback feedback-wrong"}>
            {task.explanation}
          </div>
          <button type="button" className="primary-button" onClick={next}>Nästa</button>
        </>
      )}
    </section>
  );
}
