# Y//SEC — Yaseen’s portfolio

A buildless portfolio for GitHub Pages, combining a short boot intro, animated packet-network background, selected case studies, a searchable project index, and a keyboard-accessible search palette.

## Preview

From this directory, run `python -m http.server 4173 --bind 127.0.0.1` and open `http://127.0.0.1:4173`.

You can also extract the supplied ZIP and open `index.html` directly. The portfolio uses local scripts and assets; Google Fonts are optional and have system-font fallbacks.

## Content

- `index.html`: public profile, selected work, education, skills, and contact information.
- `data.js`: the original 18 project entries and detailed source descriptions, preserved from the previous portfolio.
- `app.js`: case-study presentation, search, filtering, navigation, intro, and ambient animation.
- `styles.css`: responsive layout, motion settings, and presentation.
- `resume.html`: a print-ready résumé using the same verified background and selected projects. Use its Print / Save as PDF button to export.
- `assets/yaseen-profile.png`: the existing portrait, now stored locally.
- `assets/yaseen-formal.png`: the formal headshot from the supplied source ZIP, used in the résumé.

Search opens from the header or profile card, `Ctrl+K` / `Cmd+K`, or `/`. Use arrow keys and Enter to open results, and Escape to close. The intro plays once per tab session, can be skipped, and can be replayed from the footer. Reduced-motion preferences bypass the intro and pause animation. Motion can also be paused manually.

All case-study statuses are preserved. Planned ideas are separated from built and active work by default. The portfolio does not claim published reports or link to project-specific repositories that were not provided.

## Publish

Publish these files at the root of the existing GitHub Pages source branch. All local resource paths are relative so the site works at `/portfolio.yaseen/`.

Keep the expected training completion date and academic year current in both `index.html` and `resume.html`.
