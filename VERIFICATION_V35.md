# v35 verification

Static checks passed for:
- Monaco editor in timed Provläge practical tasks
- Monaco editor in FinalExam debug tasks
- Monaco editor in FinalExam programming tasks
- Monaco editor in FinalExam chain task
- all those editors call the shared `configureCourseMonaco()` helper
- TSX model paths are used for code editors

Text inputs are intentionally retained for:
- code-reading short answers
- oral/explanation answers

This keeps Monaco only where actual code is being written.

Run locally:
npm test
npm run build
npm run dev
