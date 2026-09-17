# Page-by-page teaching review — 2026-09-17

Reviewed all 56 pages across 14 subjects: title, intro, theory, bullets, worked
code, three walkthrough paragraphs, two single-choice questions, the multi-select
question, its four statements, explanations, assignment and grading approach.
The 112 applied questions in the global bank reuse these same worked lessons.

Every page now has a specific goal, prerequisite links, a rewritten assignment
with scope/setup, and two checks for the expected result. The same task text is
used by the page and the review metadata, avoiding competing instructions.
Every subject also has a short basics section, open initially on its first page.

The review checks teaching alignment with the app's selected subjects. It does
not certify coverage or difficulty against an unseen teacher's exam. No syllabus
or sample exam was supplied during this review.

## Page-by-page findings and changes

“Aligned” below means the two single-choice answers, true/false statements and
their explanations are supported by the lesson/example. It does not mean every
possible student solution is fully checked by the automatic grader.

| Page | Lesson/question focus checked | Assignment clarification or correction |
| --- | --- | --- |
| react-p1 | Component definition versus use; Hello output — aligned | Only Hello is required; App is shown as setup. |
| react-p2 | JSX expressions, name and length — aligned | Specifies variable, component and p; check by changing name. |
| react-p3 | Order of composition and fragments — aligned | Define Header/Footer as well as use them in App. |
| react-p4 | Function reference versus immediate event call — aligned | Title now names events; task explicitly includes handleClick and App. |
| state-p1 | Initial false, toggle and state persistence — aligned | Specifies hook placement, Panel and expected boolean transition. |
| state-p2 | Initial 5, setter and render snapshot — aligned | Gives expected sequence 5 → 6 → 7. |
| state-p3 | Queued updaters versus captured count — aligned | Both updates must be in the same click handler; expected 2 then 4. |
| state-p4 | Controlled field, event value and shared presentation — aligned | Requires input and p; gives the Sofia check. |
| state-p5 | Mutation, click callback and derived state — aligned | Adds doubled to match the first question; negative values allowed. |
| components-p1 | Reuse with independent props — aligned | Links props prerequisites and specifies two ProductCard instances. |
| components-p2 | Default import/export and file boundaries — aligned | Two explicit file sections; guided assessment avoids single-file diagnostics. |
| components-p3 | Responsibility and actual component use — aligned | Specifies all three definitions, content and order in App. |
| router-p1 | path/element and router context — aligned | Defines both views and the one-router assumption. |
| router-p2 | to versus path and matching routes — aligned | Includes destination views; links alone are not enough. |
| router-p3 | String params and dynamic matching — aligned | Title names useParams; task now requires Product to read/display id. |
| router-p4 | Correct route props and missing context — aligned | Explicitly asks for one fixed line with surroundings assumed. |
| fetch-p1 | Promise/Response and console output — aligned | Defines API assumption and requires invocation with success/error handling. |
| fetch-p2 | HTTP failure and JSON parsing — aligned | Specifies JSON success body and excludes empty 204 from parsing. |
| fetch-p3 | Body serialization versus headers — aligned | Defines POST payload, headers, error handling and expected JSON response. |
| fetch-p4 | Loading finalization and setUsers — aligned | Specifies click trigger, User shape, list, loading and errors. |
| fetch-p5 | Method reference and non-JSON response — aligned | One return-line correction; accepts return with or without await here. |
| query-p1 | QueryClient/provider versus fetch — aligned | Clearly states getUsers and provider are supplied setup. |
| query-p2 | Cache identity, queryFn and variable dependencies — aligned | Supplies getProducts contract and distinguishes it from JSX key. |
| query-p3 | Pending/error versus fetching — aligned | Three initial states plus background fetching; explains v5 isLoading. |
| query-p4 | Shared client cache and staleTime — aligned | Text task explicitly asks about both components and local-state contrast. |
| jotai-p1 | Stable atom identity and initial value — aligned | Only atom/import required; bullets corrected to definition plus store. |
| jotai-p2 | Shared store and toggling — aligned | Specifies dark/light, expected two-click result and no CSS requirement. |
| jotai-p3 | Local isOpen versus shared theme — aligned | Concrete prop-drilling scenario and a case where props suffice. |
| zod-p1 | Runtime validation versus static type — aligned | Schema scope explicit; string/number examples and empty-string caveat. |
| zod-p2 | Field length and email-format limits — aligned | Password-only task, 7/8/9-letter boundary checks; email is comparison. |
| zod-p3 | safeParse branches versus parse throwing — aligned | Supplies schema/input and both branches; parse is comparison only. |
| zod-p4 | Early return and validated data before POST — aligned | Explicit handler inputs/rules/endpoint; guided behavioral checks replace token matching. |
| forms-p1 | onSubmit and preventDefault — aligned | Specifies typed handler and feedback; no API required. |
| forms-p2 | Controlled field and fallback greeting — aligned | Concrete empty/Sofia expectations and label connection. |
| forms-p3 | Browser validation, early return and HTTP status — aligned | Specifies exact rules and feedback; guided checks for no invalid request. |
| forms-p4 | Missing onChange and button types — aligned | One corrected input line; name and setName are explicitly provided. |
| props-p1 | Parent input, destructuring and reuse — aligned | Name type, greeting and two calls specified; prerequisites linked. |
| props-p2 | Numeric JSX prop and optional default — aligned | Adds optional description to task to match questions; explains optional usage versus required type declaration. |
| props-p3 | State owner and callback prop — aligned | Text task follows the actual App/Counter click sequence. |
| databinding-p1 | Shared city and event-to-state — aligned | Specifies Stockholm and the result paragraph. |
| databinding-p2 | Text value versus checkbox checked — aligned | Text input is required; checkbox explicitly comparison material. |
| databinding-p3 | Same state, programmatic update and render order — aligned | Adds the Sofia button that the first question asks about. |
| typescript-p1 | Basic annotation, function contract and runtime limits — aligned | Title names basic types; variables required and function supplies context. |
| typescript-p2 | Typed arrays, map, push and const — aligned | Requires doubled to exercise the transformation asked in the quiz. |
| typescript-p3 | Required/optional object fields and nullish fallback — aligned | Specifies all types, an actual Product and fallback expression. |
| typescript-p4 | Exact Role union and return annotation — aligned | Adds describeRole to match title and second question; updates walkthrough. |
| typescript-p5 | Repairing types and narrowing unknown — aligned | Adds lengthOf exercise so narrowing is practised, not only quizzed. |
| hono-p1 | App, route registration and runtime — aligned | App/import/export scope clear; does not claim export starts a port. |
| hono-p2 | Returned JSON and return in handler — aligned | Gives exact method/path/message and expected 200. |
| hono-p3 | JSON parsing versus data validation — aligned | Specifies 400 error paths and 200 acknowledgement without storage. |
| hono-p4 | Creation status, missing resource and memory storage — aligned | Specifies supplied array/id counter; GET is a status comparison. |
| hono-p5 | Matching method/path and separate environments — aligned | Explicit client/server sections, payload and connectivity assumptions; guided assessment. |
| server-p1 | Environment boundary and console request — aligned | Removes request to explain an absent button; follows actual console example. |
| server-p2 | Request method, metadata and JSON body — aligned | Concrete name/URL and text-answer format; no fetch implementation required. |
| server-p3 | Response status versus JSON and ok — aligned | Explicit mappings plus true/true/false; text answer, not code. |
| server-p4 | Click → HTTP → state → list — aligned | Explicit end-to-end steps and error/finally path. |

## Basics and study order

The new subject primers explain the syntax used in the examples: functions,
return, callbacks, destructuring, JSX expressions, hooks, snapshots, ternaries,
boolean conditions, immutable updates, imports, props, promises, async/await,
JSON, errors, arrays/map/key, query providers and cache, atom stores, schemas,
form validation, object types, optional fields, unions, unknown and HTTP.

A beginner can follow this order, using page prerequisite links when needed:

1. React 1–4 and TypeScript 1–5.
2. State 1–5, Props 1–3 and Components 1–3.
3. Databindning 1–3 and React Router 1–4.
4. Server 1–3, then Fetch 1–5.
5. Forms 1–4, then Zod 1–4.
6. React Query 1–4 and Jotai 1–3.
7. Hono 1–5, then Server 4 to connect the whole flow.

To check understanding, explain the goal without notes, write the assignment
without copying, change one input, and predict both a successful and a failing
case. Quiz recognition alone does not establish practical mastery.

## Assessment boundaries

- Pattern/structure checks on many pages still do not fully execute or type-check
  every student answer. The two visible result checks on each page are part of
  practice, even if the automatic checks pass.
- components-p2 and hono-p5 are multi-file guided tasks. zod-p4 and forms-p3 are
  now guided tasks because the old patterns could not prove correct validation
  order or prevention of invalid requests. Code self-assessment retains Monaco;
  multi-file answers use labelled text sections to avoid treating them as one file.
- Existing saved scores were not cleared or reinterpreted. Previously completing
  a page does not prove the learner has done its expanded assignment.
- The app's selected basics do not cover every possible exam area. In particular,
  it has no dedicated full lesson sequence for useEffect/cleanup, advanced Query
  mutations/invalidation, nested router layouts, authentication or databases.
  Compare those areas with the teacher's syllabus before treating coverage as complete.

## Verification

- 168 tests across 17 files passed after the independent-practice follow-up below.
- All 56 worked examples type-check against the installed packages with file
  boundaries respected by the existing example test.
- Page and global applied-question mappings preserve correct answers and explanations.
- New checks cover guidance on every page, basics for every subject, prerequisite
  link targets and cycles, the preparation UI, and rejection of false automatic passes.
- TypeScript project check passed. A manual browser walkthrough of all 56 pages
  was not performed; content inspection and automated checks were used.
- Production build passed in a separate temporary output directory. Vite still
  reports the existing large JavaScript bundle warning; this review did not
  change the app's bundling strategy.

## Training-session follow-up

- All 15 activity modes under Träna now use finite rounds, subject selection and
  an explicit restart: code exercises, completion, mini-projects, chains, debug,
  quick errors, code reading, code explanations, output prediction, TypeScript
  errors, flashcards, matching, explanations, HTTP and the server simulator.
- Each item is shown at most once in a round, including when switching subjects.
  Cross-topic projects count as the same item regardless of the selected subject.
  A round lasts for the current page visit; restarting or returning to the page
  begins a new round. The completion message means all items were shown, not that
  every answer was correct or every practical task was passed.
- A new round keeps the selected subject and clears answer/editor/reveal state.
  Code exercises retain the chosen difficulty between tasks.
- Matching now presents one concept at a time with shuffled explanation choices.
  The simulator walks through its three existing response examples.
- The concept map and mistake notebook have subject filters. The code library
  retains its existing subject tabs and saved-code browsing.
- Nineteen new regression tests cover all activity endings and restarts, subject
  switching without repeats, editor reset, difficulty retention and map filtering.
  Production build and TypeScript checks passed; browser layout was not manually tested.

## Training coverage follow-up

- Quick errors previously had four questions spanning only four subjects. It now
  has 116 questions: the original four plus two authored lesson misconceptions
  per page across all 56 pages and 14 subjects. New questions explicitly ask which
  statement is false; their code is a correct reference example, not broken code.
- Code reading has 116 questions, including the two existing applied questions
  from every lesson with their code, correct answers and explanations preserved.
- Code explanations now have 62 tasks, explanations have 120 prompts and flashcards
  have 122 cards. All three modes cover every lesson and subject. This reuses the
  reviewed lesson material; these are not additional independent exam questions.
- Lesson-derived tasks identify and link to their source page. Flashcard questions
  that refer to code show that code before the learner turns the card over.
- Subject coverage, page mapping, answer preservation, selected-answer highlighting,
  and finite rounds are covered by automated checks. Specialized modes such as
  HTTP and TypeScript errors retain their narrower subject scope.

## Independent-practice follow-up

- All 56 lesson assignments now include a required application beyond the worked
  example. Examples remain unchanged teaching material. New requirements include
  reset/fill buttons, additional routes, related fetch calls, an extra schema
  field, derived values, and explanations applied to a new scenario.
- All 44 automatic lesson graders require the application check as well as their
  original checks. Regression tests verify that every unchanged worked example
  fails the complete assignment, while still satisfying the original base checks.
- Added positive examples cover state, JSX, routing, fetch, query keys, Jotai,
  schemas, TypeScript and Hono. Commented-out code and string examples do not
  satisfy the application check. Clipboard use remains available: learners can
  use the example as a starting point and then make the requested changes.
- These are structural checks on parsed code nodes, not full behavioral tests.
  Except for Hello's existing rendering checks, executing the requested behaviors
  and checking the stated results remains part of the learner's assignment.
  The 12 self-assessed pages retain self-assessment with extended criteria.
- Existing scores and saved code were preserved, not regraded against the new
  requirements. Prior 100% scores do not certify the new application task.

## Reference checks

Version-sensitive explanations were checked against the installed package versions
and official documentation:

- [React state and interactivity](https://react.dev/learn/adding-interactivity)
- [React useState](https://react.dev/reference/react/useState)
- [TanStack Query v5](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5)
- [Zod 3](https://v3.zod.dev/)
- [Hono app and in-process requests](https://hono.dev/docs/api/hono)
- [Hono request body](https://hono.dev/docs/api/request)
