# v28 verification

Static checks completed:
- Command palette is mounted in App.
- Global search supports Ctrl/Cmd+K and /.
- Shortcut help supports ?.
- Topic shortcuts include S and N in addition to the existing shortcuts.
- Streak and recent-activity components are mounted on Home.
- Study activity and recent activity are included in progress backup.
- New TS/TSX files passed basic delimiter sanity checks.

A full `npm install`, `npm test`, and `npm run build` could not be completed in the generation environment because dependency installation timed out. Run those commands locally after extracting the zip for full runtime/build verification.
