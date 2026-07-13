# Architecture

Loreforge v0.1 is a static client-side application designed for GitHub Pages.

- HTML provides the app shell.
- CSS is split into reset, theme, layout, and component layers.
- JavaScript uses native ES modules.
- `localStorage` holds the active database.
- JSON export/import provides user-owned backups.
- No server, account, or cloud database is required.

Future cloud sync can be added behind the same storage interface.
