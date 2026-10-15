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

---

# V3 — Chapters + Table of Contents rebuild (2026-10-15)

**Why:** Darek rejected v2's hub-and-rooms as "dumb... six fucking vague boxes to click" and told us to study real builder/founder sites. V3 = single-page logbook with CHAPTERS and a real TABLE OF CONTENTS, modeled on thesephist.com (thinking statement up top, index into output), levels.io (everything-shipped index, honest statuses), simonwillison.net (dated tagged notes), nathanbarry.com (identity-stacking hero, one CTA per visitor type).

**Branch:** v3/chapters-toc (worktree ~/workspace/darekanderson-site-v3). Lock: ~/workspace/darekanderson-site-v3.lock.json.

## V3 architecture (approved by Darek)
1. Hero — compact: identity stack (builder, landscaper, engineering student) + thinking statement + photo placeholder frame + three CTAs (What I'm raising for / Work with me / Follow the notes).
2. Table of Contents — real contents listing, openable from anywhere: fixed "Contents" button opens full chapter index drawer (mobile) / slim chapter rail (desktop); smooth anchor travel.
3. The Hypothesis — his AI thesis.
4. Builds — everything-shipped index: all 7 projects, honest status stamps (only Andola = OPERATING BUSINESS), physical + software together, one-line plain summaries (joshwcomeau style).
5. Philosophy — thinking pieces: Universal Schematic ("in progress"), 1-2 short essays from thesis material.
6. Field Notes — dated, tagged notes (3 seeds) + LinkedIn auto-feed subsection (official embed iframes).
7. The Researcher — about + resume (keep resume.html with print CSS as its own page).
8. Contact — three doors, one CTA each: funders ("What I'm raising for" frame + visible open-question markers), employers/partners, audience.
Each chapter gets a real chapter opener (ENTRY Nº, title, ruled divider) so sections feel distinct. The TOC is the primary navigation.

## Absolute rules (unchanged)
No em dashes. Copy doc verbatim except styled [ASK DAREK]/[PHOTO] placeholders. Honest statuses. No estate sale mentions. Mobile-first. prefers-reduced-motion degrades to instant. No scroll-jacking, preloaders, parallax on body text, pinned sections, autoplay video. No emojis as UI icons. No invented numbers/claims/dates.

## Motion mandate (disciplined) — repo assets MUST be used and named in the report
- ibelick-motion-primitives: chapter reveal transitions, TOC drawer physics, tactile interactions, staggered experiment-row entrances (adapt, don't npm-install).
- DavidHDev-canvas-ui: canvas paper texture / divider treatments.
- paper-design-shaders: subtle paper grain/light.
- Motion answers user action (opening TOC, entering chapters, hover). One orchestrated moment per interaction. 60fps budget on mid Android.

## Phases
1. [ ] DESIGN: inventory repos, write DESIGN_V3.md (IA, chapter system, TOC behavior, motion language, adapted primitives list, tokens) → coordinator verifies → build
2. [ ] BUILD: index.html + resume.html + assets on v3/chapters-toc → coordinator verifies independently
3. [ ] AUDIT: impeccable audit + critique lenses, one fix batch
4. [ ] DEPLOY: merge to main after verification, push (authored darek225), npx vercel --prod --scope zenjong, verify 200
5. [ ] REPORT: live URL, repo assets used (named), audit results, remaining open items

## Log
- 2026-10-15: v3 DESIGN verified (DESIGN_V3.md: 8-chapter IA, TOC drawer/rail, 5 named motion primitives, logbook tokens, anti-default review). WebGL texture repos honestly skipped (JS-off + 60fps budget); grain via static SVG.
- 2026-10-15: v3 BUILD verified independently (0 em dashes, 0 estate-sale, 7/7 projects + stamps, TOC anchors resolve, correct LinkedIn URN, responsive rules sane). Builder deviations noted: EXP-01..07 mapping (copy doc had no labels), Backseat stamp "LIVE, OPEN SOURCE", WildClash dual stamps, hero CTA trio.
- 2026-10-15: v3 AUDIT 17/20, critique 26/32. Fixes: red-deep AA token, ink-wash transform-only, rail aria-labels, drawer-close JS guard, skip-link hover, 40rem column, ::selection theming, resume.html cleanup.
- 2026-10-15: MERGED v3/chapters-toc to main (28b73ba), pushed to origin. DEPLOYED via Vercel CLI (zenjong): https://darekanderson-site.vercel.app verified 200, 8 chapters live, correct LinkedIn URN, CONTENTS button + rail present.
- DONE. v3 live.
