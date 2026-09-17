import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { studyTopics } from "../data/studyTopics";
import { recordAnswer } from "../data/progress";
import { recordQuestionResult } from "../data/questionProgress";
import { saveTestResult } from "../data/history";

type CheckpointQuestion = {
  id: string;
  pageTitle: string;
  question: string;
  options: string[];
  answer: number;
};

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function TopicCheckpointPage() {
  const { topicSlug } = useParams();
  const topic = studyTopics.find((item) => item.slug === topicSlug);

  const questions = useMemo<CheckpointQuestion[]>(
    () =>
      topic
        ? shuffle(
            topic.pages.map((page) => ({
              id: `theory-${page.id}`,
              pageTitle: page.title,
              question: page.quiz.question,
              options: page.quiz.options,
              answer: page.quiz.answer
            }))
          )
        : [],
    [topicSlug]
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!topic) {
    return (
      <section className="checkpoint-page">
        <article className="quiz-card">
          <h2>Ämnet hittades inte</h2>
          <Link to="/topics">Tillbaka till Lär dig</Link>
        </article>
      </section>
    );
  }

  const current = questions[index];

  function check() {
    if (selected === null || checked || !current) return;

    const correct = selected === current.answer;
    if (correct) setScore((value) => value + 1);

    recordAnswer(topic!.title, correct);
    recordQuestionResult(current.id, topic!.title, current.question, correct);
    setChecked(true);
  }

  function next() {
    if (index + 1 >= questions.length) {
      const finalScore = score + (checked && selected === current.answer ? 0 : 0);
      saveTestResult({
        date: new Date().toISOString(),
        score: finalScore,
        total: questions.length,
        topics: [`Checkpoint: ${topic!.title}`]
      });
      setFinished(true);
      return;
    }

    setIndex((value) => value + 1);
    setSelected(null);
    setChecked(false);
  }

  if (finished) {
    return (
      <section className="checkpoint-page">
        <article className="quiz-card checkpoint-result">
          <span className="topic-badge">{topic.title}</span>
          <h2>Checkpoint klart</h2>
          <p className="result">{score} / {questions.length} rätt</p>
          <p className="muted">Resultatet är sparat i din vanliga historik och progress.</p>

          <div className="checkpoint-actions">
            <Link className="primary-button" to={`/topics?topic=${topic.slug}&page=1`}>
              Tillbaka till ämnet
            </Link>
            <Link className="secondary-button" to="/progress-hub">
              Se progress
            </Link>
          </div>
        </article>
      </section>
    );
  }

  const correct = selected === current.answer;

  return (
    <section className="checkpoint-page">
      <div className="quiz-topbar">
        <div>
          <span className="topic-badge">{topic.title} checkpoint</span>
          <span className="quiz-progress">{index + 1} / {questions.length}</span>
        </div>
        <strong>{score} rätt</strong>
      </div>

      <article className="quiz-card">
        <p className="checkpoint-source">Från: {current.pageTitle}</p>
        <h2>{current.question}</h2>

        <div className="quiz-options">
          {current.options.map((option, optionIndex) => {
            let className = "quiz-option";
            if (checked) {
              if (optionIndex === current.answer) className += " correct-option";
              else if (optionIndex === selected) className += " wrong-option";
            } else if (optionIndex === selected) {
              className += " selected-option";
            }

            return (
              <button
                type="button"
                key={option}
                className={className}
                onClick={() => !checked && setSelected(optionIndex)}
                disabled={checked}
              >
                <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                {option}
              </button>
            );
          })}
        </div>

        {!checked ? (
          <button className="primary-button" type="button" onClick={check} disabled={selected === null}>
            Rätta svar
          </button>
        ) : (
          <>
            <div className={`feedback ${correct ? "feedback-correct" : "feedback-wrong"}`}>
              <h3>{correct ? "Rätt!" : "Inte riktigt."}</h3>
              {!correct && <p>Rätt svar är <strong>{current.options[current.answer]}</strong>.</p>}
            </div>
            <button className="primary-button" type="button" onClick={next}>
              {index + 1 >= questions.length ? "Visa resultat" : "Nästa fråga"}
            </button>
          </>
        )}
      </article>
    </section>
  );
}
