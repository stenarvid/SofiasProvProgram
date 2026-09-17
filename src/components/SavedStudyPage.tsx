import { Link } from "react-router-dom";
import { getStudyFlow } from "../data/studyFlow";
import { studyTopics } from "../data/studyTopics";

export default function SavedStudyPage() {
  const flow = getStudyFlow();

  const pages = studyTopics.flatMap((topic) =>
    topic.pages.map((page, pageIndex) => ({
      topic,
      page,
      pageIndex,
      note: flow.pageNotes[page.id] ?? "",
      bookmarked: flow.bookmarkedPageIds.includes(page.id)
    }))
  );

  const notes = pages.filter((item) => item.note.trim().length > 0);
  const bookmarks = pages.filter((item) => item.bookmarked);

  return (
    <section className="saved-study-page">
      <div className="saved-study-columns">
        <article className="dashboard-panel">
          <div className="section-header-row">
            <div>
              <h3>Anteckningar</h3>
              <p className="muted">{notes.length} sidor med egna anteckningar.</p>
            </div>
          </div>

          {notes.length ? (
            <div className="saved-study-list">
              {notes.map((item) => (
                <Link
                  key={`note-${item.page.id}`}
                  to={`/topics?topic=${item.topic.slug}&page=${item.pageIndex + 1}`}
                >
                  <span>
                    <strong>{item.topic.title} · {item.page.title}</strong>
                    <small>{item.note}</small>
                  </span>
                  <b>Öppna →</b>
                </Link>
              ))}
            </div>
          ) : (
            <p>Du har inga egna anteckningar ännu.</p>
          )}
        </article>

        <article className="dashboard-panel">
          <div className="section-header-row">
            <div>
              <h3>Bokmärken</h3>
              <p className="muted">{bookmarks.length} sparade teorisidor.</p>
            </div>
          </div>

          {bookmarks.length ? (
            <div className="saved-study-list">
              {bookmarks.map((item) => (
                <Link
                  key={`bookmark-${item.page.id}`}
                  to={`/topics?topic=${item.topic.slug}&page=${item.pageIndex + 1}`}
                >
                  <span>
                    <strong>{item.topic.title}</strong>
                    <small>{item.page.title}</small>
                  </span>
                  <b>★</b>
                </Link>
              ))}
            </div>
          ) : (
            <p>Du har inga bokmärkta teorisidor ännu.</p>
          )}
        </article>
      </div>
    </section>
  );
}
