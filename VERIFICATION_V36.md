# v36 verification

Static verification passed:
- all 56 study pages have an explicit grading specification
- TopicsPage calls gradePageCode instead of treating non-empty code as 100%
- actual score/pass is stored in CodeProgress
- automated tasks show per-requirement feedback
- explanation tasks use explicit self-assessment instead of fake auto-grading
- dedicated regression tests were added for:
  - the exact React name/JSX exercise shown by the user
  - a wrong React variant
  - Jotai
  - Hono
  - self-assessment routing

Full local verification:
npm test
npm run build
npm run dev
