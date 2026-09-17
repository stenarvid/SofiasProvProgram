# v34 verification

## Fixed
The browser-based Monaco TypeScript worker does not automatically load the real
node_modules declarations. v34 now injects a shared course type surface into both:
- the page-specific editor under `Lär dig`
- the main code-practice editor

Covered modules:
- react / react-jsx-runtime
- react-router-dom
- @tanstack/react-query
- jotai
- zod
- hono

Normal TypeScript syntax and semantic diagnostics remain enabled. The solution does
not disable errors globally; it only supplies the missing library declarations needed
by the course exercises.

## Checks performed
- Static presence checks passed for all library declarations and key APIs.
- Both editors call the same `configureCourseMonaco()` helper.
- Both editors use TSX model paths where appropriate.
- `monacoCourseTypes.ts` was syntax/type checked standalone with TypeScript 5.8.3.
- Added a regression test to contentAudit.test.ts for the supported Monaco modules.

Run locally for full project verification:
npm test
npm run build
