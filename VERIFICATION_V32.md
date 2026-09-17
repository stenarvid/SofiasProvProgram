# v32 verification

Fixes based on the user's real local test/build output:

- Fixed `MistakeNotebookPage.tsx`: `QuestionProgress` uses `questionId`, not `id`.
- Added `src/vite-env.d.ts` so `import.meta.env.PROD` is typed by Vite.
- Expanded every study-page cheat sheet to satisfy the audit requirement of at least 3 entries.
- Expanded the TypeScript union page to at least 3 bullet items.
- Expanded global quiz question q048's explanation beyond the audit threshold.
- Configured `IS_REACT_ACT_ENVIRONMENT` in the grader tests to remove the React act-environment warning.

Static audit checks passed for:
- 14 subjects
- 56 unique theory pages
- 56 matching long-form explanation entries
- 56 unique global quiz questions
- exactly 4 global questions per subject
- canonical topic names
- minimum bullet/cheat counts
- four unique answer options in page quizzes
- global quiz explanation length
- the reported TypeScript property/type errors

The generation environment could not complete `npm install` within the available timeout, so the final authoritative runtime check should still be run locally with:

npm test
npm run build
