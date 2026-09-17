# v31 verification

Static checks passed for:
- optional sound settings and Web Audio feedback
- correct/wrong/success feedback events
- celebration effects
- daily-goal achievement feedback
- oral exam mode
- explain-code mode
- output-prediction mode
- mistake notebook
- exam checklist
- concept map
- focus mode + F shortcut
- side-by-side code comparison
- PWA manifest/service worker
- backup keys for new persistent settings/data
- new routes and hub links

The generated files passed basic delimiter sanity checks.

For full runtime verification after extraction, run:
npm install
npm test
npm run build
npm run dev

The service worker is intentionally registered only in the production build.
