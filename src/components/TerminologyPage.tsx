import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { studyTopics } from "../data/studyTopics";
import { createTerminologyQuestions, terminology, type TerminologyDirection } from "../data/terminology";
import { recordAnswer } from "../data/progress";
import { recordQuestionResult } from "../data/questionProgress";
import { saveTestResult } from "../data/history";
import { recordRecentActivity } from "../data/recentActivity";

export default function TerminologyPage() {
  const { topicSlug = "react" } = useParams();
  const topic = studyTopics.find(item => item.slug === topicSlug);
  if (!topic || !terminology[topicSlug]) return <section className="panel">
    <h1>Ämnet hittades inte</h1><Link to="/topics">Tillbaka till Lär dig</Link>
  </section>;
  return <TerminologyPractice key={topicSlug} slug={topicSlug} title={topic.title} />;
}

function TerminologyPractice({ slug, title }: { slug: string; title: string }) {
  const [direction, setDirection] = useState<TerminologyDirection>("term");
  const [questions, setQuestions] = useState(() => createTerminologyQuestions(slug, "term"));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [missed, setMissed] = useState<string[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const current = questions[index];

  useEffect(() => {
    recordRecentActivity({ id: `terminology:${slug}`, label: `${title} · Terminologi`, detail: "Begreppsträning", to: `/terminology/${slug}` });
  }, [slug, title]);
  useEffect(() => { heading.current?.focus(); }, [index, questions, finished]);

  function restart(nextDirection = direction, onlyMissed = false) {
    const next = createTerminologyQuestions(slug, nextDirection);
    setQuestions(onlyMissed ? next.filter(question => missed.includes(question.termId)) : next);
    setDirection(nextDirection);
    setIndex(0); setSelected(null); setChecked(false); setScore(0); setFinished(false); setMissed([]);
  }
  function grade() {
    if (selected === null || checked) return;
    const correct = selected === current.answer;
    const nextScore = score + Number(correct);
    setScore(nextScore); setChecked(true);
    if (!correct) setMissed(previous => [...previous, current.termId]);
    recordAnswer(title, correct);
    recordQuestionResult(current.id, title, current.question, correct, {
      source: "page", pageTitle: `Terminologi · ${title}`, type: "single", options: current.options,
      correctAnswers: [current.answer], explanation: current.explanation
    });
    if (index === questions.length - 1) saveTestResult({ date: new Date().toISOString(), score: nextScore, total: questions.length, topics: [`Terminologi: ${title}`] });
  }
  function next() {
    if (!checked) return;
    if (index === questions.length - 1) setFinished(true);
    else { setIndex(index + 1); setSelected(null); setChecked(false); }
  }

  return <section className="terminology-page checkpoint-page">
    <header className="terminology-heading">
      <div><span className="topic-badge">{title}</span><h1>Terminologi · {title}</h1>
        <p>Öva på {terminology[slug].length} begrepp. Rätta dina svar och se en förklaring med exempel.</p></div>
      <Link className="secondary-button" to={`/topics?topic=${slug}`}>Till ämnet</Link>
    </header>
    <nav className="terminology-subjects" aria-label="Terminologi per ämne">
      {studyTopics.map(topic => <Link key={topic.slug} to={`/terminology/${topic.slug}`} aria-current={topic.slug === slug ? "page" : undefined}>{topic.title}</Link>)}
    </nav>
    <div className="terminology-mode">
      <label htmlFor="terminology-direction">Övning</label>
      <select id="terminology-direction" value={direction} onChange={event => restart(event.target.value as TerminologyDirection)}>
        <option value="term">Förklaring → välj begrepp</option>
        <option value="definition">Begrepp → välj förklaring</option>
      </select>
      <small>Byte av övning startar en ny omgång.</small>
    </div>
    {finished ? <article className="quiz-card">
      <h2 ref={heading} tabIndex={-1}>Omgången är klar!</h2>
      <p role="status">Du fick {score} av {questions.length} rätt. Resultatet är sparat i historiken.</p>
      <div className="terminology-actions">
        <button type="button" className="primary-button" onClick={() => restart()}>Öva igen</button>
        {missed.length > 0 && <button type="button" onClick={() => restart(direction, true)}>Öva missade begrepp ({missed.length})</button>}
        <Link to="/history">Se historik</Link>
      </div>
    </article> : <article className="quiz-card">
      <div className="quiz-topbar"><span>Fråga {index + 1} av {questions.length}</span><strong>{score} rätt</strong></div>
      <h2 ref={heading} tabIndex={-1}>{current.question}</h2>
      <div className="quiz-options" role="group" aria-label="Svarsalternativ">
        {current.options.map((option, choice) => <button key={option} type="button"
          className={`quiz-option${checked && choice === current.answer ? " correct-option" : checked && choice === selected ? " wrong-option" : choice === selected ? " selected-option" : ""}`}
          disabled={checked} aria-pressed={selected === choice} onClick={() => setSelected(choice)}>
          <span className="option-letter">{String.fromCharCode(65 + choice)}</span>{option}
        </button>)}
      </div>
      {checked ? <>
        <div role="status" className={`feedback ${selected === current.answer ? "feedback-correct" : "feedback-wrong"}`}>
          <strong>{selected === current.answer ? "Rätt!" : "Inte riktigt."}</strong>
          {selected !== current.answer && <p>Rätt svar: {current.options[current.answer]}</p>}
          <p>{current.explanation}</p>
        </div>
        <button type="button" className="primary-button" onClick={next}>{index === questions.length - 1 ? "Visa resultat" : "Nästa fråga"}</button>
      </> : <button type="button" className="primary-button" disabled={selected === null} onClick={grade}>Rätta svar</button>}
    </article>}
    <details className="quiz-card terminology-glossary">
      <summary>Ordlista med exempel · {terminology[slug].length} begrepp</summary>
      <dl>{terminology[slug].map(item => <div key={item.id}>
        <dt>{item.term}</dt><dd>{item.definition}<p className="muted">Exempel: {item.example}</p></dd>
      </div>)}</dl>
    </details>
  </section>;
}
