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

---

# V4 — Case-file project write-ups + AI-industry positioning (2026-10-19)

**Why:** Darek relayed from the "Switching from engineering to AI" side chat: portfolio projects must read hiring-standard (built / what broke / evaluation criteria / outcomes and defensible numbers), and positioning must pivot from MET-student to AI-industry entry (CPCC junior, AI program path, AWS AI Practitioner target). The old education line ("studying Mechanical Engineering Technology at UNC Charlotte and CPCC") is factually wrong and gets replaced.

**Branch:** v4/case-files (worktree ~/workspace/darekanderson-site-v4). Lock: ~/workspace/darekanderson-site-v4.lock.json.

## V4 scope (copy upgrade only — no structural/motion changes)
- Lab: the 6 software projects become case entries. Each keeps the ledger row header (EXP index, name, honest stamp, one-line plain summary, external link) and gains a case-file block: BUILT / WHAT BROKE / HOW I JUDGE IT / RESULTS, with [ASK DAREK] placeholders where numbers are missing (Dowser first campaign, CTS client count, Deal Snipers followers/revenue, WildClash channel numbers).
- Workshop: Andola row trimmed to a plain one-line summary; a case-file block below the ledger with BUILT / WHAT BROKE / HOW I JUDGE IT / THE NUMBERS (all verified). Job cards stay as evidence.
- Researcher: new copy: 20-year-old, building with AI since Aug 2026 (about two months), UNC Charlotte did not stick, CPCC junior aiming at the AI industry (CPCC AI program path, working toward AWS Certified AI Practitioner). Thesis paragraph stays verbatim. CPCC placeholder-frame replaced with the known facts.
- resume.html: education section updated to CPCC (remove stale "UNC Charlotte" framing; verify exact lines).
- CSS: additions only (case-file block styling in logbook vernacular: mono red-deep labels, hairline rules). Cache-bust rename main-v6.css -> main-v7.css, update both link tags (index.html, resume.html).
- No: hero, doors, field notes, notes, study, motion system, TOC.

## Absolute rules (unchanged)
No em dashes. No invented numbers/dates/statuses. Honest stamps; only Andola = operating business. No estate-sale mentions. Works with JS off. No "academically suspended" phrasing (open question for Darek).

## Phases
1. [x] WORKTREE + LOCK: branch v4/case-files off origin/main
2. [ ] COPY+CSS: one worker does all edits on the branch
3. [ ] VERIFY: coordinator re-checks gates independently (0 em dashes, 0 estate-sale, 7 projects + honest stamps, both LinkedIn URNs, TOC anchors, static responsive review)
4. [ ] DEPLOY: merge --no-ff to main, push, npx vercel --prod --scope zenjong, verify 200
5. [ ] REPORT: live URL, per-project changes, verified-vs-placeholder numbers, open questions

## Log
- 2026-10-19 23:35: v4 coordinator started. Branch v4/case-files created off origin/main (51068f0).
- 2026-10-20 03:36: COPY+CSS verified independently by coordinator (0 em dashes, 0 estate-sale, both URNs x2, 7 case-files / 28 labels, tag balance clean, TOC id set unchanged). Branch rebased clean onto origin/main.
- 2026-10-20: MERGED --no-ff to main (781bf27, authored darek225) and pushed. Deploying via Vercel CLI (zenjong); verification pending.
- 2026-10-20 03:45: DEPLOYED. `npx vercel --prod --scope zenjong` exit 0. Live verification: HTTP 200 on / and /resume.html; main-v7.css referenced; 28 case-labels on /; "Central Piedmont" present; 0 em dashes. DONE. v4 live at https://darekanderson-site.vercel.app.

---

# V5 — Multi-page rebuild + hero shader experiment (2026-10-20)

**Why:** Darek rejected v3/v4 as "very boring, all you do is scroll down a wall of text, bad organization." Approved rebuild: multi-page, home = visual index, per-project pages, notes/story pages, nav Work/Notes/Story/Contact. Shader experiment approved but cut (below).

**Branch:** v5/multi-page-shader (worktree ~/workspace/darekanderson-site-v5). Lock: ~/workspace/darekanderson-site-v5.lock.json.

## V5 scope (structure only; all approved copy carries over)
- index.html rebuilt: hero (unchanged copy) + Start Here shelf (3 proofs) + "On the machines" strip + specimen card grid (7 cards, Andola real photo + 6 name plates) + Three Doors + footer.
- work/*.html x7: header (name, stamp, one-liner, external link) + large art + case file as tab panels (Built / What broke / How I judge it / Results), stacked DOM with JS off.
- notes.html: Field Notes, highlights, tag filter (JS-gated), both LinkedIn embeds (URNs intact), notes.xml anchors updated.
- story.html: Researcher as photo timeline + "From The Study" block (Universal Schematic, essays) restored.
- resume.html: stylesheet link only changed.
- Nav on every page; TOC drawer removed everywhere; dead JS banned (resume loads no JS).
- CSS: main-v7.css -> main-v8.css (design system from DESIGN.md); one deferred JS file assets/enhance.js.
- 6 name plates carry screenshot-slot comments (assets/screenshots/<slug>.jpg) for parent-side browser captures.

## Sources and what each drove (Darek's named-sources requirement)
- wiki/web-design-ingredients.md: workflow (DESIGN.md first, build, audit); 21st.dev/magic-mcp catalog noted, not needed.
- wiki/palette-and-color-design.md: contrast floor 4.5:1 enforced; red text only on paper (4.73), red-deep on paper-deep (fixed a real v7 fail: .door-no).
- dimensional-web-design-2026/report.md: occlusion overlap (plates over margin rule), 2-degree plate rotations, parallax <=15% decorative only, mobile-safe dimensionality; static composition complete everywhere.
- taste-design skill: DESIGN.md seven-section structure; three conflicts resolved FOR the brief (Logbook Georgia serif kept; no inline-image typography hero; Motion 2, no perpetual loops).
- impeccable: 21/24 critique (fix batch applied); vercel-labs web-design-guidelines: 17/20 audit.
- ibelick-motion-primitives: InView, AnimatedGroup stagger (60ms), stamp-press (fine-pointer), Magnetic (dropped: no .magnetic markup in v5; press effect via CSS), ink-wash (dropped: no ledger rows; hover states restyled).
- paper-design-shaders: evaluated, CUT for v5.
- Galleries (supahero.io, bentogrids.com, cta.gallery): reference only for hero/grid/doors shapes.

## Hero shader verdict: CUT
Only paper-texture fit the Logbook at mandated low intensity; at that intensity the gain over the existing static SVG grain is near zero while adding WebGL2 failure modes + ~55KB payload. Vendoring path documented in DESIGN.md §9 if Darek wants to overrule. Not verifiable on this VM: mid-Android fps, shader visuals (no working headless WebGL path).

## Workers
1. design: DESIGN.md (448 lines), benchmarks (leerob.com, paco.me, brianlovin.com; rauno.me JS-blocked, excluded), shader memo.
2. pages: 11 pages; Study chapter copy orphaned then flagged (audit restored it); new microcopy flagged for Darek's review pass.
3. assets: main-v8.css (1096 lines), site.js (later deleted); fixed .door-no contrast fail; TOC CSS/JS removed.
4. audit: class reconciliation (45 HTML orphans + 68 CSS orphans -> 0 HTML orphans, 18 documented-kept CSS orphans), JS merged to enhance.js, Study restored to story.html, resume main.js removed, impeccable 21/24, guidelines 17/20, gate table all green.

## Log
- 2026-10-20 04:0x: V5 coordinator started. Branch v5/multi-page-shader off origin/main (04abbf6), worktree created.
- 2026-10-20: design complete (DESIGN.md + benchmarks + shader verdict CUT).
- 2026-10-20: build complete (11 pages + assets).
- 2026-10-20: audit complete (reconciliation, JS merge, Study restore, audits, gates).
- Coordinator independent gates: em dashes 0, estate-sale 0, OPERATING BUSINESS 3x all-Andola, URNs 2x each in notes.xml targets, main-v8.css on 11/11, sitemap = 11 routes, notes.xml parses, 13 Andola photos, 6 screenshot slots, 0 broken internal links.

## V5 impeccable detector flags (2026-10-20, engine v0.1.14, `skill/scripts/impeccable detect --json` on all 11 pages)
- REAL, FIXED: `low-contrast :hover 1.3:1` — text #a6321f on #c23b22. Root cause: `.door a:hover` (0,2,1) outranked `.cta-btn:hover` (0,2,0), so the 5 door CTA buttons rendered red-deep text on the signal-red button face. Fix: scope the rule to `a:not(.cta-btn)` (main-v9.css). Verified 0 findings post-fix.
- Logbook brief wins (recorded, not fixed): `wide-tracking` on mono uppercase labels (nav brand, nav links, entry-no, stamps, captions, tags — the detector's own short-uppercase-label exception); `hero-eyebrow-chip` on ENTRY Nº markers (pinned vernacular; FIELD NOTES / THE RESEARCHER markers intentionally category-name the chapter); `all-caps-body` (`.job-dates` date labels); `tiny-text` (11px mono labels only, never body); `repeating-stripes-gradient` advisory (ruled paper lines, pinned by the brief).
- Next runs: slices 3 (web-design-guidelines 17/20, flags need same detector pass against that lens), 4 (mobile polish), 5 (performance: 6 screenshot JPEGs ~489KB total, audit weights), 6 (accessibility), 7 (status strip upkeep), 9 (microcopy), 10 (ASK DAREK placeholders — numbers only from Darek).
