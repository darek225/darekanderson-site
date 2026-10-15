# DESIGN_V3 : darekanderson-site, Chapters + TOC rebuild

Branch: `v3/chapters-toc`. Design planning only; no site code written yet. Built from:
copy-draft-v1.md, BUILD_NOTES.md, PLAN.md (v3 section), frontend-design SKILL.md
(plan-then-review process), ui-ux-pro-max design-system SKILL.md (token discipline).

## The design, in one sentence

A bound logbook you read cover to cover: numbered chapters, a red margin
rule down the whole page, specimen stamps, and a table of contents you can
pull open from anywhere. The proof is the ledger, not the pitch.

---

## 1. IA: the 8 chapters

Hero is the **Prologue** (unnumbered). TOC is the navigation device (not a
chapter). Chapters are numbered ENTRY Nº 01-08.

| Nº | Chapter | Anchor | One-line purpose |
|----|---------|--------|------------------|
| 01 | The Hypothesis | `#ch-01-hypothesis` | His AI thesis: what AI is actually good for, found by building |
| 02 | The Workshop | `#ch-02-workshop` | The operating business: Andola, stamped honestly as the only one |
| 03 | The Lab | `#ch-03-lab` | The six software systems, ledger rows with honest status stamps |
| 04 | The Study | `#ch-04-study` | Universal Schematic + essays: thinking in progress, open questions visible |
| 05 | Field Notes | `#ch-05-notes` | Dated, tagged notes, highlights shelf for newcomers, LinkedIn subsection |
| 06 | The Researcher | `#ch-06-researcher` | The maker arc (about), ending at the doors, not at a timeline |
| 07 | Three Doors | `#ch-07-doors` | Funders / employers / audience: one CTA each, zero forms |
| 08 | Contact + Colophon | `#ch-08-contact` | Email, X, RSS, colophon line, honest credits |

Realm names (Workshop / Lab / Study) are provisional per the copy doc; the
chapter titles are set from those names, so a rename is a one-line change.

### TOC structure

- **Mobile (360-430px, the design surface):** a full-chapter index as a
  bottom-sheet drawer. Each entry: mono `Nº 03` in signal red, chapter
  title, and a 6-word gloss. Current chapter marked with a red stamp
  tick (IntersectionObserver, once per section). Tap = drawer closes,
  page smooth-scrolls to the anchor.
- **Desktop:** a slim fixed left rail showing only `01`-`08` (mono,
  13px), the active chapter marked red. Rail never steals reading width;
  content column stays centered at its own max-width.
- **Anchor scheme:** `#prologue` + `#ch-01-hypothesis` ... `#ch-08-contact`,
  plus `#note-<slug>` anchors inside chapter 05. Deep links must open the
  drawer-closed page at the right chapter with the opener reveal already
  complete (no reveal gate on anchor arrival).

### How the TOC stays reachable

- **Fixed Contents button**, bottom-right, 52px square, ink background,
  paper text, mono "CONTENTS". Safe-area inset respected. Visible from the
  first scroll pixel (it appears after the prologue scrolls out, so the
  hero stays clean).
- Opens the drawer on all viewports (mobile sheet, desktop centered
  panel). ESC closes; focus moves to the drawer on open and returns to
  the button on close; body scroll locks while open; backdrop tap closes.
- The drawer is the ONLY global nav. No top navbar. Chapter-end "Back to
  contents" links at the end of long chapters (Lab, Notes) for readers who
  never found the button.

---

## 2. Chapter opener system (exact anatomy)

Every chapter opens with the same machine, so the TOC's promise matches
the reading experience:

```
[ red margin rule runs full page height, 2px, at left content edge ]

  Nº 02                          ← mono 13px, letter-spacing .12em, signal red
  THE WORKSHOP                   ← display serif, clamp(2.4rem, 9vw, 4rem)
  Businesses I run.              ← gloss line, muted, italic? no: body 17px muted
  ━━━━━━━━━━━━━━━━━━━━━━          ← ruled divider: hairline ink + second hairline
```

- **ENTRY Nº label:** mono, `Nº 02`, signal red, 13px, letterspacing 0.12em.
  It is the logbook vernacular; it carries real information (position in
  the book), not decoration.
- **Title treatment:** display serif (Georgia stack), sentence case, never
  all-caps. One size scale: chapter title / thesis / door title are the
  only uses of the display face.
- **Ruled divider:** two 1px ink hairlines 6px apart (double-rule ledger
  convention). Below long chapters the same divider reappears with a
  stamped "END OF ENTRY Nº 02" label, giving the book a close.
- **Stamp placement:** status stamps live on experiment rows (ch. 02/03),
  rotated -3deg, red 1.5px border, mono 11px: `OPERATING BUSINESS`,
  `IN DEVELOPMENT`, `PROOF OF CONCEPT`, `LIVE PIPELINE`. One honest stamp
  per row. The Study chapter stamps entries `IN PROGRESS` / `OPEN QUESTION`.
- **The margin rule:** a 2px signal-red vertical line at the left edge of
  the content column, running the full page length, like a ledger's margin
  column. Everything (openers, rows, notes, doors) aligns to it. On mobile
  it sits at 16px from the viewport edge.
- **Chapter distinction:** each opener gets one distinct artifact, no more:
  - 01 Hypothesis: the ratchet line set as a pull-quote in the red margin.
  - 02 Workshop: the single `OPERATING BUSINESS` stamp, larger, centered.
  - 03 Lab: ledger index `EXP-01...` numbering begins (Andola is EXP-01 in 02, Lab continues EXP-02...).
  - 04 Study: open-question markers rendered as red-ink margin notes.
  - 05 Notes: date stamps (`OCT 2026`) in the margin column.
  - 06 Researcher: taped photo frame placeholder (see §5).
  - 07 Doors: three red-numbered door panels (I / II / III).
  - 08 Contact: stamped colophon block.

---

## 3. Motion language

**Rule:** motion answers user action (open TOC, enter chapter, press a row).
One orchestrated moment per interaction. No scattered entrances.

### Adapted primitives BY NAME (ported to vanilla CSS/JS, no npm installs)

The site ships hand-written HTML/CSS/JS (BUILD_NOTES §5). ibelick
primitives are React + motion/react; "adapt" = port their variant configs
and spring values, not the components.

1. **`InView` (in-view.tsx)** : chapter opener reveal on scroll-entry.
   Config: `{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }`,
   400ms ease-out, `once: true`, via IntersectionObserver. Used ONLY on
   chapter openers and chapter-end dividers. Ledger rows use #2 below.
   Deep-link arrival skips the reveal (element already visible).
2. **`AnimatedGroup`, `slide` preset (animated-group.tsx)** : staggered
   experiment ledger rows in chapters 02/03. Config: item
   `{ opacity 0→1, y 8px }`, `staggerChildren: 60ms` (tighter than the
   100ms default; a 6-row list must not drag), container triggers once via
   IntersectionObserver. Rows after the 6th join with no stagger.
3. **`Dialog` (dialog.tsx)** : TOC drawer physics. Ported variants:
   drawer initial `{ opacity 0, y 24px }` → open, 280ms
   `cubic-bezier(0.22, 1, 0.36, 1)`; backdrop fades 200ms; exit reverses.
   Focus trap + scroll lock mirror the original's behavior.
4. **`Magnetic` (magnetic.tsx)** : tactile hover on TOC entries and
   experiment rows, desktop fine-pointer only (`@media (hover: hover)`).
   Ported: intensity 0.3 (half the default, subtler for text rows), range
   60px, spring `{ stiffness: 26.7, damping: 4.1, mass: 0.2 }` via rAF.
   Mobile: skipped entirely (touch targets stay put).
5. **`AnimatedBackground` (animated-background.tsx)** : tactile press on
   experiment rows and TOC entries: a single absolutely-positioned
   "ink-wash" fill slides between hovered/pressed rows (the shared-layout
   `layoutId` idea, ported to one moving div), 180ms. This is the
   row-highlight mechanism; no per-row background colors.

### The one signature interaction: "the stamp-press"

Tapping an experiment row or TOC chapter is ONE orchestrated 250ms moment:
the ink-wash slides in (#5), the row nudges magnetically (#4), and the
status stamp settles from -3deg rotation to 0deg. Three sub-motions, one
user action, one perceived press. Nothing else on the page moves.

### `prefers-reduced-motion`

- All reveals/entrances degrade to **instant visible** (no opacity-0
  initial state applied at all when the media query matches; content is in
  the DOM final state server-side-equivalent, so JS-off also shows
  everything).
- Drawer opens instantly, no slide. Anchor travel uses `auto` scrolling.
- Magnetic + ink-wash disabled; rows get a static underline highlight.
- The static composition is complete and attractive on its own: stamps,
  rules, and numerals carry the design with zero animation.

---

## 4. Tokens

Three-layer discipline (primitive → semantic → component), shipped as CSS
variables in `assets/main-v4.css`.

**Primitives (6 named colors):**

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F6F1E7` | Page background (brief-pinned) |
| `--paper-deep` | `#EFE8D6` | Ink-wash fill, drawer surface, door panels |
| `--ink` | `#1C1A16` | Body text, rules, stamps (brief-pinned) |
| `--muted` | `#6B6257` | Glosses, dates, secondary text (brief-pinned) |
| `--red` | `#C23B22` | ENTRY Nº, margin rule, stamps, links, active TOC (brief-pinned) |
| `--rule` | `#D8D0BC` | Hairline ledger separators, taped-frame edges |

Semantic aliases: `--bg`, `--surface`, `--text`, `--text-muted`,
`--accent`, `--line`. Component tokens (e.g. `--stamp-border: var(--red)`)
defined only when a component needs them; no raw hex in components.

**Type roles (system stacks only, three faces, fixed roles):**

- **Display:** `Georgia, "Palatino Linotype", "Book Antiqua", "Times New Roman", serif`.
  Thesis statement, chapter titles, door titles. Nothing else.
- **Body:** `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`.
  17px minimum, line-height 1.65, max 68ch. Serif never does body text.
- **Mono:** `ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace`.
  ENTRY Nº labels, stamps, dates, EXP indexes, tags, the TOC button.
  11-13px, letter-spacing 0.08-0.12em.

**Spacing / line rules:**

- Base unit 8px; chapter padding-block 64px mobile / 96px desktop.
- Ruled paper: `repeating-linear-gradient` hairlines at 32px rhythm sit
  behind note bodies only (chapter 05), at 4% ink opacity, never under
  body text elsewhere.
- The red margin rule: 2px solid var(--red), full page height, left of the
  content column; ledger row separators are 1px var(--rule).
- Taped frame (photo placeholders): 1px var(--rule) border, two CSS "tape"
  corners (semi-transparent paper-deep rectangles, rotated ±2deg).

---

## 5. Layout (mobile-first)

- **Single column**, content max-width 40rem, margin-rule column fixed at
  left. 360px is the design width; desktop centers the column and adds the
  slim TOC rail at left. No multi-column grids that merely shrink.
- **Hero compactness (prologue, not a chapter):** identity stack (name,
  builder/landscaper/student line), the thinking statement set large in
  display serif, taped photo-frame placeholder, three CTAs
  (What I'm raising for / Work with me / Follow the notes). Target: the
  statement + first CTA visible without scrolling on a 740px-tall phone;
  hard cap 85vh. No full-viewport scroll trap.
- **Experiment ledger rows (not cards):** full-width rows separated by
  1px rules. Row anatomy, left to right: mono `EXP-03` (red) · project
  name (display serif, 20px) + status stamp (rotated, red border) ·
  one-line plain proof (body 16px, muted) · link (underlined, ink, no
  arrow glyph). Whole row is the tap target (≥48px height).
- **Notes list:** margin-column date stamp (`OCT 2026`, mono red) · note
  title (body, ink) · tag chips (mono 11px, rule-bordered, not filled).
  Highlights shelf: the same rows with a red margin tick, capped at 4.
- **Doors:** three stacked door panels (paper-deep background, 2px ink
  border, red roman numeral I/II/III), each: door title, one-sentence
  promise, one CTA button (full-width ≥52px, ink bg, paper text). The
  funder door carries visible open-question markers from the copy doc
  (styled as red margin notes, not missing content).
- **Photo slots:** framed intentional placeholders ("Photo: Darek picks
  the print" in mono, muted, inside the taped frame). Never lorem, never
  silent.

---

## 6. Anti-default review (frontend-design SKILL.md pass)

The brief pins warm-cream + serif + signal red (Darek's Logbook pick), the
#1 AI tell. The plan survives the check by executing it as an actual
logbook, and these revisions move everything else off the defaults:

1. **Tracked-out all-caps eyebrows on every heading: removed.** Labels are
   mono `Nº 02`-style ledger entries carrying real information (chapter
   position), and only chapter openers get one. No decorative eyebrow kit.
2. **Middle-dot meta strings (`A · B · C`): removed.** Ledger rows use
   labeled positions (EXP index, stamp, proof) instead of dot-joined tags.
3. **`→` appended to links: removed.** Links are underlined ink; rows show
   status stamps. The CTA verb says what happens ("Email me").
4. **SaaS-card grid for projects: rejected.** Full-width ledger rows with
   hairline separators; the information density reads as an index, not a
   template kit. No border-radius anywhere, no soft shadows.
5. **Fade-and-slide-up spam on every section: rejected.** Only chapter
   openers reveal (#1); everything else is either instantly visible or in
   the one staggered ledger list (#2).
6. **Generic serif-for-everything: rejected.** Serif is display-only;
   body is grotesque at 17px/1.65; mono does all labeling. Three fixed
   roles, no fourth face.
7. **Single-word accent color in headlines: rejected.** Color marks
   function (red = entry numbers, stamps, links, active TOC), never
   decorates words.
8. **Gradient washes as decoration: none.** The only background texture is
   the margin rule + ruled lines behind notes. Paper grain is a static
   inline SVG `feTurbulence` data-URI at ~3% opacity (see honest-skip).

---

## 7. Non-goals (explicit)

- No scroll-jacking, no preloaders, no parallax on body text, no pinned
  sections, no autoplay video.
- No emojis as UI icons. No invented numbers, dates, metrics, claims.
- No multi-field forms. No X embeds (link only, per resolved decision).
- No estate-sale mentions anywhere.
- No deploy, no domain purchase (Darek's calls, post pilot review).

### 60fps budget notes (mid Android)

- Motion is transform + opacity only; no layout thrash. Listeners are
  passive; IntersectionObserver drives reveals (no scroll handlers).
- Magnetic uses one rAF loop shared across hovered rows, fine-pointer only.
- The paper grain is a static SVG data-URI background; zero JS, zero
  repaint cost after first paint.
- **Honest-skip:** paper-design-shaders (`paper-texture.ts` is WebGL) and
  DavidHDev-canvas-ui (WebGL canvas effects) were evaluated and rejected:
  a WebGL context for a page texture breaks the JS-off requirement and the
  60fps-on-mid-Android budget, and REA browser capture is broken on this VM
  so heavy-canvas work cannot be visually verified here. Their *idea*
  (subtle paper grain) survives as the static SVG grain. Chapter dividers
  are hand-ruled SVG/CSS, not canvas. Named in the report as evaluated,
  not used, with the reason above.
- SKILL_CATALOG skim: no other motion/texture resource defends use here;
  `figma-mcp-server-guide` motion/shader entries assume Figma MCP and a
  build pipeline, both absent.

---

## 8. Builder handoff notes

- File target: single `index.html` + `resume.html` + `assets/main-v4.css` +
  `assets/main.js` (vanilla; JS only enhances, page complete without it).
- CSS selector discipline: chapter-scoped classes (`.ch-lab .ledger-row`),
  no bare `.section` vs element-selector collisions.
- Every [ASK DAREK]/[PHOTO]/[VERIFY] marker from copy-draft-v1.md becomes a
  framed visible placeholder. Copy is verbatim otherwise. Zero em dashes.
- Verification gate: builder statically verifies responsive rules
  (360px, no horizontal overflow, CTA buttons never wrap) and states
  plainly what was not rendered at phone width (per AGENTS.md limitation).

## 9. Open items the plan does not resolve

- Realm names are provisional; chapter titles key off them, rename is
  trivial but Darek has not confirmed.
- EXP numbering continuity: Andola is EXP-01 (ch. 02); Lab rows continue
  EXP-02..07 in copy order (Backseat, Bookvera, Dowser, Carolina Trade
  Sites, Deal Snipers, WildClash). Confirm with the coordinator that the
  builder keeps this mapping.
- Whether the Study's book/excerpt links (copy Q3) become rows in ch. 04
  or stay placeholders: depends on Darek's answer; plan assumes
  placeholders with open-question markers.
