# Learning accuracy review — 2026-09-17

The subsequent [page-by-page review](PAGE_BY_PAGE_REVIEW.md) covers all 56 pages
and records the latest assignment, prerequisite and assessment changes.

This was a targeted review of lesson explanations, the foundation question bank,
selected worked lessons, practice pages, grading, and review feedback. It is not
a certification of every statement or of coverage of the actual school exam.

## Confirmed issues addressed

| Issue | Learning impact | Change |
| --- | --- | --- |
| TypeScript correction grader checked syntax and absence of `any`, not types or completion | Empty code and the original incorrect declarations could receive 100% | Uses guided self-assessment with the TypeScript editor retained; no automatic pass |
| HTTP status exercise only searched for 200, 201 and 404 | Incorrect mappings of codes to situations could receive 100% | Uses explicit self-assessment guidance for each mapping |
| React theory required JSX and a shared parent element for every component return | Incorrectly rules out text, numbers, arrays and null | Explains React nodes and the distinction between adjacent JSX and arrays |
| Output prediction called useState at module scope | The displayed snippet would violate the Rules of Hooks | Places the hook inside a component and specifies the first render |
| Fetch output depended on an unspecified response and exact prose matching | A valid explanation could be marked wrong | Specifies HTTP 404 and grades the concrete boolean output |
| Output answers remained editable after grading | Feedback could change without a new submission | Locks the answer until the next question |
| Router and Zod completion tasks omitted necessary definitions/imports | Completing only the TODOs still left broken examples | Adds router context, About and imports; fetch solution also handles HTTP errors |
| Readiness required two correct answers while missed questions cleared after one | Could recommend a practice list that no longer contained the question | Uses the shared missed-question predicate |
| HTTP questions implied every crash returns 500 and creation uniquely means POST | Ambiguous scenarios | Specifies a server that can respond and a collection API where the server chooses the id |

## Remaining limitations

- Most lesson code graders still inspect patterns rather than executing behavior
  or performing full type checking. A passing score is limited evidence.
  The later page-by-page review moved the unreliable form-validation and
  multi-file checks to guided self-assessment, with explicit result checks.
- Many foundation questions have obviously unrelated distractors. They test
  recognition more than the ability to implement or explain a solution. The
  applied questions, code exercises and explanations provide stronger practice.
- No teacher syllabus or sample exam was provided, so topic coverage and exam
  difficulty have not been verified against the actual test.

## Verification

- Latest verification: 78 tests passed across 14 files, including grading,
  question-context, prerequisite and UI regressions; production build passed.
- TypeScript project check passed.
- Existing tests type-check the 56 main worked lesson examples against installed
  libraries; this does not establish that every explanation is factually correct.
- No manual browser walkthrough was performed in this review.

## Follow-up fixes

- The password grader now checks the actual password property in `z.object`
  and its own `z.string().min(8)` chain. A length rule on another field or code
  inside a string no longer satisfies the check. Quoted property names work too.
- The Role grader checks the complete union, rejecting extra roles and `string`.
  Reversed order and parenthesized union syntax are accepted.
- The functional-update exercise accepts parenthesized and typed callback
  parameters and a block with a return statement. It checks that the returned
  increment uses the callback parameter rather than the captured count.
- Smart Practice uses the same missed-question list as the destination page.
  It includes lesson misses and no longer routes a corrected question to an
  empty list. Historical entries without answer options do not trigger practice.
- These are targeted structural checks, not full execution or type validation
  of submitted programs. The remaining grading limitations above still apply.

## Question-context follow-up

- Lesson quizzes now display their example next to the question and save the
  example in new review snapshots. Missed-question practice displays and retains
  that exact code, even after another incorrect answer. Older snapshots that
  never stored code remain unchanged; retry the original lesson to update them.
- Code-reading prompts specify rendering in the component tree, TypeScript
  checking, and successful fetching with valid JSON instead of ambiguous wording.
- The state example in Explain Code now places useState inside a component and
  its update inside a click handler, with an explanation tied to that example.
- Flashcards use the existing Fisher–Yates shuffle instead of a random sort comparator.

## References

- [React: valid render results](https://react.dev/reference/react/Component#render)
- [React: Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [MDN: using fetch and handling HTTP errors](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [HTTP semantics: POST, PUT and status codes](https://www.rfc-editor.org/rfc/rfc9110.html)
