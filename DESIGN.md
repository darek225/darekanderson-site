# DESIGN.md — darekanderson-site v5 ("The Logbook", multi-page)

Branch: `v5/multi-page-shader`. This is the single source of truth for design
decisions on this branch. It follows the taste-design seven-section structure
(see `~/workspace/repos/google-labs-code-stitch-skills/plugins/stitch-utilities/skills/taste-design/SKILL.md`,
method only), adapted to the Logbook identity. Where taste-design rules and the
Logbook brief conflict, the Logbook identity wins; each conflict is resolved in
a "Conflict note" at the end of the relevant section.

Darek's approved copy and the v3 single-page build live in `index.html`
(Logbook palette: paper `#F6F1E7`, ink `#1C1A16`, signal red `#C23B22`, plus
`--red-deep`). This doc extends, not replaces, `DESIGN_V3.md` / `DESIGN_PLAN.md`.

## 1. Visual Theme & Atmosphere

An engineer's bound logbook, open on the desk. Warm paper, one ink, one red
that does work. Every mark must earn its place: this is a document someone
keeps, not a page someone skims.

- **Density: 3-4 of 10** ("Art Gallery Airy" leaning balanced). Negative space
  is a structural layer; breathing pockets between dense ledger zones pull the
  reader deeper (dimensional report §3).
- **Variance: 5 of 10** ("Offset Asymmetric"). Offset grid — margin column,
  occluding plates, stamps rotated off-axis — but NEVER chaotic. Nothing tilts
  that isn't a stamp, a taped frame, or a photo plate.
- **Motion: 2 of 10** ("Static Restrained"). Motion answers user action (open
  TOC, press a row, switch a tab). Nothing ambient, nothing on scroll entry
  except the one chapter-opener reveal and the bounded ledger stagger.

The opening viewport must be compelling with zero scroll: thesis, taped
FIG. 01, one CTA. The red margin rule is the page's spine.

## 2. Color Palette & Roles

Six primitives + one derived component token. No hex outside `:root`.

| Name | Hex | Role |
|---|---|---|
| Paper | `#F6F1E7` | Page background |
| Paper Deep | `#EFE8D6` | Surfaces: drawer, door panels, ink-wash fill, clippings, inset frames |
| Ink | `#1C1A16` | Body text, rules, CTA fill. Never pure black (taste-design alignment) |
| Muted | `#6B6257` | Glosses, dates, secondary text, captions |
| Signal Red | `#C23B22` | The one functional accent: ENTRY Nº labels, margin rule, stamps, active states, links |
| Ledger Rule | `#D8D0BC` | Hairline separators, frame edges |
| Red Deep (derived) | `#A6321F` | Red text on paper-deep surfaces |

Semantic aliases: `--bg`, `--surface`, `--text`, `--text-muted`, `--accent`,
`--line`. Component tokens only where a component needs one
(e.g. `--stamp-border`).

**Contrast floor 4.5:1 on all text** (measured 2026-10-20, verified, not
eyeballed):

- Ink on paper 15.43; ink on paper-deep 14.22.
- Muted on paper 5.31; muted on paper-deep 4.90.
- Red on paper 4.73 (passes); **red on paper-deep 4.36 (FAILS)**.
- Red-deep on paper 6.02; red-deep on paper-deep 5.55.

Rule: base `--red` is text-safe ONLY on `--paper`; any red text on
`--paper-deep` MUST use `--red-deep`. Enforce in code review.

One accent color, no second hue, no gradient washes. The red is a functional
ink (marks entries, statuses, links), never decoration.

**Color-temperature depth** (dimensional report §3): cooler/dimmer in
background planes (paper-deep inset blocks recede), warmer/brighter in
foreground (paper surface, stamps, ink text). Never text over busy photos or
patterned backgrounds: text sits on paper, photos are framed plates with
mono captions.

**Texture restraint**: one noise source max on this site — the existing
inline SVG `feTurbulence` grain data-URI at ~6% opacity on body. Masked and
selective, never a full-page mud overlay.

Conflict note: taste-design bans generic serif stacks as defaults for
"premium contexts" and Inter for premium contexts. Yield: the Logbook
identity IS the distinctive context — Darek's approved brief pins serif +
cream + signal red as the brand, and the skill's serif ban targets the
generic-dashboard aesthetic this site already rejects. Inter was never used.

## 3. Typography Rules

Three faces, fixed roles, system stacks only (brief: no render-blocking
webfonts). A fourth face nowhere on the site. Exact stacks and scale from
`assets/main-v7.css`:

- **Display serif:** `Georgia, "Palatino Linotype", "Book Antiqua",
  "Times New Roman", serif`. Thesis, chapter titles, door titles, row names,
  TOC names. Sentence case, never all-caps. Scale:
  - Prologue name/headline: `clamp(1.9rem, 8.5vw, 3.2rem)`
  - Thesis / chapter titles: `clamp(2.4rem, 9vw, 4rem)`
  - Section display: `1.75rem`; door titles: `1.6rem` at 1.25; hero-name: `2rem`
  - Ledger row names: 20px; TOC names: 1.15rem
- **Body grotesque:** `system-ui, -apple-system, "Segoe UI", Roboto,
  "Helvetica Neue", sans-serif`. 17px floor, line-height 1.65, max 68ch.
  Serif never does body text.
- **Mono:** `ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas,
  monospace`. ENTRY Nº labels, stamps, dates, EXP indexes, tags, captions,
  specimen lines, the TOC button, status-strip rows. 11-13px,
  letter-spacing 0.08em-0.12em. Mono is the ONLY place caps appear — ledger
  vernacular, not decorative eyebrows.

taste-design prescribes 65ch max; the shipped column holds 68ch
(`max-width: 40rem` + margin column). Keep 68ch; the margin gutter absorbs
the difference.

Conflict note: taste-design's signature "inline image typography in
headlines" technique is deliberately NOT adopted. The logbook's photo
language is taped snapshots and framed plates, not type-punctuation images.
Adopting it would break the identity.

## 4. Component Stylings

**Buttons.** Solid ink primary (paper text, height >= 52px), ruled ghost
secondary (1.5px ink border). Tactile press only (translate -1px on
active). Labels never wrap to two lines at 360px. No glow, no custom
cursors, one primary CTA per section, no "Learn more".

**Rows (the atomic unit).** Full-width ledger rows separated by 1px
`--line`. Anatomy: mono specimen index (red) + name (display serif) +
status stamp (rest -3deg, red 1.5px border, mono 11px; settles to 0deg on
press) + one-line plain proof (body, muted) + underlined link (no arrow
glyphs). Whole row is the tap target (>= 48px height). Rows do NOT become
cards at any width.

**Stamps.** Rubber-stamp treatment. Ink-wash fill slides in on
hover/press (desktop fine-pointer only); static underline highlight under
reduced-motion. One honest stamp per row, in Darek's own words
(OPERATING BUSINESS, IN DEVELOPMENT, PROOF OF CONCEPT, LIVE PIPELINE,
LIVE, IN PROGRESS, OPEN QUESTION).

**Taped photo frames.** Paper-deep padding, image tilted -1deg, mono
FIG. caption. Frames are intentional placeholders when Darek hasn't picked
a print ("[PHOTO: real photo chosen by Darek]") — never broken images,
never AI portraits, never stock.

**Specimen plates.** Every image ships with a numbered mono caption
(FIG. 01, PLATE 02...): what it is, and when it matters. 11-12px mono,
muted, beneath the frame. Real photos only.

### The V5 pieces

**Specimen card grid.** Bentogrids-style asymmetric spans, art-first.
Rules: photo plates anchor the grid; spans are unequal (full-bleed plate +
offset halves, 3:2, staggered thirds); at least one plate overlaps the
margin rule or an adjacent plate (occlusion, dimensional report §3). Never
equal N-column rows. Below 768px: single column, plates stack full-width,
overlap removed (stacked occlusion doesn't survive narrow viewports).

**Start Here shelf.** Three proof entries, staggered offset arrangement
(indent steps, asymmetric widths) — NOT three equal columns. Each entry:
mono specimen line, one-line verifiable proof, one link. Proof must be
checkable (a URL, a dated note); never a claim.

**Live status strip ("On the machines").** Mono ledger rows, compact row
anatomy. Data rule, hard: every value comes from a real source (build
status, ship date, repo link); no invented numbers, no fabricated metrics,
no "99.98% uptime" filler. If a feed is unavailable the row says so in mono
("feed down, last checked <date>") rather than showing a stale number.
taste-design's fabricated-data ban applies at full strength here — this is
exactly the "SYSTEM PERFORMANCE METRICS" anti-pattern with a friendlier
name if the data isn't real.

**Project-page tab panels.** Real content stacked in the DOM, works with JS
off. With JS on, tabs enhance into switchable panels (fade incoming panel
180ms only). Deep-linkable via hash (`#panel-receipts`); keyboard: arrow
keys between tabs, roving tabindex, proper tablist semantics. No
auto-rotation, no hover-only tabs.

**Story timeline.** Photo plates with slight rotations (alternate +/- 2deg,
never past 3deg), deliberately occluding: each plate's edge overlaps the
previous plate's edge by 16-24px. Occlusion is the strongest depth cue —
use it instead of shadows. Mono date captions beneath. No scroll-parallax
on plates; static depth only (dimensional report §2/§5).

**Nav (multi-page).** Work / Notes / Story / Contact. Active page marked
with a red stamp underline (3px solid red under the label, slight -1deg
skew permitted). Desktop: horizontal; mobile: clean collapsible menu, no
horizontal scroll. Every page shares one shell: same head, same margin
rule, same opener machine, same colophon.

**Inputs.** Label above, error below, helper optional. The site has no
multi-field forms (brief — contact is mailto/CTA only); this rule is
reserved for any future single input and documented so it isn't improvised
later.

Conflict note: taste-design wants staggered cascade reveals on lists and
perpetual micro-loops on active components. Yield: only chapter openers
reveal (IntersectionObserver, once); ledger rows stagger 60ms, first 6
only, later rows join instantly. Reduced-motion and JS-off: everything
instantly visible. Nothing loops, ever.

## 5. Layout Principles

- One column everywhere. Content max-width 40rem, centered on desktop with
  the slim TOC rail; 360px is the design width. No multi-column grids that
  merely shrink. The specimen card grid is the one asymmetric grid, and it
  collapses to single column below 768px.
- Left edge is law: heads, body, stamps, buttons align to the content edge
  that clears the red margin rule. Only stamps and photo plates break the
  grid, on purpose. Nothing is centered except the final colophon line.
- The margin rule: 2px solid red, full page height, at the left edge of
  the content column (16px from the viewport edge on mobile). Everything
  (openers, rows, notes, doors) aligns to it.
- Chapter opener machine (every chapter, every page): mono red Nº label
  (13px, 0.12em tracking) → display serif title (sentence case) → muted
  gloss line (body 17px) → ruled double-divider (two 1px ink hairlines,
  6px apart). End of long chapters: the divider reappears with a stamped
  "END OF ENTRY Nº 02".
- Grid-first; no flexbox percentage math. Type scales via `clamp()`.
- The hero is capped, not full-viewport: max-height 85vh, thesis + first
  CTA visible on a 740px-tall phone without scrolling. No full-viewport
  scroll trap, no sticky sections longer than one viewport on mobile
  (taste-design's `min-h-[100dvh]` is NOT adopted; the Logbook brief's
  85vh cap governs).
- Responsive (< 768px): all multi-column layouts collapse to single
  column; no horizontal overflow (tilted stamps can't break it — body
  overflow-x backstop permitted); interactive elements >= 44px, CTAs
  >= 48-52px; vertical section gaps reduce via `clamp(3rem, 8vw, 6rem)`;
  nav collapses to a clean mobile menu.

## 6. Motion & Interaction

Motion answers user action. One orchestrated moment per interaction.
Nothing ambient, nothing decorative.

- **Chapter opener reveal:** IntersectionObserver, once, opacity + 12px
  translateY, 400ms ease-out. Deep-link arrival skips it (element arrives
  visible).
- **Ledger rows:** stagger 60ms, y 8px, first 6 rows only; rows after join
  instantly.
- **The stamp-press** (the one signature interaction): on row or TOC
  press, one 250ms moment — ink-wash fill slides in, row nudges
  magnetically (desktop fine-pointer only), stamp settles from -3deg to
  0deg. Three sub-motions, one user action, one perceived press.
- **TOC drawer:** 280ms `cubic-bezier(0.22, 1, 0.36, 1)` slide, 200ms
  backdrop fade; ESC/backdrop closes; focus moves into the drawer and back
  to the button; body scroll locks.
- **Tab panels:** fade the incoming panel only, 180ms.
- Transform + opacity only. Passive listeners. No scroll handlers —
  IntersectionObserver drives everything. The paper grain is a static SVG
  data-URI: zero JS, zero repaint cost after first paint.
- **WebGL outside the hero: none.** See §9.
- **prefers-reduced-motion / JS-off:** all reveals degrade to instant
  visible — no opacity-0 initial state is ever applied when the media
  query matches; content is in the DOM in its final state, so JS-off
  shows everything. Drawer opens instantly. Anchor travel uses `auto`
  scrolling. Magnetic + ink-wash disabled; rows get a static underline
  highlight. The static composition is complete and attractive with zero
  animation: stamps, rules, and numerals carry the design.

Conflict note: taste-design's default Motion 6 (fluid/spring physics
everywhere, `stiffness: 100, damping: 20`) and "perpetual
micro-interactions" are yielded to the Logbook brief's Motion 2. Spring
values may inform the single 250ms stamp-press; nothing loops.

## 7. Anti-Patterns (Banned)

From the brief + taste-design, enforced as hard bans on this branch:

1. Wall-of-text single scroll (no entry openers, no rhythm). Long pages
   use the ENTRY Nº opener machine.
2. Equal 3-column card rows. Specimen grid: asymmetric spans. Start Here
   shelf: staggered stack. Never three equal columns.
3. Decorative animation: ambient loops, entrance spam, parallax on text.
4. WebGL outside the hero. Nothing canvas anywhere else. Period.
5. Text over busy photos or patterned backgrounds.
6. Invented numbers, dates, metrics, claims. Real data or framed
   open-question blocks. Applies at full strength to the status strip.
7. A second accent color. The signal red does all accent work.
8. A fourth font face. Three stacks, fixed roles, on every page.
9. Emojis as UI icons. Em dashes anywhere. AI copywriting clichés
   (Elevate, Seamless, Unleash, Next-Gen).
10. Middle-dot meta strings. Appended → on links. Tracked-out all-caps
    eyebrows on headings (mono ledger labels only, carrying real
    information).
11. Single-word accent color in headlines. Color marks function, never
    decorates words.
12. `LABEL // YEAR` formatting. Generic names. Filler UI text ("scroll to
    explore", chevrons, scroll arrows).
13. Rounded SaaS cards with soft shadows. Ledger rows and inset blocks
    only.
14. Estate-sale mentions. Multi-field forms. X embeds (link only).
15. `pure black` (#000000), neon/outer glows, oversaturated accents,
    gradient text on large headers, custom mouse cursors, broken Unsplash
    links.

## 8. Benchmark notes (v5)

Method: `browser.open` text extraction of 3 visual-first builder
portfolios (leerob.com, paco.me, brianlovin.com). **Analysis is from page
text and markup structure, not renders** — no live-browser screenshots
were available to this worker, so nothing below is a visual claim.
rauno.me was attempted but returns almost no text (JS-heavy); excluded.

### leerob.com (Lee Robinson)

- Bio first, thesis second: a 3-sentence identity block ("I'm an engineer
  and writer... My life's work is to make technology easy to understand"),
  THEN the indexes. The thesis line does the positioning work, not a hero
  visual.
- Notes as a topic index: 12 named topics, each a one-line link. No
  excerpts, no cards. Density without weight.
- Blogs list: title + date on every row, newest first. Dates on
  everything.
- **Steal:** put a real date on every note/status row (date is first-class
  data in our ledger rows); the thesis-before-index order validates our
  prologue structure; the topic-index treatment maps directly to the
  Start Here shelf (a few named doors, one line each).

### paco.me (Paco Coursey)

- "Crafting interfaces." — a two-word thesis as the whole opening.
  Ruthless compression.
- Section labels are verbs in the maker's voice: Building / Projects /
  Writing / Now. Not "About / Portfolio / Blog".
- Projects are one line each, zero metrics, zero cards. "Composable
  command menu React component." That's the whole entry.
- The "Now" block is personal and unquantified ("Developing skill through
  doing, guiltlessly exploring passion and interests"), not a stats strip.
  It reads as a person, not a dashboard.
- **Steal:** one-line project glosses with no metrics (our ledger proof
  lines already do this — hold the line when project pages go deeper:
  lead with the one-liner); the "Now" block is the tonal model for the
  "On the machines" strip, except ours must show real machine state, not
  vibes (§7 ban 6 still governs); verb-labeled sections confirm our nav
  register (Work / Notes / Story / Contact is the right voice).

### brianlovin.com (Brian Lovin)

- Projects are a plain list of titled links, each with a short gloss
  ("A minimal hacker news reader"). Small 128px avatar up top — no
  banner, no case-study cards.
- Name + one sentence ("I'm a software designer... currently making AI
  products at Notion"), then straight to the list.
- **Steal:** validates the ledger-row model against a strong designer
  portfolio — the list of honest one-line glosses IS the design; our
  photo plates and specimen grid should follow the same discipline
  (every plate earns its place, nothing decorative); the modest avatar
  argues for taped snapshots sized small, never banner crops.

### Cross-cut takeaways for v5

1. All three benchmarks ship plain ledger-style lists, not cards. The
   rows direction is correct; never let the "specimen card grid" drift
   back into equal cards.
2. Dates on everything. Add date fields to Start Here shelf rows and
   status strip rows.
3. The thesis line sits above all content. The prologue thesis stays the
   page's first and biggest statement.
4. One-line honest glosses beat feature lists. Project pages can go deep,
   but index entries stay one line.
5. The "Now"-block pattern says the "On the machines" strip should read
   as current human status first, machine data second — and never as
   fabricated metrics.

## 9. Hero shader feasibility memo (v5)

Question: should the v5 hero carry a paper-design/shaders texture, and if
so, how? Read from `~/workspace/repos/paper-design-shaders`
(`packages/shaders` v0.0.81, dist built).

**What the library is.** Zero-dependency ESM canvas shaders (Apache 2.0).
Each effect is a self-contained GLSL fragment-shader module; `ShaderMount`
(compiled to `shader-mount.js`, verified in source) creates a canvas it
prepends to a parent element. Motion is per-effect; `speed = 0` stops the
rAF loop entirely (single static render, zero recurring cost). ShaderMount
already implements: IntersectionObserver pause when scrolled out of view,
pause on tab hidden (visibility), ResizeObserver, and DPR handling via
`minPixelRatio` (default 2) / `maxPixelCount` (default ~8.3M pixels)
constructor args. WebGL2 only (`canvas.getContext('webgl2')`); the
constructor THROWS "Paper Shaders: WebGL is not supported in this browser"
when unavailable — a try/catch fallback is mandatory, not optional.

### (a) Which effect fits a Logbook hero at very low intensity

`paper-texture` is the family match: static paper grain, fibers, and
roughness rows with `u_colorBack` / `u_colorPaper` / `u_colorShadow`
uniforms. Tint `u_colorPaper` exactly to `--paper` (`#F6F1E7`), set
roughness ~0.15-0.25, roughnessRows 0, fibers ~0.1, folds / wrinkles /
crumples / drops at 0, speed 0 (single render). It deepens the existing
SVG grain rather than introducing a foreign visual language. Second
choice: `halftone-dots` at very low contrast over the taped photo plate
only (print-shop register look) — but it fights the photographic-honesty
rule (plates are framed; text never overlays them). The rest of the
catalog (mesh gradients, metaballs, liquid metal, god rays, warp) is
categorically wrong for this identity.

### (b) How it ships in a no-build static site

Vendor, don't CDN. Copy six files from the repo's `dist` into
`assets/vendor/paper-shaders/`: `shaders/paper-texture.js`, plus
`shader-mount.js` (21.5KB), `vertex-shader.js` (5.4KB),
`shader-utils.js` (3.7KB), `shader-sizing.js` (0.8KB),
`shader-color-spaces.js` (2.7KB) — ~55KB raw unminified, mostly GLSL
strings and the mount class; much less gzipped. Each shader module is
self-contained (verified: `paper-texture.js` imports only
`../shader-utils.js` and `../shader-sizing.js`). A small
`assets/hero-texture.js` ES module imports ShaderMount +
`paperTextureFragmentShader`, wraps the mount in try/catch, and mounts
the canvas behind the prologue content (absolute, `aria-hidden="true"`,
`pointer-events: none`). Load via `<script type="module" src="...">`
(deferred by definition, never render-blocking). License: Apache 2.0 —
include the repo's NOTICE attribution in the vendor dir. Do NOT load from
CDN: a third-party script is a render-blocking risk and version drift,
both banned by the brief.

### (c) Exact fallback design

- **JS off:** nothing mounts. The hero already renders complete on the
  static SVG grain; the canvas is an enhancement layer inserted by JS.
- **WebGL unavailable** (context creation fails, WebGL2 absent on old
  devices or embedded webviews): the try/catch around
  `new ShaderMount(...)` swallows the constructor's throw; the canvas is
  never inserted; the static composition stands unchanged.
- **prefers-reduced-motion:** skip mounting entirely — not even the single
  render. The static SVG grain is the reduced-motion composition.
- **DPR cap:** `minPixelRatio: 1.5`, `maxPixelCount` sized to the hero
  rect (e.g. 420 x 640 CSS px x 2 ≈ 540K pixels, far under the 8.3M
  default). Canvas resolution follows the hero element, not the viewport.
- **Pauses:** IntersectionObserver + visibilitychange pausing are built
  into ShaderMount (verified in source) — no extra code. With `speed: 0`
  there is no rAF loop at all: no per-frame cost after first paint.

### (d) Verdict: cut for v5, path documented

**Cut.** Reasons: (1) the existing static SVG grain already delivers the
atmosphere plane — at the mandated low intensity, the WebGL texture is
visually indistinguishable from what's there, so the gain is near zero;
(2) it adds real failure modes (WebGL2 absence, driver quirks, canvas
repaint cost) to a page whose philosophy is "static is a feature";
(3) ~55KB of payload (pre-gzip) for a texture nobody can name;
(4) `DESIGN_V3.md` §7's rejection still holds on all its stated grounds.
The vendoring path above is documented so the call can be reversed in one
session if Darek wants the paper-texture richness — the integration is
bounded to ~60 lines of init code plus a six-file vendor dir, no build
step, no render-blocking JS.

**What is and is not verifiable from this VM.** Verifiable: vendored file
sizes, module import correctness (import check), that the script is
deferred/non-render-blocking, try/catch fallback correctness, that the
static composition renders identically with JS disabled (static analysis of
markup + CSS). NOT verifiable here: mid-Android frame rate or the visual
quality of the shader. This VM has no working headless-Chromium WebGL path
(Chromium fails all navigation through the egress proxy; REA browser
capture of remote URLs is broken, per AGENTS.md), so even bounded canvas
work would need a real device check (Darek's Android, or a live-browser
task) before shipping.

## §4 addendum: unused-but-kept CSS classes (2026-10-20, recorded by coordinator — the audit claim that these were documented here was unverified)

Deliberately kept in main-v8.css with no current v5 markup: `.field-*` (reserved input system), `.cta-btn-ghost`, `.plate` / `.plate-caption` / `.plate-no` (specimen-plate vocabulary for future use), and the specimen-grid desktop span variants `--full / --major / --minor / --half / --third / --stagger-1 / --stagger-2 / --bleed / --overlap`. These are documented patterns, not dead weight: the grid variants are the intended toolkit for future card-grid layouts. Everything else orphaned during reconciliation was deleted.
