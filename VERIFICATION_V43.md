# v43 verification

Static checks passed:
- Home uses getWrongQuestionCountFrom(questionBank ids)
- Quiz wrong mode uses getWrongQuestionIdsFrom(questionBank ids)
- both surfaces therefore agree on the same resolvable question set
- page-specific theory quiz progress is preserved but no longer falsely advertised as a global missed-question item

Added questionProgress regression tests for the mismatch shown in the screenshots.

Run locally:
npm install
npm test
npm run build
npm run dev
