import { useState } from "react";
import { studyTopics } from "../data/studyTopics";

const KEY = "provtraning-exam-checklist-v1";

function load(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); }
  catch { return {}; }
}

export default function ExamChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => load());
  const items = studyTopics.flatMap((topic) =>
    topic.pages.map((page) => ({
      id: page.id,
      topic: topic.title,
      title: page.title
    }))
  );

  const done = items.filter((item) => checked[item.id]).length;

  function toggle(id: string) {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("progress-data-changed"));
  }

  return (
    <section className="learning-page">
      <div className="hub-hero">
        <span className="topic-badge">Provchecklista</span>
        <h2>Kan jag förklara det utan hjälp?</h2>
        <p>Markera bara något när du känner att du kan förklara ämnet själv, inte bara känna igen rätt svar.</p>
      </div>

      <div className="checklist-progress">
        <strong>{done} / {items.length}</strong>
        <span>moment markerade</span>
        <div><i style={{ width: `${Math.round(done / items.length * 100)}%` }} /></div>
      </div>

      <div className="checklist-topics">
        {studyTopics.map((topic) => (
          <article className="checklist-topic" key={topic.slug}>
            <h3>{topic.title}</h3>
            {topic.pages.map((page) => (
              <label key={page.id}>
                <input
                  type="checkbox"
                  checked={!!checked[page.id]}
                  onChange={() => toggle(page.id)}
                />
                <span>Jag kan förklara: <strong>{page.title}</strong></span>
              </label>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
