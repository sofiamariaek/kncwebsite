---
name: verify
description: Drive the KC site in a real browser to verify changes end to end (purchase flow, navigation, overlays).
---

# Verify — KC Website

Static site, no build step. Verification = serve it, drive it in a real browser, screenshot.

## Handle

1. Serve from the repo root: `python3 -m http.server 8123 --bind 127.0.0.1` (background).
2. Driver: `npm i playwright-core` in a temp dir, launch with `{ channel: 'chrome', headless: true }` — uses the installed system Chrome, no browser download needed.

## Gotchas

- The header text nav is `display:none` — all navigation goes through `#burger` → drawer `#menu`; expand a group with its `.mhead` button, then click the `data-nav`/`data-mpiece` link.
- Views are JS-switched `.view[data-view=…]` blocks in one page; wait for elements inside the target view and allow ~500–700ms for veil/panel transitions.
- State lives in localStorage: `kc_bag`, `kc_wishlist`, `kc_account`, `kc_orders`. Clear + reload for a fresh run.
- Size panel: `#quickSize` (open = `.open` class), size chips `[data-size]`, confirm `#quickSizeConfirm`, guide link `.quicksize-guide`; toasts render in `.bagtoast`.
- The belt piece page has no UI entry point (belt tile photo is intentionally inert); drive belt behaviour via the composer's accessory tile.

## Flows worth driving

- Home → All Looks (`.campaign-intro a[data-nav="looks"]`) → look card → tile "Add to bag" → size panel → confirm → check `kc_bag`.
- Compose Your Suit (burger → The Equestrian Suit → Compose your suit): garment tiles + belt include-set with/without a coat in the bag.
- Piece page (click a tile photo `.pc[data-piece]`) → `#pieceOrder`.
- "Find your size" from the panel → size guide opens above it.
- Mobile viewport 390×844 — the panel becomes a bottom sheet.

Save screenshots to `.context/verify-shots/` (not tracked by git).
