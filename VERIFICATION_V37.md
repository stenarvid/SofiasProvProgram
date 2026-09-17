# v37 verification

Static checks passed for:
- latest code persistence
- best-code persistence
- page-specific code attempts saving source code
- main practice attempts saving source code
- new CodeLibraryPage route
- topic-specific code library UI
- reopening saved code in the theory-page editor
- saved-code view in CodeProgress
- React composition example aligned with Header + Footer

New tests cover:
- latest code storage
- best code storage
- backward compatibility with older progress entries
- clearing code progress

Run locally:
npm install
npm test
npm run build
npm run dev
