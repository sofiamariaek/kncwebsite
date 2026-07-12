# KC Website — Project Instructions

## Structure

- `index.html` — the site. Single page; all views (home sections, collection pages, suit page, product pages) live here and are switched by JS.
- `css/styles.css` — all styling, including @font-face (fonts in `assets/fonts/`).
- `js/main.js` — all behaviour: scroll animations, view router (`showView`), looks, wishlist, bag.
- `assets/` — `img/`, `video/`, `fonts/`. Referenced by relative path; the folder must stay next to index.html.
- `source/` — original photography/print files. Not used by the site.
- `archive/` — superseded monofile builds (`_39`, `_40`). Never edit these.

## Working rules (always follow)

- This folder is the `kncwebsite` git repository (github.com/sofiamariaek/kncwebsite).
- START of every session: run `git pull` before any edits.
- Whenever a file is created or edited, commit and push to GitHub in the same session. Never leave edits uncommitted.
- Short, descriptive commit messages (e.g. "Update hero section in index.html").
- `index.html` is the ONLY live version. Never create versioned copies (no `KC-Site-2026_42.html`) — git history is the version system. To see or restore an old state, use `git log` / `git checkout <commit> -- index.html`.
- New images/videos: save as real files under `assets/img/` or `assets/video/` (lowercase-hyphen names, no spaces), reference by relative path. Never embed base64 data URIs.
- Big or risky changes: do them on a branch (`git switch -c <name>`), verify in the browser, then merge to `main`.
