# KC Website — Project Instructions

## Structure

- `index.html` — the site. Single page; all views (home sections, collection pages, suit page, product pages) live here and are switched by JS.
- `css/styles.css` — all styling, including @font-face (fonts in `assets/fonts/`).
- `js/main.js` — all behaviour: scroll animations, view router (`showView`), looks, wishlist, bag.
- `assets/` — `img/`, `video/`, `fonts/`. Referenced by relative path; the folder must stay next to index.html.
- `source/` — original photography/print files. Not used by the site.
- `archive/` — superseded monofile builds (`_39`, `_40`). Never edit these.

## Multi-agent lanes (always follow)

This repo is edited by multiple AI agents (Claude, Codex) plus Sofia herself.
These rules keep their work from colliding. Follow them without being asked.

| Agent  | Folder                   | Branch prefix |
|--------|--------------------------|---------------|
| Codex  | `~/Documents/KNC_CODEX`  | `codex/*`     |
| Claude | `~/Documents/KNC_CLAUDE` | `claude/*`    |

Both folders are worktrees of the same repository (github.com/sofiamariaek/kncwebsite).
Work only in your own lane's folder. Never check out or edit another agent's branch.

## Branch rules

- `main` is the approved website. **Never commit directly to `main`** — the only
  exceptions are trivial docs/config changes Sofia explicitly asks for.
- Every task gets a fresh branch off the latest `origin/main`, named
  `<agent>/<short-task-name>` (e.g. `claude/navigation-review`).
- One task = one branch = one pull request. Merge happens on GitHub after Sofia
  reviews. Squash-merge is the house style.
- After a PR merges, delete its branch (locally and on GitHub).
- Never force-push. Never rebase a branch that has an open PR.

## Session ritual

1. **Start:** `git fetch origin && git switch -c <agent>/<task> origin/main`
   (or continue your existing task branch if resuming).
2. **During:** commit early and often on the task branch. Short, descriptive
   messages (e.g. "Update hero section in index.html").
3. **End:** push the branch and open/update a PR. Nothing valuable stays
   local-only overnight.

## Auth notes

- Git auth uses a fine-grained GitHub token stored in the macOS Keychain
  (HTTPS + osxkeychain helper). It works from normal shells.
- Sandboxed agent environments cannot reach the Keychain. If push/pull fails
  with an auth error there, commit locally and tell Sofia — she or a Claude Code
  session will push. Do not ask her to paste tokens into chat.

## File rules

- `index.html` is the ONLY live version. Never create versioned copies (no
  `KC-Site-2026_42.html`) — git history is the version system. To see or restore
  an old state, use `git log` / `git checkout <commit> -- index.html`.
- New images/videos: save as real files under `assets/img/` or `assets/video/`
  (lowercase-hyphen names, no spaces), reference by relative path. Never embed
  base64 data URIs.
- Verify changes in the browser before opening a PR.
