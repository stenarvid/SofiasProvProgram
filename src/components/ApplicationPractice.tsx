import { useState } from "react";
import { applicationQuestions } from "../data/applicationQuestions";
import { shuffleQuestionOptions } from "../data/quizShuffle";
import { recordCodeAttempt } from "../data/codeProgress";

export default function ApplicationPractice({ pageId, topic, title }: { pageId: string; topic: string; title: string }) {
  const [questions, setQuestions] = useState(() => applicationQuestions[pageId].map(question => shuffleQuestionOptions(question)));
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  function grade() {
    if (score !== null || questions.some((_, i) => answers[i] === undefined)) return;
    const next = Math.round(100 * questions.filter((q, i) => answers[i] === q.answer).length / questions.length);
    setScore(next);
    recordCodeAttempt(`theory-code-${pageId}`, topic, `${topic} – ${title}`, next, next === 100);
  }
  return <div>
    <p>Välj svar på frågorna och tryck Rätta.</p>
    {questions.map((question, index) => <fieldset key={index} disabled={score !== null}>
      <legend>{question.question}</legend>
      {question.options.map((option, choice) => <label className="quiz-option" key={option}>
        <input type="radio" name={`${pageId}-application-${index}`} checked={answers[index] === choice} onChange={() => setAnswers(previous => ({ ...previous, [index]: choice }))} />
        {option}
      </label>)}
      {score !== null && <p className={answers[index] === question.answer ? "feedback-correct" : "feedback-wrong"}>
        <strong>{answers[index] === question.answer ? "Rätt. " : `Rätt svar: ${question.options[question.answer]}. `}</strong>{question.explanation}
      </p>}
    </fieldset>)}
    {score === null ? <button type="button" className="primary-button auto-width" disabled={questions.some((_, i) => answers[i] === undefined)} onClick={grade}>Rätta</button>
      : <>
        <p role="status">Resultat: {score}% rätt</p>
        <button type="button" onClick={() => { setQuestions(applicationQuestions[pageId].map(question => shuffleQuestionOptions(question))); setAnswers({}); setScore(null); }}>Försök igen</button>
      </>}
  </div>;
}
