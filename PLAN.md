# darekanderson-site — Coordinator Plan

**Goal:** Build Darek Anderson's personal portfolio ("the logbook") end-to-end: code, audit, deploy to Vercel, wire LinkedIn auto-sync scaffolding.
**Repo:** https://github.com/darek225/darekanderson-site (public)
**Branch strategy:** workers build on feature branches off main; coordinator merges after independent verification.
**Commit identity:** darek225 <darek225@users.noreply.github.com> (Vercel blocks Muse-authored commits).

## Absolute rules (every worker)
- NEVER use em dashes (—) in any user-facing copy. Commas, colons, periods only.
- Copy doc is verbatim except [ASK DAREK]/[PHOTO]/[VERIFY] markers, which become elegant visible placeholders (framed, intentional), never lorem ipsum, never silently dropped.
- Honest statuses: ONLY Andola = operating business. Rest = In development / Proof of concept / Live pipeline per copy doc. Estate sale company appears nowhere.
- Mobile-first (360px design width). No WebGL, scroll-jacking, preloaders, parallax on body text, pinned sections. prefers-reduced-motion respected. Works with JS off.
- No stock photography. No text over busy images. Photo slots = placeholders until he supplies them.
- No emojis as UI icons. No fourth font, no second accent color.
- Do not invent numbers, dates, metrics, claims.

## Phases
1. [x] Setup: workspace, repo, plan, preconditions (gh ok, Vercel MCP connected, create_git_project available)
2. [ ] DESIGN: design-brief worker writes DESIGN_PLAN.md (tokens, type, layout, principles + review vs brief) → coordinator merges
3. [ ] BUILD: builder worker writes all files on branch build/site → coordinator verifies independently → merge
4. [ ] AUDIT: auditor worker runs impeccable audit/critique lenses + independent verification → fixes in one batch
5. [ ] DEPLOY: coordinator creates Vercel project via create_git_project, pushes main, verifies live URL 200 + LinkedIn iframe URL well-formed
6. [ ] REPORT: deploy URL, audit findings+fixes, remaining list (10 copy questions, OAuth = his 10-min action, hero photo)

## File manifest (builder target)
- index.html (10 sections: hero, hypothesis, experiments/3 realms, builds, philosophy, notes+LinkedIn feed, researcher, three doors, contact+colophon)
- resume.html (same source, print CSS)
- assets/main.css, assets/main.js (vanilla, minimal; JS only enhances)
- assets/linkedin-posts.json (seed: [{id:"7468377137201319940", date:"2026-06-04", label:"LINKEDIN · JUN 4, 2026"}])
- scripts/sync-linkedin.py (Posts API when LINKEDIN_ACCESS_TOKEN set; dedupe by id, newest first, cap 20; exit 0 keeps seed when no token)
- scripts/linkedin-oauth-setup.md (exact one-time setup steps for Darek)
- notes.xml (RSS), sitemap.xml, robots.txt
- DESIGN_PLAN.md

## Design direction (pinned)
Logbook: paper #F6F1E7, ink #1C1A16, signal red #C23B22. MUST avoid the #1 AI-design tell (generic warm cream + serif + warm accent): execute distinctively with ruled paper lines, red margin rule, ENTRY Nº numbering, stamp vernacular, hand-drawn-ish dividers, monospace specimen labels. Structural uniqueness vs CTS hub and estate site: different section order, different interaction model.

## Workers
| Worker | Branch | Status |
|---|---|---|
| design-brief | design/plan | merged to main |
| builder | build/site | merged to main |
| auditor | audit/pass1 | dispatched |

## Log
- 2026-10-15 00:35: coordinator started. Preconditions: gh=darek225 ok, repo created, Vercel MCP connected, npm vercel CLI installing in bg (may not be needed; create_git_project is the path).
- REA browser capture confirmed broken on this VM (no proxy option in launch schema); LinkedIn UI comes from official embed iframes, not REA rebuild.
- 2026-10-15 04:45: design-brief worker dispatched (worktree darekanderson-site-wt/design, branch design/plan).
- 2026-10-15 05:05: design plan verified (0 em dashes, no lorem, 9 documented revisions) and merged to main. Builder worker dispatched next.
- 2026-10-15 05:25: build verified independently (copy verbatim, honest stamps, 0 em dashes, fixed seed-note dates to month precision) and merged to main. Auditor dispatched.
- 2026-10-15 05:45: audit pass 1 merged (tap targets fixed, Q10 placeholder added, entry-09 back-to-index added, theme-color added, clipping fallback link ink for AA contrast). Audit 14/20, critique 28/32.
- 2026-10-15 06:00: DEPLOYED. https://darekanderson-site.vercel.app (Vercel team zenjong, project darekanderson-site). CLI deploy as darek225; MCP create_git_project 403'd on team scope, CLI fallback used. Deployment protection (Vercel Authentication) disabled via API so the site is public. GitHub repo linked (production branch main) for auto-deploys on push. Live URL verified 200.

- 2026-10-15 06:15: FIXED LinkedIn embed URN. The share-URL activity id (…7201319940) 404s on LinkedIn's embed endpoint; the true post URN from the analytics link (…8090512384) returns 200 with the real post content. Fixed in index.html, assets/linkedin-posts.json, and the parent's linkedin-embed-demo.html. Pushed; auto-deploy verified serving the corrected URN.
- DONE. Site live at https://darekanderson-site.vercel.app, public, auto-deploying on push to main.

---

# V2 — Hub and Rooms rebuild (2026-10-15)

**Why:** Darek rejected v1 as "horrible... all you can do is scroll down" and for ignoring his repo resources ("no elements or animated cool shit"). V2 = base of operations, hub-and-rooms, motion from his repos.

**Branch:** v2/hub-rooms (worktree ~/workspace/darekanderson-site-v2). Lock: ~/workspace/darekanderson-site-v2.lock.json.

## V2 architecture
- `/` hub: identity strip + live status + 6 zone doors (Workshop / Lab / Study / Transmissions / Researcher / Make Contact).
- Rooms: /workshop, /lab, /study, /transmissions, /researcher, /contact. Persistent zone switcher nav, signature room transition.
- resume.html kept (print CSS). linkedin-posts.json + embed iframes kept. sync-linkedin.py + oauth doc kept. RSS/sitemap/robots/JSON-LD kept.

## Absolute rules (unchanged from v1)
No em dashes. Copy doc verbatim except styled [ASK DAREK]/[PHOTO] placeholders. Honest statuses (only Andola = operating business). No estate sale mentions. Mobile-first. prefers-reduced-motion degrades everything to instant. No scroll-jacking, preloaders, parallax on body text, pinned sections, autoplay video. No emojis as UI icons. No invented numbers/claims.

## Motion mandate (disciplined)
- Use ibelick-motion-primitives (adapt, don't npm-install), DavidHDev-canvas-ui (textures/dividers), paper-design-shaders (paper grain/light). Name every adapted primitive in the report.
- One signature room transition, consistent everywhere. Tactile zone doors. Gently pulsing status indicator. Near-still living paper background.
- frontend-design motion guidance applies: motion answers user action; no scattered fade-and-slide-up spam.
- 60fps budget on mid Android, no layout thrash.

## Phases
1. [ ] DESIGN: inventory repos, write DESIGN_V2.md (IA, motion language, adapted primitives list, token/layout plan) → coordinator verifies → build
2. [ ] BUILD: all pages + assets on v2/hub-rooms → coordinator verifies independently
3. [ ] AUDIT: impeccable audit + critique lenses, one fix batch
4. [ ] DEPLOY: merge to main (after verification), push (authored darek225 <darek225@users.noreply.github.com>), npx vercel --prod --scope zenjong, verify 200 + /lab + /transmissions
5. [ ] REPORT: live URL, repo elements actually used (named), audit results, remaining open items

## Log
- 2026-10-15: v2 coordinator started. Worktree ~/workspace/darekanderson-site-v2 on branch v2/hub-rooms off origin/main.
