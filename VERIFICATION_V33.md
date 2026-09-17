# v33 – exercise/editor consistency fix

This version fixes the exact issue visible in the screenshot.

## Fixed
- React page 1 now asks for `Hello` returning `<h1>Hej!</h1>`, matching the concept/code example shown directly above it.
- The page-specific Monaco editor now uses a `.tsx` model path.
- Monaco's TypeScript compiler options explicitly enable `ReactJSX`.
- Minimal React/JSX typings are injected for page-specific exercises, matching the main code-practice editor setup.
- The editor now tells the user that TypeScript/TSX and React JSX are supported.
- Added a regression test to make sure the first React exercise cannot silently drift away from its example again.

## Audit
- All 56 theory pages still have a non-empty codeTask.
- Static checks confirm the TSX configuration and React task alignment.

Run locally:
npm test
npm run build
