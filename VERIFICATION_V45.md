# v45 verification

Static checks passed:
- /missed-questions route exists
- Home Missade frågor card points to the new route
- Smart next points to the same route
- Home count comes from the same unified resolver as the page
- global questionBank misses are resolved
- page-specific theory misses are resolved
- page-specific multi-select misses are resolved
- retry answers are recorded back into progress

Added missedQuestions.test.ts for global, page-specific, and multi-select cases.

Run locally:
npm install
npm test
npm run build
npm run dev

All internal Missade frågor links now point to /missed-questions.
