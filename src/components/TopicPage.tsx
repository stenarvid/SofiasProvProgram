import { useState } from "react";
import { useParams } from "react-router-dom";
import { topics } from "../data/topics";

export default function TopicPage() {
  const { topicId } = useParams();
  const topic = topics.find((item) => item.id === topicId);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!topic) {
    return <p>Ämnet hittades inte.</p>;
  }

  return (
    <section className="panel">
      <h2>{topic.title}</h2>
      <p>{topic.description}</p>

      <h3>Kom ihåg</h3>
      <ul>
        {topic.keyPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      {topic.code && (
        <>
          <h3>Kodexempel</h3>
          <pre>
            <code>{topic.code}</code>
          </pre>
        </>
      )}

      <div className="question">
        <h3>Provfråga</h3>
        <p>{topic.question}</p>
        <button onClick={() => setShowAnswer((value) => !value)}>
          {showAnswer ? "Dölj svar" : "Visa svar"}
        </button>

        {showAnswer && <p className="answer">{topic.answer}</p>}
      </div>
    </section>
  );
}
