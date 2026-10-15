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
| design-brief | design/plan | dispatched |
| builder | build/site | pending (after design merge) |
| auditor | audit/pass1 | pending (after build merge) |

## Log
- 2026-10-15 00:35: coordinator started. Preconditions: gh=darek225 ok, repo created, Vercel MCP connected, npm vercel CLI installing in bg (may not be needed; create_git_project is the path).
- REA browser capture confirmed broken on this VM (no proxy option in launch schema); LinkedIn UI comes from official embed iframes, not REA rebuild.
