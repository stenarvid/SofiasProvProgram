# Verification notes

This version received an additional reliability pass focused on the automatic code grader and stored progress.

Checked/fixed:

- Counter grading runs behaviorally and accepts functional updater syntax.
- Counter grading follows a real 0 -> 1 -> 2 sequence and tolerates unrelated static numbers in the same button.
- Props grading renders two randomized prop values to prevent hardcoded answers.
- Props type check supports a direct `string` and local aliases such as `type Name = string`, while an optional `name?` does not receive full credit.
- Controlled input grading simulates two different values and checks that the UI follows both values.
- Fetch grading checks the exact `/api/users` endpoint, JSON parsing/return, and a separate 500-response where an error must be thrown.
- Zod grading checks valid input, short name, malformed email, and missing email.
- Hono grading checks GET `/api/hello`, status 200, exact `message: "Hej!"`, wrong HTTP method, and wrong path.
- Quiz answers are shuffled while preserving the correct answer index.
- All 56 quiz question IDs are unique and answer indexes are in range.
- All six practical exercises have a matching automatic grader.
- All local imports resolve to files in the project.
- Navigation links correspond to defined routes.
- Topic, question, test history, and code progress storage keys are included in backup/export.
- TypeScript syntax/local identifier check on the grader reported only missing external packages when dependencies were not installed in the verification environment.

Automated Vitest cases are included in `src/data/codeGrader.test.ts` for correct and intentionally incorrect solutions. Package installation timed out in the artifact environment, so those dependency-based tests could not be executed here. They can be run locally after `npm install` with `npm test`.
