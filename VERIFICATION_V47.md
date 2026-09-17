# v47 verification

Static checks passed:
- one shared isQuestionStillMissed() definition
- global wrong-question ids use unresolved-only logic
- unified Missade frågor resolver uses the same logic
- MissedQuestionsPage keeps its queue in state
- restart reloads the queue from current progress

Regression tests cover:
- wrong answer adds question
- later correct answer removes question
- later wrong answer adds it back

Run locally:
npm install
npm test
npm run build
npm run dev
