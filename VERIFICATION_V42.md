# v42 verification

Static checks passed:
- grading captures exact current page id
- stale async grading is discarded after navigation
- grading result is rendered only for matching page id
- theory Monaco editor is keyed by page id
- React p4 Profile regression tests exist
- Monaco fixedOverflowWidgets is enabled
- editor shells allow overflow
- suggest/hover/parameter widgets get elevated z-index

Automated tests were updated to assert fixedOverflowWidgets=true.

Run locally:
npm install
npm test
npm run build
npm run dev
