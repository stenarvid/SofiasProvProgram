import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { studyTopics as topics } from "../data/studyTopics";
import { getTheoryExplanation, getExampleWalkthrough } from "../data/theoryExplanations";
import { configureCourseEditor } from "../data/monacoCourseTypes";
import Editor, { type OnMount } from "@monaco-editor/react";
import { recordAnswer } from "../data/progress";
import { recordQuestionResult } from "../data/questionProgress";
import { saveTestResult } from "../data/history";
import { recordCodeAttempt } from "../data/codeProgress";
import { recordRecentActivity } from "../data/recentActivity";
import { gradePageCode, getPageCodeGradeMode, getSelfAssessmentGuidance } from "../data/pageCodeGrader";
import type { GradeResult } from "../data/codeGrader";
import { getStudyPageQuizQuestions, isQuizSelectionCorrect } from "../data/studyPageQuiz";
import {
  getStudyFlow,
  saveLastStudyLocation,
  savePageNote,
  setPageCompleted,
  togglePageBookmark
} from "../data/studyFlow";

export default function TopicsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTopic = searchParams.get("topic") ?? "react";
  const initialPage = Math.max(0, Number(searchParams.get("page") ?? "1") - 1);

  const [selectedSlug, setSelectedSlug] = useState(
    topics.some((topic) => topic.slug === initialTopic) ? initialTopic : "react"
  );
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number[]>([]);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});
  const [code, setCode] = useState("");
  const [codeSaved, setCodeSaved] = useState(false);
  const [pageCodeGrade, setPageCodeGrade] = useState<GradeResult | null>(null);
  const [pageCodeGradePageId, setPageCodeGradePageId] = useState<string | null>(null);
  const [pageCodeGrading, setPageCodeGrading] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [practiceTab, setPracticeTab] = useState<"cheat" | "quiz" | "code">("quiz");
  const [studyFlow, setStudyFlow] = useState(() => getStudyFlow());
  const [searchQuery, setSearchQuery] = useState("");
  const [theoryMode, setTheoryMode] = useState<"explain" | "bullets">(() => {
    try {
      return localStorage.getItem("provtraning-theory-mode-v1") === "bullets"
        ? "bullets"
        : "explain";
    } catch {
      return "explain";
    }
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const currentPageIdRef = useRef<string>("");

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.slug === selectedSlug) ?? topics[0],
    [selectedSlug]
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return topics.flatMap((topic) =>
      topic.pages.flatMap((page, pageIndex) => {
        const haystack = [
          topic.title,
          topic.summary,
          page.title,
          page.intro,
          ...page.bullets,
          ...page.cheat,
          page.code,
          page.codeTask
        ].join(" ").toLowerCase();

        return haystack.includes(q)
          ? [{ topic, page, pageIndex }]
          : [];
      })
    ).slice(0, 12);
  }, [searchQuery]);

  const maxPages = selectedTopic.pages.length;
  const safePageIndex = Math.min(pageIndex, Math.max(0, maxPages - 1));
  const page = selectedTopic.pages[safePageIndex];
  currentPageIdRef.current = page.id;

  const pageQuizQuestions = useMemo(
    () => getStudyPageQuizQuestions(page, selectedTopic, topics),
    [page, selectedTopic]
  );
  const currentPageQuiz = pageQuizQuestions[Math.min(quizIndex, pageQuizQuestions.length - 1)];

  useEffect(() => {
    if (safePageIndex !== pageIndex) {
      setPageIndex(safePageIndex);
      return;
    }

    saveLastStudyLocation({
      topicSlug: selectedTopic.slug,
      pageIndex: safePageIndex,
      topicTitle: selectedTopic.title,
      pageTitle: page.title
    });

    recordRecentActivity({
      id: `theory:${page.id}`,
      label: `${selectedTopic.title} · ${page.title}`,
      detail: "Teorisida",
      to: `/topics?topic=${selectedTopic.slug}&page=${safePageIndex + 1}`
    });

    setSearchParams(
      { topic: selectedTopic.slug, page: String(safePageIndex + 1) },
      { replace: true }
    );
  }, [
    selectedTopic.slug,
    selectedTopic.title,
    page.title,
    safePageIndex,
    pageIndex,
    setSearchParams
  ]);

  useEffect(() => {
    const refresh = () => setStudyFlow(getStudyFlow());
    window.addEventListener("study-flow-updated", refresh);
    return () => window.removeEventListener("study-flow-updated", refresh);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("provtraning-code-draft-load-v1");
      if (!raw) return;

      const draft = JSON.parse(raw) as { pageId?: string; code?: string };

      if (draft.pageId === page.id && typeof draft.code === "string") {
        setCode(draft.code);
        setCodeSaved(false);
        setPageCodeGrade(null);
        setPageCodeGradePageId(null);
        setPracticeOpen(true);
        setPracticeTab("code");
        localStorage.removeItem("provtraning-code-draft-load-v1");
      }
    } catch {
      localStorage.removeItem("provtraning-code-draft-load-v1");
    }
  }, [page.id]);

  useEffect(() => {
    // A result from another theory page must never remain visible after navigation.
    setPageCodeGrade(null);
    setPageCodeGradePageId(null);
    setPageCodeGrading(false);
  }, [page.id]);

  const isCompleted = studyFlow.completedPageIds.includes(page.id);
  const isBookmarked = studyFlow.bookmarkedPageIds.includes(page.id);
  const currentNote = studyFlow.pageNotes[page.id] ?? "";

  function topicCompletion(topicSlug: string) {
    const topic = topics.find((item) => item.slug === topicSlug);
    if (!topic) return { done: 0, total: 0 };
    return {
      done: topic.pages.filter((item) => studyFlow.completedPageIds.includes(item.id)).length,
      total: topic.pages.length
    };
  }

  function resetPractice() {
    setQuizIndex(0);
    setQuizSelected([]);
    setQuizChecked(false);
    setQuizResults({});
    setCode("");
    setCodeSaved(false);
    setPageCodeGrade(null);
    setPageCodeGradePageId(null);
    setPageCodeGrading(false);
    setPracticeOpen(false);
    setPracticeTab("quiz");
  }

  function selectTopic(slug: string) {
    setSelectedSlug(slug);
    setPageIndex(0);
    resetPractice();
  }

  function goToPage(next: number) {
    const safe = Math.max(0, Math.min(maxPages - 1, next));
    setPageIndex(safe);
    resetPractice();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePageInput(value: string) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    goToPage(parsed - 1);
  }

  function toggleCompleted() {
    setPageCompleted(page.id, !isCompleted);
    setStudyFlow(getStudyFlow());
  }

  function toggleBookmark() {
    togglePageBookmark(page.id);
    setStudyFlow(getStudyFlow());
  }

  function retryPageQuiz() {
    setQuizSelected([]);
    setQuizChecked(false);
  }

  function restartPageQuiz() {
    setQuizIndex(0);
    setQuizSelected([]);
    setQuizChecked(false);
    setQuizResults({});
  }

  function nextPageQuizQuestion() {
    if (quizIndex >= pageQuizQuestions.length - 1) return;
    setQuizIndex((value) => value + 1);
    setQuizSelected([]);
    setQuizChecked(false);
  }

  function toggleQuizOption(optionIndex: number) {
    if (quizChecked) return;

    if (currentPageQuiz.type === "single") {
      setQuizSelected([optionIndex]);
      return;
    }

    setQuizSelected((current) =>
      current.includes(optionIndex)
        ? current.filter((value) => value !== optionIndex)
        : [...current, optionIndex]
    );
  }

  function updatePageNote(note: string) {
    savePageNote(page.id, note);
    setStudyFlow(getStudyFlow());
  }

  function checkPageQuiz() {
    if (quizSelected.length === 0 || quizChecked) return;

    const correct = isQuizSelectionCorrect(
      quizSelected,
      currentPageQuiz.correctAnswers
    );

    setQuizChecked(true);
    setQuizResults((current) => ({ ...current, [quizIndex]: correct }));

    const progressId = `theory-${page.id}-q${quizIndex + 1}`;
    recordAnswer(selectedTopic.title, correct);
    recordQuestionResult(
      progressId,
      selectedTopic.title,
      currentPageQuiz.question,
      correct,
      {
        source: "page",
        pageTitle: page.title,
        type: currentPageQuiz.type,
        options: currentPageQuiz.options,
        correctAnswers: currentPageQuiz.correctAnswers,
        explanation: currentPageQuiz.explanation
      }
    );

    saveTestResult({
      date: new Date().toISOString(),
      score: correct ? 1 : 0,
      total: 1,
      topics: [`${selectedTopic.title} – ${page.title}`]
    });
  }

  function changeTheoryMode(mode: "explain" | "bullets") {
    setTheoryMode(mode);
    try {
      localStorage.setItem("provtraning-theory-mode-v1", mode);
    } catch {
      // localStorage may be unavailable in a restricted browser context.
    }
  }

  const handleStudyEditorMount: OnMount = (editor, monaco) => {
    configureCourseEditor(editor, monaco);
  };

  async function gradeCodePractice() {
    const gradingPageId = page.id;
    const gradingTopicTitle = selectedTopic.title;
    const gradingPageTitle = page.title;
    const submittedCode = code;

    if (!submittedCode.trim() || getPageCodeGradeMode(gradingPageId) !== "auto") return;

    setPageCodeGrading(true);
    setPageCodeGrade(null);
    setPageCodeGradePageId(null);

    const result = await gradePageCode(gradingPageId, submittedCode);

    // If the learner changed page while grading was running, ignore the old result.
    if (currentPageIdRef.current !== gradingPageId) {
      return;
    }

    recordCodeAttempt(
      `theory-code-${gradingPageId}`,
      gradingTopicTitle,
      `${gradingTopicTitle} – ${gradingPageTitle}`,
      result.score,
      result.passed,
      submittedCode
    );

    setPageCodeGrade(result);
    setPageCodeGradePageId(gradingPageId);
    setCodeSaved(true);
    setPageCodeGrading(false);
  }

  function saveSelfAssessedPractice() {
    if (!code.trim()) return;

    recordCodeAttempt(
      `theory-code-${page.id}`,
      selectedTopic.title,
      `${selectedTopic.title} – ${page.title}`,
      100,
      true,
      code
    );

    setCodeSaved(true);
  }

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable ||
        !!target?.closest(".monaco-editor");

      if (isTyping || event.ctrlKey || event.metaKey || event.altKey) return;

      const key = event.key.toLowerCase();

      if (event.key === "ArrowLeft" && safePageIndex > 0) {
        event.preventDefault();
        goToPage(safePageIndex - 1);
      } else if (event.key === "ArrowRight" && safePageIndex < maxPages - 1) {
        event.preventDefault();
        goToPage(safePageIndex + 1);
      } else if (key === "q") {
        event.preventDefault();
        setPracticeOpen(true);
        setPracticeTab("quiz");
      } else if (key === "c") {
        event.preventDefault();
        setPracticeOpen(true);
        setPracticeTab("code");
      } else if (key === "h") {
        event.preventDefault();
        setPracticeOpen(true);
        setPracticeTab("cheat");
      } else if (key === "b") {
        event.preventDefault();
        toggleBookmark();
      } else if (key === "m") {
        event.preventDefault();
        toggleCompleted();
      } else if (key === "o") {
        event.preventDefault();
        setPracticeOpen((value) => !value);
      } else if (key === "s") {
        event.preventDefault();
        searchInputRef.current?.focus();
      } else if (key === "n") {
        event.preventDefault();
        noteRef.current?.focus();
      } else if (event.key === "Escape") {
        if (practiceOpen) {
          event.preventDefault();
          setPracticeOpen(false);
        }
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });

  return (
    <section className="topic-book">
      <aside className="topic-book-sidebar">
        <div className="topic-book-sidebar-inner">
          <div className="sidebar-title-row">
            <h2>Ämnen</h2>
            <span>{topics.length}</span>
          </div>
          <p className="muted">Välj område och fortsätt sida för sida.</p>

          <div className="topic-search">
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök t.ex. useState..."
              aria-label="Sök i teori"
            />

            {searchQuery.trim() && (
              <div className="topic-search-results">
                {searchResults.length ? (
                  searchResults.map((result) => (
                    <button
                      type="button"
                      key={`${result.topic.slug}-${result.page.id}`}
                      onClick={() => {
                        setSelectedSlug(result.topic.slug);
                        setPageIndex(result.pageIndex);
                        setSearchQuery("");
                        resetPractice();
                      }}
                    >
                      <strong>{result.topic.title}</strong>
                      <span>{result.page.title}</span>
                    </button>
                  ))
                ) : (
                  <p>Inga träffar.</p>
                )}
              </div>
            )}
          </div>

          <nav className="topic-book-menu" aria-label="Ämnen">
            {topics.map((topic) => (
              <button
                type="button"
                key={topic.slug}
                className={selectedSlug === topic.slug ? "active" : ""}
                onClick={() => selectTopic(topic.slug)}
              >
                <strong>{topic.title}</strong>
                <small>{topic.summary}</small>
                <span className="topic-page-count">
                  {topicCompletion(topic.slug).done}/{topicCompletion(topic.slug).total} klara
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="topic-book-content">
        <div className="topic-book-heading">
          <div>
            <div className="topic-kicker-row">
              <span className="topic-badge">{selectedTopic.title}</span>
              <span className="topic-inline-page">
                {safePageIndex + 1} / {maxPages}
                <span className={isCompleted ? "topic-page-done" : "topic-page-not-done"}>
                  {isCompleted ? "✓ Klar" : "Inte klar"}
                </span>
              </span>
            </div>
            <h1>{page.title}</h1>
            <p className="topic-book-intro">{page.intro}</p>
          </div>

          <div className="topic-page-actions">
            <button
              type="button"
              className={isBookmarked ? "active" : ""}
              onClick={toggleBookmark}
              title={isBookmarked ? "Ta bort bokmärke" : "Bokmärk sidan"}
            >
              {isBookmarked ? "★ Bokmärkt" : "☆ Bokmärk"}
            </button>

            <button
              type="button"
              className={isCompleted ? "complete" : ""}
              onClick={toggleCompleted}
            >
              {isCompleted ? "✓ Klar" : "Markera som klar"}
            </button>

            <Link className="topic-checkpoint-link" to={`/checkpoint/${selectedTopic.slug}`}>
              Checkpoint
            </Link>
          </div>
        </div>

        <div className="shortcut-hint" title="Tangentbordsgenvägar">
          <span>←/→ sida</span>
          <span>Q quiz</span>
          <span>C kod</span>
          <span>H cheat</span>
          <span>S sök</span>
          <span>N anteckning</span>
          <span>B bokmärk</span>
          <span>M klar</span>
          <span>O övning</span>
        </div>

        <article className="topic-book-page">
          <section className="topic-book-section theory-reading-card">
            <div className="theory-section-heading">
              <div>
                <span className="study-tool-label">
                  {theoryMode === "explain" ? "Förklaringsläge" : "Punktläge"}
                </span>
                <h2>
                  {theoryMode === "explain"
                    ? "Förstå hur det fungerar"
                    : "Det viktigaste på den här sidan"}
                </h2>
              </div>

              <div className="theory-mode-switch" role="group" aria-label="Välj teoriläge">
                <button
                  type="button"
                  className={theoryMode === "explain" ? "active" : ""}
                  onClick={() => changeTheoryMode("explain")}
                >
                  Förklaring
                </button>
                <button
                  type="button"
                  className={theoryMode === "bullets" ? "active" : ""}
                  onClick={() => changeTheoryMode("bullets")}
                >
                  Punkter
                </button>
              </div>
            </div>

            {theoryMode === "explain" ? (
              <div className="theory-explanation">
                {getTheoryExplanation(page.id, page.intro).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <ul className="theory-bullet-list">
                {page.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}

            {page.code && (
              <div className="theory-code-wrap">
                <div className="theory-code-label">
                  <span>Kodexempel</span>
                  {theoryMode === "explain" && (
                    <small>Följ koden och genomgången nedan inför uppgiften.</small>
                  )}
                </div>
                <div className="topic-book-code">
                  <pre><code>{page.code}</code></pre>
                </div>
                {theoryMode === "explain" && getExampleWalkthrough(page.id).length > 0 && (
                  <div className="theory-explanation">
                    <h3>Så fungerar exemplet, steg för steg</h3>
                    {getExampleWalkthrough(page.id).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="topic-note-card">
            <div className="topic-note-heading">
              <div>
                <span className="study-tool-label">Mina anteckningar</span>
                <h2>Kom ihåg till senare</h2>
              </div>
              <span>Sparas automatiskt</span>
            </div>

            <textarea
              ref={noteRef}
              value={currentNote}
              onChange={(e) => updatePageNote(e.target.value)}
              placeholder="Skriv t.ex. &quot;response.ok måste kontrolleras innan response.json()&quot;..."
              aria-label={`Egna anteckningar för ${page.title}`}
              rows={3}
            />
          </section>

          <button
            type="button"
            className="topic-practice-toggle"
            onClick={() => setPracticeOpen((open) => !open)}
          >
            <span>
              <strong>Öva på den här sidan</strong>
              <small>Quiz · Kodövning · Cheat sheet</small>
            </span>
            <span aria-hidden="true">{practiceOpen ? "▲" : "▼"}</span>
          </button>

          {practiceOpen && (
            <section className="topic-study-tools">
              <div className="study-tools-heading">
                <div>
                  <span className="study-tool-label">Sidspecifik träning</span>
                  <h2>{selectedTopic.title} · {page.title}</h2>
                </div>
                <span className="saved-note">Progress sparas automatiskt</span>
              </div>

              <nav className="study-tabs" aria-label="Träningssätt">
                <button
                  type="button"
                  className={practiceTab === "quiz" ? "active" : ""}
                  onClick={() => setPracticeTab("quiz")}
                >
                  Quiz
                </button>
                <button
                  type="button"
                  className={practiceTab === "code" ? "active" : ""}
                  onClick={() => setPracticeTab("code")}
                >
                  Kod
                </button>
                <button
                  type="button"
                  className={practiceTab === "cheat" ? "active" : ""}
                  onClick={() => setPracticeTab("cheat")}
                >
                  Cheat sheet
                </button>
              </nav>

              <div className="study-tab-panel">
                {practiceTab === "cheat" && (
                  <article className="study-focus-card">
                    <h3>Kom ihåg från den här sidan</h3>
                    <ul className="cheat-list">
                      {page.cheat.map((item, index) => (
                        <li key={item}>
                          <span>{index + 1}</span>
                          <p>{item}</p>
                        </li>
                      ))}
                    </ul>
                  </article>
                )}

                {practiceTab === "quiz" && (
                  <article className="study-focus-card">
                    <div className="quiz-mini-header">
                      <span>
                        Fråga {quizIndex + 1} / {pageQuizQuestions.length}
                      </span>
                      <span>
                        {currentPageQuiz.type === "multi"
                          ? "Flervalsfråga · välj alla rätt"
                          : "En rätt"}
                      </span>
                    </div>

                    <h3>{currentPageQuiz.question}</h3>

                    {currentPageQuiz.type === "multi" && !quizChecked && (
                      <p className="muted page-quiz-instruction">
                        Det kan finnas flera rätta svar. Markera alla som stämmer innan du rättar.
                      </p>
                    )}

                    <div className="page-quiz-options">
                      {currentPageQuiz.options.map((option, i) => {
                        const selected = quizSelected.includes(i);
                        const isCorrectOption = currentPageQuiz.correctAnswers.includes(i);

                        let cls = "page-quiz-option";
                        if (!quizChecked && selected) cls += " selected";
                        if (quizChecked && isCorrectOption) cls += " correct";
                        if (quizChecked && selected && !isCorrectOption) cls += " wrong";

                        return (
                          <button
                            type="button"
                            key={`${currentPageQuiz.id}-${option}`}
                            className={cls}
                            onClick={() => toggleQuizOption(i)}
                          >
                            <span className="quiz-option-letter">
                              {currentPageQuiz.type === "multi"
                                ? selected ? "✓" : "□"
                                : String.fromCharCode(65 + i)}
                            </span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      className="primary-button auto-width"
                      onClick={checkPageQuiz}
                      disabled={quizSelected.length === 0 || quizChecked}
                    >
                      Rätta svar
                    </button>

                    {quizChecked && (
                      <div className="quiz-result-block">
                        <p
                          className={
                            quizResults[quizIndex]
                              ? "page-result-ok"
                              : "page-result-wrong"
                          }
                        >
                          {quizResults[quizIndex]
                            ? `Rätt! ${currentPageQuiz.explanation}`
                            : `Inte helt rätt. ${currentPageQuiz.explanation}`}
                        </p>

                        <div className="quiz-next-actions">
                          {!quizResults[quizIndex] && (
                            <button type="button" onClick={retryPageQuiz}>
                              Försök igen
                            </button>
                          )}

                          {quizIndex < pageQuizQuestions.length - 1 ? (
                            <button type="button" onClick={nextPageQuizQuestion}>
                              Nästa fråga →
                            </button>
                          ) : (
                            <>
                              <span className="page-quiz-summary">
                                Resultat: {
                                  Object.entries(quizResults)
                                    .filter(([key, value]) => Number(key) !== quizIndex && value)
                                    .length + (quizResults[quizIndex] ? 1 : 0)
                                }/{pageQuizQuestions.length} rätt
                              </span>
                              <button type="button" onClick={restartPageQuiz}>
                                Gör om sidquizet
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                )}

                {practiceTab === "code" && (
                  <article className="study-focus-card">
                    <h3>{page.codeTask}</h3>

                    {getPageCodeGradeMode(page.id) === "auto" ? (
                      <>
                        <p className="muted">
                          Skriv TypeScript/TSX i editorn och tryck <strong>Rätta kod</strong>.
                          Du får delpoäng och ser exakt vilka krav som saknas. Resultatet sparas i Kodprogress.
                        </p>

                        <div className="editor-shell polished-editor">
                          <Editor
                            key={`study-editor-${page.id}`}
                            height="280px"
                            language="typescript"
                            path={`study-${page.id}.tsx`}
                            onMount={handleStudyEditorMount}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => {
                              setCode(value ?? "");
                              setCodeSaved(false);
                              setPageCodeGrade(null);
                              setPageCodeGradePageId(null);
                            }}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 14,
                              lineHeight: 22,
                              quickSuggestions: true,
                              parameterHints: { enabled: true },
                              padding: { top: 14, bottom: 14 }
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          className="primary-button auto-width"
                          onClick={gradeCodePractice}
                          disabled={code.trim().length === 0 || pageCodeGrading}
                        >
                          {pageCodeGrading ? "Rättar..." : "Rätta kod"}
                        </button>

                        {pageCodeGrade && pageCodeGradePageId === page.id && (
                          <div className={`page-code-grade ${pageCodeGrade.passed ? "page-code-grade-pass" : "page-code-grade-partial"}`}>
                            <div className="page-code-grade-heading">
                              <div>
                                <strong>{pageCodeGrade.passed ? "Alla krav uppfyllda ✓" : "Inte helt rätt ännu"}</strong>
                                <span>Försöket är sparat i Kodprogress.</span>
                              </div>
                              <b>{pageCodeGrade.score}%</b>
                            </div>

                            {pageCodeGrade.compileError ? (
                              <div className="grade-compile-error">
                                <strong>Koden kunde inte rättas:</strong>
                                <pre><code>{pageCodeGrade.compileError}</code></pre>
                              </div>
                            ) : (
                              <div className="page-code-tests">
                                {pageCodeGrade.tests.map((test) => (
                                  <div className={test.passed ? "page-code-test pass" : "page-code-test fail"} key={test.name}>
                                    <span>{test.passed ? "✓" : "✗"}</span>
                                    <div>
                                      <strong>{test.name}</strong>
                                      <p>{test.details}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="muted">
                          Det här är en förklaringsuppgift, så sidan låtsas inte kunna automatbedöma fritext.
                          Skriv ditt resonemang och jämför med stödet innan du själv markerar försöket.
                        </p>

                        <textarea
                          className="page-self-answer"
                          rows={8}
                          value={code}
                          onChange={(event) => {
                            setCode(event.target.value);
                            setCodeSaved(false);
                          }}
                          placeholder="Skriv din förklaring med egna ord..."
                        />

                        <div className="reference-answer page-self-guidance">
                          <strong>Det ditt svar bör ta upp</strong>
                          <p>{getSelfAssessmentGuidance(page.id)}</p>
                        </div>

                        <button
                          type="button"
                          className="primary-button auto-width"
                          onClick={saveSelfAssessedPractice}
                          disabled={code.trim().length === 0 || codeSaved}
                        >
                          {codeSaved ? "Självbedömning sparad ✓" : "Jag har jämfört mitt svar"}
                        </button>
                      </>
                    )}
                  </article>
                )}
              </div>
            </section>
          )}
        </article>

        <footer className="topic-book-footer">
          <div className="topic-book-pagination">
            <button
              type="button"
              onClick={() => goToPage(safePageIndex - 1)}
              disabled={safePageIndex === 0}
            >
              ← Föregående
            </button>

            <div className="topic-page-number">
              <label htmlFor="topic-page-input">Sida</label>
              <input
                id="topic-page-input"
                type="number"
                min={1}
                max={maxPages}
                value={safePageIndex + 1}
                onChange={(e) => handlePageInput(e.target.value)}
              />
              <span>/ {maxPages}</span>
            </div>

            <button
              type="button"
              onClick={() => goToPage(safePageIndex + 1)}
              disabled={safePageIndex === maxPages - 1}
            >
              Nästa →
            </button>
          </div>

          <div className={`topic-complete-bar ${isCompleted ? "complete" : ""}`}>
            <div>
              <strong>
                {isCompleted ? "✓ Sidan är markerad som klar" : "Färdig med den här sidan?"}
              </strong>
              <span>
                {isCompleted
                  ? "Du kan avmarkera den om du vill repetera senare."
                  : "Markera sidan som klar när du känner att du kan innehållet."}
              </span>
            </div>

            <button
              type="button"
              className={isCompleted ? "secondary-button" : "primary-button"}
              onClick={toggleCompleted}
            >
              {isCompleted ? "Avmarkera sidan" : "Markera sidan som klar"}
            </button>
          </div>
        </footer>
      </main>
    </section>
  );
}
