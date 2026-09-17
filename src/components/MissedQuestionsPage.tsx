import { shuffleMultipleAnswers } from "../data/quizShuffle";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getAllMissedQuestions } from "../data/missedQuestions";
import { recordQuestionResult } from "../data/questionProgress";
import { recordAnswer } from "../data/progress";
import { isQuizSelectionCorrect } from "../data/studyPageQuiz";

export default function MissedQuestionsPage() {
  const [questions, setQuestions] = useState(() => getAllMissedQuestions().map(question => shuffleMultipleAnswers(question)));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const current = questions[index];
  const currentCorrect =
    current ? isQuizSelectionCorrect(selected, current.correctAnswers) : false;

  function toggleOption(optionIndex: number) {
    if (!current || checked) return;

    if (current.type === "single") {
      setSelected([optionIndex]);
      return;
    }

    setSelected((values) =>
      values.includes(optionIndex)
        ? values.filter((value) => value !== optionIndex)
        : [...values, optionIndex]
    );
  }

  function checkAnswer() {
    if (!current || checked || selected.length === 0) return;

    const correct = isQuizSelectionCorrect(selected, current.correctAnswers);

    recordAnswer(current.topic, correct);
    recordQuestionResult(
      current.id,
      current.topic,
      current.question,
      correct,
      {
        source: current.source,
        pageTitle: current.pageTitle,
        type: current.type,
        options: current.options,
        correctAnswers: current.correctAnswers,
        explanation: current.explanation,
        code: current.code
      }
    );

    if (correct) setSessionCorrect((value) => value + 1);
    setChecked(true);
  }

  function nextQuestion() {
    if (index >= questions.length - 1) return;
    setIndex((value) => value + 1);
    setSelected([]);
    setChecked(false);
  }

  function restart() {
    const remaining = getAllMissedQuestions().map(question => shuffleMultipleAnswers(question));
    setQuestions(remaining);
    setIndex(0);
    setSelected([]);
    setChecked(false);
    setSessionCorrect(0);
  }

  if (questions.length === 0) {
    return (
      <section className="quiz-page">
        <article className="quiz-card">
          <span className="topic-badge">Repetition</span>
          <h2>Missade frågor</h2>
          <p>Du har inga olösta missade frågor att öva på just nu.</p>
          <p className="muted">
            När du klarar en missad fråga tas den bort härifrån. Om du svarar fel på den igen senare kan den komma tillbaka.
          </p>
          <Link className="action-link" to="/topics">Fortsätt plugga →</Link>
        </article>
      </section>
    );
  }

  if (!current) return null;

  const isLast = index === questions.length - 1;

  return (
    <section className="quiz-page missed-questions-page">
      <div className="quiz-topbar">
        <div>
          <span className="topic-badge">{current.topic}</span>
          <span className="quiz-progress">
            Missad fråga {index + 1} / {questions.length}
          </span>
        </div>
        <strong>Rätt denna runda: {sessionCorrect}</strong>
      </div>

      <article className="quiz-card">
        <div className="missed-source-row">
          <span>
            {current.source === "page" ? "Från teorisida" : "Från vanliga quizet"}
          </span>
          {current.pageTitle && <strong>{current.pageTitle}</strong>}
          <span>Fel tidigare: {current.wrongCount}</span>
        </div>

        <pre style={{ whiteSpace: "pre-wrap" }}>{current.question}</pre>
        {current.code && <pre><code>{current.code}</code></pre>}

        {current.type === "multi" && !checked && (
          <p className="muted">
            Flervalsfråga: flera alternativ kan vara rätt. Välj alla som stämmer.
          </p>
        )}

        {current.options.length === 0 ? (
          <div className="warning-box">
            <p>{current.explanation}</p>
            <Link className="action-link" to="/topics">
              Öppna teorin och gör om frågan →
            </Link>
          </div>
        ) : (
        <div className="quiz-options">
          {current.options.map((option, optionIndex) => {
            const isSelected = selected.includes(optionIndex);
            const isCorrectOption = current.correctAnswers.includes(optionIndex);

            let className = "quiz-option";
            if (!checked && isSelected) className += " selected-option";
            if (checked && isCorrectOption) className += " correct-option";
            if (checked && isSelected && !isCorrectOption) className += " wrong-option";

            return (
              <button
                type="button"
                key={`${current.id}-${optionIndex}`}
                className={className}
                onClick={() => toggleOption(optionIndex)}
                disabled={checked}
              >
                <span className="option-letter">
                  {current.type === "multi"
                    ? isSelected ? "✓" : "□"
                    : String.fromCharCode(65 + optionIndex)}
                </span>
                {option}
              </button>
            );
          })}
        </div>
        )}

        {current.options.length > 0 && (!checked ? (
          <button
            type="button"
            className="primary-button"
            onClick={checkAnswer}
            disabled={selected.length === 0}
          >
            Rätta svar
          </button>
        ) : (
          <>
            <div className={`feedback ${currentCorrect ? "feedback-correct" : "feedback-wrong"}`}>
              <h3>{currentCorrect ? "Rätt!" : "Inte helt rätt."}</h3>
              {!currentCorrect && (
                <p>
                  Rätt alternativ:{" "}
                  <strong>
                    {current.correctAnswers
                      .map((answer) => current.options[answer])
                      .join(", ")}
                  </strong>
                </p>
              )}
              <p>{current.explanation}</p>
            </div>

            {isLast ? (
              <div className="coding-actions">
                <button type="button" className="primary-button auto-width" onClick={restart}>
                  Gör om de missade frågorna
                </button>
                <Link className="action-link" to="/">Till startsidan</Link>
              </div>
            ) : (
              <button type="button" className="primary-button" onClick={nextQuestion}>
                Nästa missade fråga
              </button>
            )}
          </>
        ))}
      </article>
    </section>
  );
}
