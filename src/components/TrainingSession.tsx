import { Fragment, useId, useState, type ReactNode } from "react";

export function trainingTopic(topic: string) {
  return ({ Router: "React Router", query: "React Query", Comp: "Components" } as Record<string, string>)[topic] ?? topic;
}

export function TrainingTopicSelect({ topics, value, onChange }: {
  topics: readonly string[];
  value: string;
  onChange: (topic: string) => void;
}) {
  const id = useId();
  const choices = [...new Set(topics.map(trainingTopic))].sort((a, b) => a.localeCompare(b, "sv"));
  return <label htmlFor={id} className="difficulty-control">Ämne
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">Alla ämnen</option>
      {choices.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
    </select>
  </label>;
}

/** A round lasts until an explicit restart or leaving the page. Topic changes keep its history. */
export default function TrainingSession<T>({ items, topics, children }: {
  items: readonly T[];
  topics: (item: T) => readonly string[];
  children: (item: T, index: number, next: () => void) => ReactNode;
}) {
  const [topic, setTopic] = useState("");
  const [current, setCurrent] = useState<number | null>(items.length ? 0 : null);
  const [seen, setSeen] = useState<number[]>(items.length ? [0] : []);
  const [round, setRound] = useState(0);
  const matches = (index: number, selected: string) => !selected || topics(items[index]).map(trainingTopic).includes(selected);
  const available = items.map((_, index) => index).filter((index) => matches(index, topic));
  const remaining = available.filter((index) => !seen.includes(index));

  function open(index: number | undefined) {
    setCurrent(index ?? null);
    if (index !== undefined) setSeen((previous) => [...previous, index]);
  }

  function selectTopic(selected: string) {
    setTopic(selected);
    if (current !== null && matches(current, selected)) return;
    const next = items.findIndex((_, index) => matches(index, selected) && !seen.includes(index));
    open(next < 0 ? undefined : next);
  }

  function restart() {
    const first = available[0];
    setSeen(first === undefined ? [] : [first]);
    setCurrent(first ?? null);
    setRound((value) => value + 1);
  }

  return <div className="training-session">
    <div className="quiz-topbar">
      <TrainingTopicSelect topics={items.flatMap((item) => [...topics(item)])} value={topic} onChange={selectTopic} />
      <span aria-live="polite">{available.length - remaining.length} av {available.length} uppgifter visade</span>
    </div>
    <p className="muted">Varje uppgift visas en gång per omgång. Ämnesbyte behåller historiken. En ny omgång börjar när du startar om eller lämnar sidan och kommer tillbaka.</p>
    {current === null ? <section className="dashboard-panel" aria-live="polite">
      <h2>Omgången är klar!</h2>
      <p>Alla uppgifter för {topic || "alla ämnen"} har visats. Du kan starta en ny omgång för att öva igen.</p>
      <p className="muted">Det betyder inte att alla svar var rätt. Repetera gärna det som var svårt.</p>
      {seen.length < items.length && <p>Välj ett annat ämne för att fortsätta med uppgifter som inte har visats.</p>}
      <button type="button" className="primary-button auto-width" onClick={restart}>Starta ny omgång</button>
    </section> : <Fragment key={`${round}-${current}`}>
      {children(items[current], current, () => open(remaining[0]))}
    </Fragment>}
  </div>;
}
