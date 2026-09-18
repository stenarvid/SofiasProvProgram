import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studyTopics } from "../data/studyTopics";
import { questionBank } from "../data/questionBank";
import { terminology } from "../data/terminology";

type SearchItem = {
  id: string;
  type: "Navigation" | "Teori" | "Quiz";
  title: string;
  description: string;
  keywords: string;
  to: string;
};

const navigationItems: SearchItem[] = [
  { id: "nav-home", type: "Navigation", title: "Start", description: "Startsidan", keywords: "hem home start", to: "/" },
  { id: "nav-learn", type: "Navigation", title: "Lär dig", description: "Teori och sidövningar", keywords: "teori ämnen learn", to: "/topics" },
  { id: "nav-practice", type: "Navigation", title: "Kodövningar", description: "Skriv kod med automatisk rättning", keywords: "kod coding practice", to: "/practice" },
  { id: "nav-code-library", type: "Navigation", title: "Kodbank per ämne", description: "Alla koduppgifter och sparade lösningar per ämne", keywords: "kodbank kod uppgifter react sparad lösning", to: "/code-library" },
  { id: "nav-debug", type: "Navigation", title: "Debug", description: "Felsök kod", keywords: "debug fel felsök", to: "/debug" },
  { id: "nav-flashcards", type: "Navigation", title: "Flashcards", description: "Snabb repetition", keywords: "kort repetition flashcards", to: "/flashcards" },
  { id: "nav-quiz", type: "Navigation", title: "Quiz", description: "Bygg ett eget quiz", keywords: "frågor test quiz", to: "/quiz" },
  { id: "nav-missed-questions", type: "Navigation", title: "Missade frågor", description: "Öva frågor du tidigare svarat fel på", keywords: "missade fel repetitionslista frågor quiz", to: "/missed-questions" },
  { id: "nav-exam", type: "Navigation", title: "Provläge", description: "Träna under provliknande former", keywords: "prov exam timer", to: "/exam" },
  { id: "nav-final", type: "Navigation", title: "Slutprov", description: "Större blandat prov", keywords: "slutprov final exam", to: "/final-exam" },
  { id: "nav-smart", type: "Navigation", title: "Smart träning", description: "Låt sidan välja nästa övning", keywords: "smart random slumpa rekommendation", to: "/smart-practice" },
  { id: "nav-progress", type: "Navigation", title: "Progress", description: "Statistik, provberedskap och sparat", keywords: "progress statistik anteckningar bokmärken", to: "/progress-hub" },
  { id: "nav-daily", type: "Navigation", title: "Dagens träning", description: "Blandat dagligt pass", keywords: "dag daily mix", to: "/daily" },
  { id: "nav-oral", type: "Navigation", title: "Muntligt prov", description: "Förklara högt med egna ord", keywords: "muntligt oral förklara prov", to: "/oral-exam" },
  { id: "nav-explain-code", type: "Navigation", title: "Förklara koden", description: "Beskriv vad kod gör", keywords: "förklara kod code understanding", to: "/explain-code" },
  { id: "nav-output", type: "Navigation", title: "Vad blir output?", description: "Förutse kodens resultat", keywords: "output resultat kod", to: "/output-prediction" },
  { id: "nav-mistakes", type: "Navigation", title: "Mina misstag", description: "Personlig felbok", keywords: "fel misstag wrong notebook", to: "/mistake-notebook" },
  { id: "nav-checklist", type: "Navigation", title: "Provchecklista", description: "Kan jag förklara det?", keywords: "checklista prov beredskap", to: "/exam-checklist" },
  { id: "nav-map", type: "Navigation", title: "Begreppskarta", description: "Se hur teknikerna hänger ihop", keywords: "karta samband concept map", to: "/concept-map" }
];

function buildIndex(): SearchItem[] {
  const theory = studyTopics.flatMap((topic) =>
    topic.pages.map((page, pageIndex) => ({
      id: `theory-${page.id}`,
      type: "Teori" as const,
      title: `${topic.title} · ${page.title}`,
      description: page.intro,
      keywords: [
        topic.title,
        topic.summary,
        page.title,
        page.intro,
        ...page.bullets,
        ...page.cheat,
        page.code,
        page.codeTask
      ].join(" "),
      to: `/topics?topic=${topic.slug}&page=${pageIndex + 1}`
    }))
  );

  const quizTopics = Array.from(new Set(questionBank.map((question) => question.topic))).map((topic) => {
    const questions = questionBank.filter((question) => question.topic === topic);
    return {
      id: `quiz-topic-${topic}`,
      type: "Quiz" as const,
      title: `Quiz · ${topic}`,
      description: `${questions.length} frågor inom ${topic}`,
      keywords: questions.map((question) => `${question.question} ${question.explanation}`).join(" "),
      to: `/quiz?topic=${encodeURIComponent(topic)}`
    };
  });

  const terms: SearchItem[] = studyTopics.map(topic => ({
    id: `terminology-${topic.slug}`, type: "Navigation", title: `Terminologi · ${topic.title}`,
    description: "Begreppsträning med rättning och ordlista",
    keywords: (terminology[topic.slug] ?? []).map(item => `${item.term} ${item.definition}`).join(" "),
    to: `/terminology/${topic.slug}`
  }));
  return [...navigationItems, ...terms, ...theory, ...quizTopics];
}

export default function CommandPalette() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    const ranked = index.map((item) => {
      if (!q) return { item, score: item.type === "Navigation" ? 3 : 1 };

      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();
      const keywords = item.keywords.toLowerCase();

      let score = 0;
      if (title === q) score += 12;
      if (title.startsWith(q)) score += 8;
      if (title.includes(q)) score += 6;
      if (description.includes(q)) score += 3;
      if (keywords.includes(q)) score += 2;

      return { item, score };
    });

    return ranked
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((entry) => entry.item);
  }, [index, query]);

  function close() {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  function choose(item: SearchItem) {
    close();
    navigate(item.to);
  }

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const typing =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable ||
        !!target?.closest(".monaco-editor");

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (!typing && event.key === "/") {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (!open) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((value) => Math.min(results.length - 1, value + 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((value) => Math.max(0, value - 1));
      } else if (event.key === "Enter" && results[activeIndex]) {
        event.preventDefault();
        choose(results[activeIndex]);
      }
    }

    window.addEventListener("open-command-palette", onOpen);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("open-command-palette", onOpen);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, results, activeIndex]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <div className="command-backdrop" onMouseDown={close}>
      <section
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Global sök och kommandon"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="command-input-row">
          <span aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sök teori, quiz eller sida..."
            aria-label="Global sök"
          />
          <kbd>Esc</kbd>
        </div>

        <div className="command-results">
          {results.length ? (
            results.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={index === activeIndex ? "active" : ""}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(item)}
              >
                <span className="command-type">{item.type}</span>
                <span className="command-copy">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>
                <span className="command-arrow">↵</span>
              </button>
            ))
          ) : (
            <p className="command-empty">Inga träffar.</p>
          )}
        </div>

        <footer className="command-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> välj</span>
          <span><kbd>Enter</kbd> öppna</span>
          <span><kbd>Ctrl K</kbd> sök</span>
        </footer>
      </section>
    </div>
  );
}
