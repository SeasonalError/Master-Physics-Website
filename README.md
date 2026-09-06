# Physics Atlas

A physics learning website with a rotating topic explorer, a searchable resource library, official university practice links, original worked exercises, and a semester study map.

The first collection includes 28 fields, 114 resource entries, 31 books, 36 paper/problem collections, and 38 original exercises. Resources point to their authors, institutions, publishers, or catalogue records. Some entries share a landing page because it contains both notes and problem sheets.

## Use the site

- Rotate the topic cards with the mouse wheel, left/right buttons, arrow keys, or a horizontal drag. Select a card, then open that field.
- Search by title, author, subject, or institution. Filter by field, resource type, access, or the personal reading list.
- Open a field's Books & learning, Problems & answers, or Topic map views.
- Use the Practice page for source-hosted papers or original exercises. Hints and worked solutions are separate disclosures.
- Scratchpad text stays in memory while navigating within a tab. A reload clears it; it is not uploaded or saved across devices.
- The study paths cover the user's planned physics and supporting mathematics in semesters 3–8, plus a suggested particle-physics route. They are not an official university syllabus.

## Run locally

This is an authored static site, not a framework build. No dependency installation is needed. Serve `dist/` over HTTP using any static server, for example `python -m http.server --directory dist 8000`, then open `http://localhost:8000`. ES modules require HTTP; opening the HTML as a `file:` URL is not supported.

Run `node scripts/validate.mjs` for the source and catalogue checks. Node 20 or later is recommended. The checks validate module syntax, local assets, catalogue relationships, external URL shapes, book/exercise coverage, and solution-label consistency. They do not claim to verify every remote URL or perform browser testing.

## Publish to a new GitHub repository

This is the complete source for [SeasonalError/Master-Physics-Website](https://github.com/SeasonalError/Master-Physics-Website).

1. Create the new repository in your account.
2. Add this source at the repository root, retaining `dist/`, `scripts/`, `package.json`, and `.github/workflows/pages.yml`.
3. In the new repository's Settings → Pages, select **GitHub Actions** as the source.
4. Push to `main` or manually run the **Publish Physics Atlas to GitHub Pages** workflow.

The site uses relative asset paths and hash-based routes, so it works at a project URL such as `/Master-Physics-Website/` without rewrites. The supplied workflow follows the [GitHub Pages custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

The `.openai/hosting.json` in the Sites checkout belongs to that specific hosted Site. It is not needed for GitHub Pages and is excluded from the downloadable source bundle.

## Maintain the content

- `dist/topics.js`: field descriptions, prerequisites, suggested topic order, related fields, and visual accents.
- `dist/resources.js`: the source catalogue, access labels, official-answer links, and personal reading labels.
- `dist/exercises.js`: original questions, hints, worked reasoning, and consistency checks.
- `dist/pathways.js`: semester maps and particle-physics progression.
- `dist/app.js`: rendering, routing, search, filters, the carousel, and exercise interaction.
- `dist/styles.css`: responsive visual system and reduced-motion handling.

Keep IDs unique. Verify the exact course year, source page, and solution availability before adding a resource. Use commercial publisher/catalogue links for copyrighted books unless the author or publisher explicitly provides free reading. Avoid unauthorized textbook mirrors and instructor-only solution manuals.

Resource descriptions and difficulty labels are editorial judgments. The in-site exercises are original AI-assisted study material, not institutional exam solutions. The source page explains access labels and provenance. The initial research date is 6 September 2026; there is no background link monitoring.

## Attribution and terms

Linked books, courses, datasets, and question papers retain their original copyrights and licenses; linking does not relicense them. No third-party book PDFs or exam files are bundled. The interface and original catalogue descriptions are independently authored. Fonts are requested from Google Fonts with system fallbacks. The site does not require an account or an analytics service.

## Validation performed

The initial handoff passed the catalogue and static-source checks. Source collection and solution availability were checked against official pages or source search results. Every individual PDF was not separately inspected. No browser or end-to-end test was run during the initial build.
