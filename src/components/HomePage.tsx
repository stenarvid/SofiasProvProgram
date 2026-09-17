import { Link } from "react-router-dom";
import { getProgress } from "../data/progress";
import { getDueQuestionIds } from "../data/questionProgress";
import { getAllMissedQuestionCount } from "../data/missedQuestions";
import { questionBank } from "../data/questionBank";
import { getTestHistory } from "../data/history";
import { getCodeProgress } from "../data/codeProgress";
import { getStudyFlow } from "../data/studyFlow";
import { studyTopics } from "../data/studyTopics";
import DailyGoalCard from "./DailyGoalCard";
import StudyStreakCard from "./StudyStreakCard";
import RecentActivityCard from "./RecentActivityCard";

export default function HomePage() {
  const progress = getProgress();
  const dueIds = getDueQuestionIds();
  const dueBankCount = dueIds.filter((id) => questionBank.some((q) => q.id === id)).length;
  const history = getTestHistory();
  const codeProgress = getCodeProgress();
  const studyFlow = getStudyFlow();

  const topicRows = Object.entries(progress)
    .map(([topic, stat]) => {
      const total = stat.correct + stat.wrong;
      return {
        topic,
        total,
        percent: total ? Math.round((stat.correct / total) * 100) : 0
      };
    })
    .filter((row) => row.total > 0)
    .sort((a, b) => a.percent - b.percent);

  const weakest = topicRows.slice(0, 3);
  const wrongQuestions = getAllMissedQuestionCount();
  const codeAttempts = Object.values(codeProgress).reduce((sum, item) => sum + item.attempts, 0);
  const latest = history[0];
  const last = studyFlow.lastLocation;
  const completedCount = studyFlow.completedPageIds.length;
  const totalTheoryPages = studyTopics.reduce((sum, topic) => sum + topic.pages.length, 0);
  const bookmarkCount = studyFlow.bookmarkedPageIds.length;

  const firstUnfinished = studyTopics
    .flatMap((topic) =>
      topic.pages.map((page, pageIndex) => ({
        topic,
        page,
        pageIndex
      }))
    )
    .find((item) => !studyFlow.completedPageIds.includes(item.page.id));

  const weakestTopic = topicRows[0];
  const weakestStudyTopic = weakestTopic
    ? studyTopics.find((topic) => topic.title === weakestTopic.topic)
    : undefined;

  const smartNext = dueBankCount > 0
    ? {
        to: "/quiz?mode=review",
        title: "Repetera due-frågor",
        reason: `${dueBankCount} frågor är aktuella enligt spaced repetition.`
      }
    : wrongQuestions > 0
      ? {
          to: "/missed-questions",
          title: "Öva dina missade frågor",
          reason: `${wrongQuestions} frågor har tidigare blivit fel.`
        }
      : weakestStudyTopic && weakestTopic
        ? {
            to: `/quiz?topic=${encodeURIComponent(weakestStudyTopic.title)}`,
            title: `Träna ${weakestStudyTopic.title}`,
            reason: `${weakestTopic.percent}% rätt hittills i detta ämne.`
          }
        : firstUnfinished
          ? {
              to: `/topics?topic=${firstUnfinished.topic.slug}&page=${firstUnfinished.pageIndex + 1}`,
              title: `Fortsätt med ${firstUnfinished.topic.title}`,
              reason: `Nästa teorisida som inte är markerad som klar.`
            }
          : {
              to: "/practice",
              title: "Gör en kodövning",
              reason: "Teorin ser genomgången ut – fortsätt praktiskt."
            };

  return (
    <section className="dashboard">
      <div className="dashboard-hero">
        <div>
          <span className="topic-badge">Provträning</span>
          <h2>Vad vill du göra nu?</h2>
          <p>
            Läs ett ämne, kör dagens träningspass eller fortsätt där din statistik visar
            att du behöver mest repetition.
          </p>
          <div className="hero-key-hints">
            <span><kbd>Ctrl K</kbd> global sök</span>
            <span><kbd>?</kbd> genvägar</span>
            <span><kbd>R</kbd> smart träning</span>
          </div>
        </div>

        <div className="dashboard-hero-actions">
          {last && (
            <Link
              className="dashboard-primary"
              to={`/topics?topic=${encodeURIComponent(last.topicSlug)}&page=${last.pageIndex + 1}`}
            >
              Fortsätt: {last.topicTitle} →
            </Link>
          )}

          <Link className={last ? "dashboard-secondary" : "dashboard-primary"} to="/daily">
            Dagens träning
          </Link>
        </div>
      </div>

      <Link className="smart-next-card" to={smartNext.to}>
        <div>
          <span className="study-tool-label">Rekommenderat nästa steg</span>
          <h3>{smartNext.title}</h3>
          <p>{smartNext.reason}</p>
        </div>
        <strong>Gör detta nu →</strong>
      </Link>

      <div className="smart-practice-row">
        <Link className="smart-random-button" to="/smart-practice">
          🎲 Slumpa smart träning
        </Link>
        <span>Väljer automatiskt något relevant utifrån din progress.</span>
      </div>

      <div className="dashboard-actions">
        <Link to="/topics">
          <strong>Lär dig</strong>
          <span>Läs teori sida för sida och öva direkt under varje avsnitt.</span>
        </Link>
        <Link to="/train">
          <strong>Träna</strong>
          <span>Kod, debug, flashcards och praktiska övningar.</span>
        </Link>
        <Link to="/test">
          <strong>Testa dig</strong>
          <span>Quiz, provläge och slutprov.</span>
        </Link>
        <Link
          to="/missed-questions"
          className={wrongQuestions > 0 ? "dashboard-action-emphasis" : ""}
        >
          <strong>Missade frågor</strong>
          <span>
            {wrongQuestions > 0
              ? `${wrongQuestions} frågor att öva på igen.`
              : "Här dyker frågor du svarat fel på upp."}
          </span>
        </Link>
        <Link to="/progress-hub">
          <strong>Se progress</strong>
          <span>Kodresultat, historik, statistik och backup.</span>
        </Link>
        {dueBankCount > 0 && (
          <Link className="dashboard-action-review" to="/quiz?mode=review">
            <strong>Repetera nu</strong>
            <span>{dueBankCount} frågor är aktuella enligt spaced repetition.</span>
          </Link>
        )}

      </div>

      <div className="dashboard-grid">
        <DailyGoalCard />
        <StudyStreakCard />
        <RecentActivityCard />

        <article className="dashboard-panel">
          <div className="section-header-row">
            <div>
              <h3>Att repetera</h3>
              <p className="muted">Dina svagaste ämnen just nu.</p>
            </div>
            <Link to="/progress-hub">Visa allt</Link>
          </div>

          {weakest.length ? (
            <div className="weak-topic-list">
              {weakest.map((row) => (
                <div key={row.topic}>
                  <strong>{row.topic}</strong>
                  <span>{row.percent}% rätt</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Gör några quizfrågor så börjar sidan bygga din progress.</p>
          )}
        </article>

        <article className="dashboard-panel">
          <h3>Snabbstatus</h3>
          <div className="dashboard-stats dashboard-stats-expanded">
            <div><strong>{wrongQuestions}</strong><span>frågor att repetera</span></div>
            <div><strong>{codeAttempts}</strong><span>kodförsök</span></div>
            <div><strong>{history.length}</strong><span>sparade test</span></div>
            <div><strong>{completedCount}/{totalTheoryPages}</strong><span>teorisidor klara</span></div>
            <div><strong>{bookmarkCount}</strong><span>bokmärken</span></div>
          </div>

          {latest && (
            <p className="latest-result">
              Senaste test: <strong>{latest.score}/{latest.total}</strong>
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
