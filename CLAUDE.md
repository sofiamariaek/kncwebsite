# KC Website — Project Instructions

## Structure

- `index.html` — the site. Single page; all views (home sections, collection pages, suit page, product pages) live here and are switched by JS.
- `css/styles.css` — all styling, including @font-face (fonts in `assets/fonts/`).
- `js/main.js` — all behaviour: scroll animations, view router (`showView`), looks, wishlist, bag.
- `assets/` — `img/`, `video/`, `fonts/`. Referenced by relative path; the folder must stay next to index.html.
- `source/` — original photography/print files. Not used by the site.
- `archive/` — superseded monofile builds (`_39`, `_40`). Never edit these.
- `tests/` — Playwright smoke tests (see Tests below).

## Tests (run before every PR)

`npm install` once per clone, then `npx playwright test`. The suite serves
the site locally and runs every test on two viewports: desktop Chromium and
an emulated iPhone (WebKit). It checks that the page loads with no JS errors
or broken asset paths, and walks the real journeys: menu navigation, looks
grid, composer, add-to-bag, checkout, wishlist, size guide. Takes ~20s.

If your change makes a test fail, fix the change — or, if the feature
intentionally changed, update the test in the same PR. Never delete or skip
a test to get to green.

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

## House language — the keyword system

The canonical vocabulary (from KCKeywordSystem.pdf). Every page, product,
image and profile speaks these words exactly; alternating forms teaches
the engines nothing. Sprinkle inside true sentences, never stuff.

**One canonical form:** it is always *equestrian suit*. Never "riding suit",
"riding wear", "show outfit", "equestrian-inspired", "the equestrian look".
No hype ("must-have", "game-changing", "revolutionary"), no exclamation
marks, no dangled scarcity ("only three left"). Scarcity is stated as fact.

**Brand-owned:** Kiwi & Colibri (always written in full — never K&C in
visible copy) · Colibri Crêpe · Kür · Tar · Moss · Sandstone.

**Head terms:** equestrian fashion · equestrian suit · competition suit ·
luxury equestrian apparel · dressage apparel · show jumping apparel ·
equestrian aesthetic (only on our terms — as *the new equestrian aesthetic*).

**Mid-tier:** equestrian fashion house · luxury equestrian suit ·
competition equestrian suit · limited edition equestrian suit.
Data layer only (metafields/tags, not prose): technical equestrian apparel.
Press/social only, not the site: quiet luxury equestrian.

**Long-tail:** luxury equestrian fashion house · Scandinavian luxury
equestrian brand (data layer only — "brand" is off-voice in prose) ·
atelier-made equestrian suit · equestrian craftsmanship ·
competition-proven equestrian apparel · luxury equestrian capsule wardrobe ·
the new equestrian aesthetic. (Cut: "versatile luxury equestrian suit" —
its idea lives in the capsule wardrobe phrase.)

**The identity phrase, split by surface:** prose says
"an equestrian fashion house" (luxury is demonstrated, not declared);
machine surfaces (meta title, boilerplate, bios) carry the full
"Luxury Equestrian Fashion House".

**Naming, three tiers (law):** the family is *The Equestrian Suit*; a set
is "{Style} Equestrian Suit — {Colourway}" (e.g. Tailcoat Equestrian Suit —
Sandstone); a piece is its plain name (Tailcoat, Corset, Cargo breeches).

**Templates:** SEO title: "{Name} Equestrian Suit in {Colourway} — Limited
Edition | Kiwi & Colibri". Meta description (<155 chars): "The {Name}
equestrian suit in {Colourway}. Cut in Colibri Crêpe, atelier-made in
Northern Italy, competition-proven. One of two hundred." Image alt:
"{Name} equestrian suit in {Colourway}, {context}". Press boilerplate:
"Kiwi & Colibri is a Scandinavian luxury equestrian fashion house. Its
equestrian suits — cut in the house's own Colibri Crêpe and atelier-made
in Northern Italy — are ridden in dressage and show jumping competition.
Two hundred suits. No more."
