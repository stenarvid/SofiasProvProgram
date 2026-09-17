import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getCodeProgress } from "../data/codeProgress";
import { studyTopics } from "../data/studyTopics";
import { getPageCodeGradeMode } from "../data/pageCodeGrader";

const DRAFT_KEY = "provtraning-code-draft-load-v1";

export default function CodeLibraryPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTopic = searchParams.get("topic");
  const fallback = studyTopics[0]?.slug ?? "react";
  const [selectedSlug, setSelectedSlug] = useState(
    initialTopic && studyTopics.some((topic) => topic.slug === initialTopic)
      ? initialTopic
      : fallback
  );
  const [version, setVersion] = useState(0);
  const [openCode, setOpenCode] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener("code-progress-updated", refresh);
    return () => window.removeEventListener("code-progress-updated", refresh);
  }, []);

  const progress = useMemo(() => {
    version;
    return getCodeProgress();
  }, [version]);

  const topic = studyTopics.find((item) => item.slug === selectedSlug) ?? studyTopics[0];

  const rows = topic.pages.map((page, pageIndex) => {
    const exerciseId = `theory-code-${page.id}`;
    const stat = progress[exerciseId];

    return {
      page,
      pageIndex,
      exerciseId,
      stat,
      mode: getPageCodeGradeMode(page.id)
    };
  });

  const attempted = rows.filter((row) => (row.stat?.attempts ?? 0) > 0).length;
  const mastered = rows.filter((row) => (row.stat?.bestScore ?? 0) === 100).length;

  function selectTopic(slug: string) {
    setSelectedSlug(slug);
    setOpenCode(null);
    setSearchParams({ topic: slug }, { replace: true });
  }

  function openInEditor(pageId: string, pageIndex: number, code?: string) {
    if (code?.trim()) {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ pageId, code, savedAt: new Date().toISOString() })
      );
    }

    navigate(`/topics?topic=${topic.slug}&page=${pageIndex + 1}&practice=code`);
  }

  return (
    <section className="code-library-page">
      <div className="hub-hero">
        <span className="topic-badge">Kodbank</span>
        <h2>Alla koduppgifter per ämne</h2>
        <p>
          Välj ett ämne och se alla dess koduppgifter på samma sida. Dina senaste och
          bästa lösningar visas när du har försökt tidigare.
        </p>
      </div>

      <nav className="code-library-tabs" aria-label="Välj kodämne">
        {studyTopics.map((item) => {
          const itemRows = item.pages.map((page) => progress[`theory-code-${page.id}`]);
          const done = itemRows.filter((stat) => (stat?.bestScore ?? 0) === 100).length;

          return (
            <button
              type="button"
              key={item.slug}
              className={item.slug === topic.slug ? "active" : ""}
              onClick={() => selectTopic(item.slug)}
            >
              <strong>{item.title}</strong>
              <span>{done}/{item.pages.length}</span>
            </button>
          );
        })}
      </nav>

      <div className="code-library-summary">
        <div>
          <span>Ämne</span>
          <strong>{topic.title}</strong>
        </div>
        <div>
          <span>Uppgifter</span>
          <strong>{rows.length}</strong>
        </div>
        <div>
          <span>Försökta</span>
          <strong>{attempted}</strong>
        </div>
        <div>
          <span>100%</span>
          <strong>{mastered}</strong>
        </div>
      </div>

      <div className="code-library-list">
        {rows.map(({ page, pageIndex, exerciseId, stat, mode }, index) => {
          const isOpen = openCode === exerciseId;
          const hasCode = !!stat?.lastCode?.trim();

          return (
            <article className="code-library-card" key={page.id}>
              <div className="code-library-card-top">
                <div>
                  <div className="code-library-number">{index + 1}</div>
                  <div>
                    <span className="study-tool-label">
                      {mode === "auto" ? "Automatisk rättning" : "Självbedömning"}
                    </span>
                    <h3>{page.title}</h3>
                  </div>
                </div>

                <div className="code-library-score">
                  {stat?.attempts ? (
                    <>
                      <strong>{stat.bestScore}%</strong>
                      <span>bäst</span>
                    </>
                  ) : (
                    <span>Inte försökt</span>
                  )}
                </div>
              </div>

              <p className="code-library-task">{page.codeTask}</p>

              {stat?.attempts ? (
                <div className="code-library-metrics">
                  <span>Försök: {stat.attempts}</span>
                  <span>Senast: {stat.lastScore}%</span>
                  <span>Bäst: {stat.bestScore}%</span>
                  <span>
                    {stat.lastAttempt
                      ? new Date(stat.lastAttempt).toLocaleDateString("sv-SE")
                      : ""}
                  </span>
                </div>
              ) : (
                <p className="muted">Du har inte gjort den här uppgiften ännu.</p>
              )}

              <div className="code-library-actions">
                <button
                  type="button"
                  className="primary-button auto-width"
                  onClick={() => openInEditor(page.id, pageIndex, stat?.lastCode)}
                >
                  {hasCode ? "Fortsätt på senaste kod" : "Öppna uppgiften"}
                </button>

                {hasCode && (
                  <button
                    type="button"
                    onClick={() => setOpenCode(isOpen ? null : exerciseId)}
                  >
                    {isOpen ? "Dölj kod" : "Visa sparad kod"}
                  </button>
                )}

                <Link to={`/topics?topic=${topic.slug}&page=${pageIndex + 1}`}>
                  Öppna teorisidan
                </Link>
              </div>

              {isOpen && stat?.lastCode && (
                <div className="saved-code-view">
                  <div className="saved-code-heading">
                    <strong>Senaste lösningen</strong>
                    {stat.bestCode && stat.bestCode !== stat.lastCode && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem(
                            DRAFT_KEY,
                            JSON.stringify({
                              pageId: page.id,
                              code: stat.bestCode,
                              savedAt: new Date().toISOString()
                            })
                          );
                          navigate(`/topics?topic=${topic.slug}&page=${pageIndex + 1}&practice=code`);
                        }}
                      >
                        Öppna bästa lösningen
                      </button>
                    )}
                  </div>
                  <pre><code>{stat.lastCode}</code></pre>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
