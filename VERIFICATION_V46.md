# v46 verification

Static checks passed:
- exact review snapshot is stored with question progress
- page-specific quiz writes current question options and correct answers
- global quiz writes current question snapshot
- missed-question resolver prefers saved snapshots
- old progress falls back by id and exact question text
- unresolved legacy misses are never silently hidden

Regression test includes the exact reported React / JSX och rendering / question 3 case.

Run locally:
npm install
npm test
npm run build
npm run dev
