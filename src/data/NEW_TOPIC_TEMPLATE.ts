import type { StudyTopic } from "./studyTopics";

/**
 * COPY THIS OBJECT into the `studyTopics` array in studyTopics.ts
 * and replace the example values.
 *
 * Add/remove page objects freely. The UI automatically uses pages.length.
 * For a complete lesson, add a StudyLesson in studyLessons*.ts with:
 * - a complete example (label separate files and API prerequisites),
 * - three walkthrough paragraphs: construction, execution, troubleshooting,
 * - two specific single-choice questions with explanations,
 * - two true statements and two plausible misconceptions with an explanation.
 * Connect code/quiz with ...getLessonPageContent(pageId), replacing the inline
 * code/quiz below. Add the conceptual introduction in theoryExplanations.ts.
 * Pages without a StudyLesson keep only their own quiz; no unrelated questions
 * are invented automatically.
 */
export const newTopicTemplate: StudyTopic = {
  slug: "new-topic",
  title: "Nytt ämne",
  summary: "Kort beskrivning som visas i vänstermenyn.",
  pages: [
    {
      id: "new-topic-p1",
      title: "Introduktion",
      intro: "Förklara vad ämnet är och varför det används.",
      bullets: [
        "Första viktiga punkten.",
        "Andra viktiga punkten.",
        "Tredje viktiga punkten."
      ],
      code: `// Kodexempel för just den här sidan
const example = "hej";`,
      quiz: {
        question: "En fråga som bara handlar om innehållet på den här sidan?",
        options: [
          "Rätt svar",
          "Rimligt fel svar",
          "Rimligt fel svar",
          "Rimligt fel svar"
        ],
        // 0 = första alternativet, 1 = andra, 2 = tredje, 3 = fjärde
        answer: 0
      },
      cheat: [
        "Kort regel att minnas.",
        "Viktig syntax.",
        "Vanligt misstag."
      ],
      codeTask: "En liten kodövning som bara tränar det som sidan nyss lärde ut."
    }

    // Lägg till sida 2, 3 osv här om ämnet behöver fler sidor.
  ]
};
