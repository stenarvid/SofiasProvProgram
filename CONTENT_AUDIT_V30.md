# v30 Content Audit

This version performs a content-focused review in addition to the UI/function work from v29.

## Scope checked
- 14 study subjects
- 56 theory pages
- 56 long-form explanations
- 56 page-local quizzes
- page bullet summaries
- page cheat sheets
- page code examples
- page code tasks
- 56 questions in the global quiz bank
- topic naming consistency across theory, quiz and progress

## Important corrections
- Normalized global quiz topics:
  - `Comp` -> `Components`
  - `Router` -> `React Router`
  - `query` -> `React Query`
  - `Typescript` -> `TypeScript`
- Added progress migration so older saved results under those legacy names are merged into the canonical names.
- Clarified React rendering/state wording: state updates can cause render logic to run again; React then commits only necessary DOM changes.
- Clarified that `fetch()` resolves to `Response` even for HTTP errors such as 404/500; `response.ok` must be checked for HTTP success.
- Clarified that `response.json()` is asynchronous and returns a Promise.
- Updated the TanStack React Query v5 status example to use `isPending` / `isError`, while distinguishing background `isFetching`.
- Clarified React Query's role as server-state/cache management rather than the HTTP client itself.
- Clarified Jotai writable atoms and `useAtom`.
- Clarified Zod's runtime-validation role versus TypeScript compile-time/static checking.
- Clarified props as read-only inputs.
- Clarified Hono Context and endpoint terminology.
- Improved the JSX example so it is shown inside a valid component.
- Aligned the state functional-update quiz with the lesson's own recommendation.

## Automated content checks
A new `src/data/contentAudit.test.ts` checks:
- 14 subjects / 56 theory pages
- unique slugs and page IDs
- explanation coverage for every page
- complete page quiz / cheat / code-task data
- four valid options and a valid answer for every page quiz
- canonical topic names in the global quiz
- exactly four global questions per subject
- unique global question IDs and valid answer indexes

## Limits
This audit checks the course content against the package/API style used by this project:
React 18, React Router 7 declarative APIs, TanStack React Query 5, Jotai 2, Zod 3, Hono 4, and TypeScript 5.

The app still simplifies some concepts intentionally for beginner exam preparation, but wording was adjusted where simplification could otherwise be misleading.
