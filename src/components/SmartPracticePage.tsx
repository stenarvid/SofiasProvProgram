import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDueQuestionIds, getQuestionProgress } from "../data/questionProgress";
import { questionBank } from "../data/questionBank";
import { getProgress } from "../data/progress";
import { getStudyFlow } from "../data/studyFlow";
import { studyTopics } from "../data/studyTopics";

function choose<T>(items: T[]): T | undefined {
  if (!items.length) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

export default function SmartPracticePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const dueIds = new Set(getDueQuestionIds());
    const dueQuestions = questionBank.filter((item) => dueIds.has(item.id));

    if (dueQuestions.length) {
      navigate("/quiz?mode=review", { replace: true });
      return;
    }

    const questionProgress = getQuestionProgress();
    const wrong = questionBank.filter((question) => {
      const stat = questionProgress[question.id];
      return stat && stat.wrong > 0 && (stat.consecutiveCorrect ?? 0) < 2;
    });

    if (wrong.length) {
      navigate("/missed-questions", { replace: true });
      return;
    }

    const progress = getProgress();
    const trainedTopics = studyTopics
      .map((topic) => {
        const stat = progress[topic.title];
        const attempts = stat ? stat.correct + stat.wrong : 0;
        const accuracy = attempts ? stat.correct / attempts : null;
        return { topic, attempts, accuracy };
      })
      .filter((item) => item.attempts > 0 && item.accuracy !== null)
      .sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1));

    const weakestPool = trainedTopics.slice(0, Math.min(3, trainedTopics.length));
    const weakPick = choose(weakestPool);

    if (weakPick) {
      navigate(`/quiz?topic=${encodeURIComponent(weakPick.topic.title)}`, { replace: true });
      return;
    }

    const flow = getStudyFlow();
    const unfinished = studyTopics.flatMap((topic) =>
      topic.pages
        .map((page, pageIndex) => ({ topic, page, pageIndex }))
        .filter((item) => !flow.completedPageIds.includes(item.page.id))
    );

    const theoryPick = choose(unfinished);

    if (theoryPick) {
      navigate(
        `/topics?topic=${theoryPick.topic.slug}&page=${theoryPick.pageIndex + 1}`,
        { replace: true }
      );
      return;
    }

    navigate("/practice", { replace: true });
  }, [navigate]);

  return (
    <section className="smart-practice-loading">
      <div className="dashboard-panel">
        <span className="topic-badge">Smart träning</span>
        <h2>Väljer nästa övning...</h2>
        <p className="muted">Prioriterar repetition, svaga ämnen och ofärdig teori.</p>
      </div>
    </section>
  );
}
