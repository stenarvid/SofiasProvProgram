import { shuffleQuestionOptions } from "../data/quizShuffle";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { questionBank, type QuizQuestion } from "../data/questionBank";
import { getProgress, recordAnswer } from "../data/progress";
import { saveTestResult } from "../data/history";
import {
  getDueQuestionIds,
  getQuestionProgress,
  getWrongQuestionIdsFrom,
  isQuestionDue,
  recordQuestionResult
} from "../data/questionProgress";

function weightedRandomQuestions(
  pool: QuizQuestion[],
  amount: number
): QuizQuestion[] {
  const topicProgress = getProgress();
  const questionProgress = getQuestionProgress();

  return pool
    .map((question) => {
      const topicStat = topicProgress[question.topic];
      const topicAttempts = topicStat
        ? topicStat.correct + topicStat.wrong
        : 0;
      const topicWrongRate = topicAttempts
        ? topicStat.wrong / topicAttempts
        : 0.25;

      const qStat = questionProgress[question.id];
      const qWrongRate = qStat?.seen
        ? qStat.wrong / qStat.seen
        : 0.3;

      const dueBoost = isQuestionDue(qStat) ? 5 : 0;
      const weight = 1 + topicWrongRate * 2 + qWrongRate * 4 + dueBoost;

      return {
        question,
        key: Math.random() ** (1 / weight)
      };
    })
    .sort((a, b) => b.key - a.key)
    .slice(0, amount)
    .map((item) => shuffleQuestionOptions(item.question));
}

const amountOptions = [5, 10, 15, 20, 25, 30, 40, 50];

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const wrongOnly = mode === "wrong";
  const reviewOnly = mode === "review";
  const topicParam = searchParams.get("topic");

  const allTopics = useMemo(
    () => Array.from(new Set(questionBank.map((q) => q.topic))).sort(),
    []
  );

  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    topicParam && allTopics.includes(topicParam) ? [topicParam] : allTopics
  );
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [testId, setTestId] = useState(0);
  const [started, setStarted] = useState(wrongOnly || reviewOnly);

  const wrongIds = useMemo(() => getWrongQuestionIdsFrom(questionBank.map((q) => q.id)), [testId, wrongOnly]);
  const dueIds = useMemo(() => getDueQuestionIds(), [testId, reviewOnly]);

  const filteredPool = useMemo(() => {
    if (wrongOnly) {
      return questionBank.filter((q) => wrongIds.includes(q.id));
    }

    if (reviewOnly) {
      return questionBank.filter((q) => dueIds.includes(q.id));
    }

    return questionBank.filter((q) => selectedTopics.includes(q.topic));
  }, [selectedTopics, wrongOnly, reviewOnly, wrongIds, dueIds]);

  const actualAmount = wrongOnly || reviewOnly
    ? filteredPool.length
    : Math.min(selectedAmount, filteredPool.length);

  const questions = useMemo(
    () => weightedRandomQuestions(filteredPool, actualAmount),
    [testId, actualAmount, selectedTopics.join("|"), wrongOnly, reviewOnly]
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[index];

  function resetState() {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setFinished(false);
  }

  function startTest() {
    if (filteredPool.length === 0) return;
    resetState();
    setTestId((id) => id + 1);
    setStarted(true);
  }

  function restartTest() {
    resetState();
    setTestId((id) => id + 1);
  }

  function toggleTopic(topic: string) {
    setSelectedTopics((currentTopics) =>
      currentTopics.includes(topic)
        ? currentTopics.filter((t) => t !== topic)
        : [...currentTopics, topic]
    );
  }

  function checkAnswer() {
    if (selected === null || checked || !current) return;

    const correct = selected === current.answer;

    if (correct) setScore((s) => s + 1);

    recordAnswer(current.topic, correct);
    recordQuestionResult(
      current.id,
      current.topic,
      current.question,
      correct,
      {
        source: "global",
        type: "single",
        options: current.options,
        correctAnswers: [current.answer],
        explanation: current.explanation
      }
    );

    setChecked(true);
  }

  function nextQuestion() {
    if (index + 1 >= questions.length) {
      saveTestResult({
        date: new Date().toISOString(),
        score,
        total: questions.length,
        topics: wrongOnly ? ["Missade frågor"] : reviewOnly ? ["Spaced repetition"] : selectedTopics
      });
      setFinished(true);
      return;
    }

    setIndex((i) => i + 1);
    setSelected(null);
    setChecked(false);
  }

  if (wrongOnly) {
    return (
      <section className="quiz-page">
        <article className="quiz-card">
          <h2>Missade frågor har flyttat</h2>
          <p>
            Den nya sidan samlar både vanliga quizfrågor och sidspecifika frågor från teorin.
          </p>
          <a className="action-link" href="/missed-questions">Öppna Missade frågor →</a>
        </article>
      </section>
    );
  }

  if (reviewOnly && filteredPool.length === 0) {
    return (
      <section className="quiz-page">
        <article className="quiz-card">
          <h2>Spaced repetition</h2>
          <p>Du har inga frågor som behöver repeteras just nu.</p>
          <p className="muted">När en fråga blir aktuell igen dyker den upp här automatiskt.</p>
        </article>
      </section>
    );
  }

  if (!started) {
    return (
      <section className="quiz-page">
        <article className="quiz-card">
          <h2>Bygg ditt test</h2>
          <p>
            Välj ämnen och antal frågor. Systemet väger automatiskt upp
            ämnen och enskilda frågor som du tidigare haft svårt med.
          </p>

          <div className="topic-filter-grid">
            {allTopics.map((topic) => (
              <label key={topic} className="topic-filter-item">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic)}
                  onChange={() => toggleTopic(topic)}
                />
                {topic}
              </label>
            ))}
          </div>

          <div className="topic-filter-actions">
            <button type="button" onClick={() => setSelectedTopics(allTopics)}>
              Välj alla
            </button>
            <button type="button" onClick={() => setSelectedTopics([])}>
              Rensa
            </button>
          </div>

          <label className="quiz-select-label">
            Antal frågor
            <select
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
            >
              {amountOptions.map((amount) => (
                <option key={amount} value={amount}>{amount}</option>
              ))}
            </select>
          </label>

          <p className="muted">
            {filteredPool.length} frågor tillgängliga i valda ämnen.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={startTest}
            disabled={filteredPool.length === 0}
          >
            Starta test
          </button>
        </article>
      </section>
    );
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);

    return (
      <section className="quiz-page">
        <article className="quiz-card">
          <h2>Test klart</h2>
          <p className="result">
            Du fick {score} av {questions.length} rätt ({percent}%).
          </p>
          <p className="muted">
            Resultatet och statistiken per fråga är sparade på den här enheten.
          </p>

          <button type="button" className="primary-button" onClick={restartTest}>
            Gör om med ny slumpning
          </button>

          {!wrongOnly && !reviewOnly && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                resetState();
                setStarted(false);
              }}
            >
              Ändra ämnen / antal
            </button>
          )}
        </article>
      </section>
    );
  }

  if (!current) return null;

  const isCorrect = selected === current.answer;

  return (
    <section className="quiz-page">
      <div className="quiz-topbar">
        <div>
          <span className="topic-badge">{current.topic}</span>
          <span className="quiz-progress">
            Fråga {index + 1} / {questions.length}
          </span>
        </div>
        <strong>Poäng: {score}</strong>
      </div>

      <article className="quiz-card">
        <pre style={{ whiteSpace: "pre-wrap" }}>{current.question}</pre>

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
                <span className="option-letter">
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {!checked ? (
          <button
            type="button"
            className="primary-button"
            onClick={checkAnswer}
            disabled={selected === null}
          >
            Rätta svar
          </button>
        ) : (
          <>
            <div className={`feedback ${isCorrect ? "feedback-correct" : "feedback-wrong"}`}>
              <h3>{isCorrect ? "Rätt!" : "Inte riktigt."}</h3>

              {!isCorrect && (
                <p>
                  Rätt svar är: <strong>{current.options[current.answer]}</strong>
                </p>
              )}

              <p>{current.explanation}</p>
            </div>

            <button type="button" className="primary-button" onClick={nextQuestion}>
              {index + 1 >= questions.length ? "Visa resultat" : "Nästa fråga"}
            </button>
          </>
        )}
      </article>
    </section>
  );
}
