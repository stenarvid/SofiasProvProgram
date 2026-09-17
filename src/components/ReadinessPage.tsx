import { Link } from "react-router-dom";
import { getProgress } from "../data/progress";
import {
  getDueQuestionIds,
  getQuestionProgress,
  isQuestionStillMissed
} from "../data/questionProgress";
import { questionBank } from "../data/questionBank";
import { getCodeProgress } from "../data/codeProgress";
import { getStudyFlow } from "../data/studyFlow";
import { studyTopics } from "../data/studyTopics";

export default function ReadinessPage() {
  const progress = getProgress();
  const questionProgress = getQuestionProgress();
  const codeProgress = getCodeProgress();
  const studyFlow = getStudyFlow();

  const totalTopics = studyTopics.length;
  const totalPages = studyTopics.reduce((sum, topic) => sum + topic.pages.length, 0);
  const completedPages = studyFlow.completedPageIds.length;
  const studiedTopics = Object.entries(progress)
    .filter(([, stat]) => stat.correct + stat.wrong > 0)
    .length;

  const dueIds = new Set(getDueQuestionIds());
  const dueQuestions = questionBank.filter((question) => dueIds.has(question.id)).length;

  const unresolvedWrong = Object.values(questionProgress).filter(isQuestionStillMissed);

  const codeItems = Object.values(codeProgress);
  const attemptedCode = codeItems.filter((item) => item.attempts > 0);
  const passedCode = codeItems.filter((item) => item.passes > 0);

  const topicStats = studyTopics.map((topic) => {
    const stat = progress[topic.title];
    const attempts = stat ? stat.correct + stat.wrong : 0;
    const accuracy = attempts ? Math.round((stat.correct / attempts) * 100) : null;
    const completed = topic.pages.filter((page) =>
      studyFlow.completedPageIds.includes(page.id)
    ).length;

    return {
      slug: topic.slug,
      title: topic.title,
      accuracy,
      attempts,
      completed,
      total: topic.pages.length
    };
  });

  const weakTopics = topicStats
    .filter((item) => item.attempts > 0 && item.accuracy !== null)
    .sort((a, b) => (a.accuracy ?? 100) - (b.accuracy ?? 100))
    .slice(0, 4);

  const untouchedTopics = topicStats.filter(
    (item) => item.attempts === 0 && item.completed === 0
  );

  return (
    <section className="readiness-page">
      <div className="readiness-grid">
        <article className="readiness-card">
          <span>Ämnen tränade</span>
          <strong>{studiedTopics} / {totalTopics}</strong>
          <small>Ämnen med minst ett sparat quizresultat.</small>
        </article>

        <article className="readiness-card">
          <span>Teori klar</span>
          <strong>{completedPages} / {totalPages}</strong>
          <small>Sidor du själv markerat som klara.</small>
        </article>

        <article className="readiness-card">
          <span>Repetition nu</span>
          <strong>{dueQuestions}</strong>
          <small>Frågor som är due enligt spaced repetition.</small>
        </article>

        <article className="readiness-card">
          <span>Kod klarad</span>
          <strong>{passedCode.length} / {attemptedCode.length}</strong>
          <small>Kodövningar med minst ett godkänt försök.</small>
        </article>
      </div>

      <div className="readiness-columns">
        <article className="dashboard-panel">
          <div className="section-header-row">
            <div>
              <h3>Det som återstår</h3>
              <p className="muted">Konkreta saker att jobba vidare med.</p>
            </div>
          </div>

          <div className="readiness-todo">
            <div>
              <strong>{unresolvedWrong.length}</strong>
              <span>missade frågor som ännu inte besvarats rätt efter senaste felet</span>
            </div>
            <div>
              <strong>{dueQuestions}</strong>
              <span>frågor att repetera nu</span>
            </div>
            <div>
              <strong>{Math.max(0, totalPages - completedPages)}</strong>
              <span>teorisidor inte markerade som klara</span>
            </div>
            <div>
              <strong>{untouchedTopics.length}</strong>
              <span>ämnen utan teori- eller quizprogress</span>
            </div>
          </div>

          <div className="readiness-actions">
            {dueQuestions > 0 && (
              <Link to="/quiz?mode=review">Repetera due-frågor</Link>
            )}
            {unresolvedWrong.length > 0 && (
              <Link to="/missed-questions">Öva missade frågor</Link>
            )}
          </div>
        </article>

        <article className="dashboard-panel">
          <h3>Ämnen att prioritera</h3>
          <p className="muted">
            Sorterat på lägst träffsäkerhet bland ämnen du faktiskt har tränat.
          </p>

          {weakTopics.length ? (
            <div className="readiness-topic-list">
              {weakTopics.map((topic) => (
                <Link
                  key={topic.slug}
                  to={`/topics?topic=${topic.slug}&page=1`}
                >
                  <span>
                    <strong>{topic.title}</strong>
                    <small>{topic.completed}/{topic.total} teorisidor klara</small>
                  </span>
                  <b>{topic.accuracy}%</b>
                </Link>
              ))}
            </div>
          ) : (
            <p>Gör några quiz så kan sidan börja visa vilka ämnen som behöver mest träning.</p>
          )}
        </article>
      </div>

      <article className="dashboard-panel readiness-note">
        <h3>Hur ska detta läsas?</h3>
        <p>
          Provberedskap här är inte ett betyg eller en gissning om hur provet kommer gå.
          Den visar bara vad du faktiskt har gjort och vad som fortfarande finns kvar
          i din sparade träningsdata.
        </p>
      </article>
    </section>
  );
}
