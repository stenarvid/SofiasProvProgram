import { questionBank } from "./questionBank";
import { getQuestionProgress, isQuestionStillMissed } from "./questionProgress";
import { getStudyPageQuizQuestions } from "./studyPageQuiz";
import { studyTopics } from "./studyTopics";

export type MissedQuestion = {
  id: string;
  topic: string;
  pageTitle?: string;
  source: "global" | "page";
  type: "single" | "multi";
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  wrongCount: number;
  seenCount: number;
};

type ResolvedDefinition = Omit<MissedQuestion, "wrongCount" | "seenCount">;

function buildDefinitionIndexes() {
  const byId = new Map<string, ResolvedDefinition>();
  const byQuestion = new Map<string, ResolvedDefinition>();

  for (const question of questionBank) {
    const definition: ResolvedDefinition = {
      id: question.id,
      topic: question.topic,
      source: "global",
      type: "single",
      question: question.question,
      options: question.options,
      correctAnswers: [question.answer],
      explanation: question.explanation
    };

    byId.set(question.id, definition);
    byQuestion.set(`${question.topic}\0${question.question.trim()}`, definition);
  }

  for (const topic of studyTopics) {
    for (const page of topic.pages) {
      const questions = getStudyPageQuizQuestions(page, topic, studyTopics);

      questions.forEach((question, index) => {
        const id = `theory-${page.id}-q${index + 1}`;
        const definition: ResolvedDefinition = {
          id,
          topic: topic.title,
          pageTitle: page.title,
          source: "page",
          type: question.type,
          question: question.question,
          options: question.options,
          correctAnswers: question.correctAnswers,
          explanation: question.explanation
        };

        byId.set(id, definition);
        byQuestion.set(`${topic.title}\0${question.question.trim()}`, definition);
        // Older progress sometimes has only the former generated question text.
        // Map it to the current question for that page; exact snapshots above
        // remain authoritative when the original answer choices were saved.
        if (index === 1) {
          byQuestion.set(`${topic.title}\0Vilka påståenden hör till "${page.title}"? Välj alla rätt.`, definition);
        } else if (index === 2) {
          byQuestion.set(`${topic.title}\0Vilket påstående sammanfattar bäst en viktig regel från "${page.title}"?`, definition);
        }
      });
    }
  }

  return { byId, byQuestion };
}

export function getAllMissedQuestions(): MissedQuestion[] {
  const progress = getQuestionProgress();
  const { byId, byQuestion } = buildDefinitionIndexes();
  const resolved: MissedQuestion[] = [];

  for (const stat of Object.values(progress)) {
    if (!isQuestionStillMissed(stat)) continue;

    if (stat.reviewSnapshot) {
      resolved.push({
        id: stat.questionId,
        topic: stat.topic,
        pageTitle: stat.reviewSnapshot.pageTitle,
        source: stat.reviewSnapshot.source,
        type: stat.reviewSnapshot.type,
        question: stat.question,
        options: stat.reviewSnapshot.options,
        correctAnswers: stat.reviewSnapshot.correctAnswers,
        explanation: stat.reviewSnapshot.explanation,
        wrongCount: stat.wrong,
        seenCount: stat.seen
      });
      continue;
    }

    // Backward compatibility for old saved progress:
    // first resolve by id, then by exact stored question text.
    const fallback =
      byId.get(stat.questionId) ??
      byQuestion.get(`${stat.topic}\0${stat.question.trim()}`);

    if (fallback) {
      resolved.push({
        ...fallback,
        // Keep the historical id so further attempts update the same progress entry.
        id: stat.questionId,
        wrongCount: stat.wrong,
        seenCount: stat.seen
      });
      continue;
    }

    // Last-resort visibility: never silently hide a missed question.
    // Old data without answer choices still appears, so the learner can see what was missed.
    resolved.push({
      id: stat.questionId,
      topic: stat.topic,
      source: stat.questionId.startsWith("theory-") ? "page" : "global",
      type: "single",
      question: stat.question,
      options: [],
      correctAnswers: [],
      explanation: "Den här äldre frågan saknar sparade svarsalternativ. Gör om frågan från dess ursprungssida för att uppdatera den.",
      wrongCount: stat.wrong,
      seenCount: stat.seen
    });
  }

  return resolved.sort((a, b) => {
    const aRate = a.wrongCount / Math.max(1, a.seenCount);
    const bRate = b.wrongCount / Math.max(1, b.seenCount);
    return bRate - aRate || b.wrongCount - a.wrongCount || a.topic.localeCompare(b.topic);
  });
}

export function getAllMissedQuestionCount() {
  return getAllMissedQuestions().length;
}
