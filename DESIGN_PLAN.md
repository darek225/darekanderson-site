# DESIGN PLAN: darekanderson.com ("the logbook")

**Status:** plan for builder. No code yet. Branch `design/plan`.
**Brief source:** Darek's own decisions, 2026-10-14 (palette, realms, logbook concept, X workflow, no webfonts that render-block).
**Copy source:** `~/workspace/goals/personal-portfolio-site-and-online-presence/files/copy-draft-v1.md` (draft v1; needs Builds and Philosophy sections added, see §7).
**Planning method:** two passes per `anthropics-skills/skills/frontend-design` (plan, then review against the brief and revise; revisions documented in §5). Tokens follow the three-layer discipline (primitive, semantic, component) from the ui-ux-pro-max design-system skill.
**Absolute rules honored:** no em dashes anywhere in this file or any sample copy; no lorem ipsum; no invented numbers or claims; only Andola is labeled an operating business.

---

## 1. Tokens

### Primitive layer (raw values; the only place hex appears)

```css
:root {
  /* color primitives */
  --color-paper:       #F6F1E7;  /* the page itself */
  --color-paper-deep:  #EDE3CE;  /* frames, clippings, inset blocks */
  --color-line:        #DACBA6;  /* ruled lines, hairline dividers */
  --color-ink:         #1C1A16;  /* primary text, solid CTA fill */
  --color-ink-soft:    #5B5245;  /* secondary text, captions */
  --color-signal:      #C23B22;  /* the one functional accent */

  /* type primitives */
  --font-display: "Iowan Old Style", "Palatino Linotype", Palatino, "Noto Serif", Georgia, serif;
  --font-body:    system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono:    ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace;

  /* scale primitives (mobile-first; desktop bumps in media queries) */
  --text-thesis: 2.25rem;   /* hero thinking statement */
  --text-h2:     1.625rem;  /* section heads */
  --text-h3:     1.25rem;   /* entry names */
  --text-body:   1.0625rem; /* 17px floor, brief-mandated */
  --text-small:  0.9375rem; /* secondary text */
  --text-label:  0.8125rem; /* mono labels, stamps, dates */

  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 40px;
  --space-5: 64px;
  --space-entry: 96px;      /* between log entries, mobile */
}
```

### Semantic layer (purpose aliases; components never touch primitives)

```css
:root {
  --bg:            var(--color-paper);
  --bg-alt:        var(--color-paper-deep);  /* inset blocks, frames, clippings */
  --desk:          var(--color-paper-deep);  /* desktop only: the "desk" behind the page */
  --text:          var(--color-ink);
  --text-muted:    var(--color-ink-soft);
  --accent:        var(--color-signal);      /* works: links, stamps, margin rule */
  --rule:          var(--color-line);        /* ruled lines, hairline separators */
  --link:          var(--color-signal);
}
```

### Component layer (component-specific; the only layer components read)

```css
:root {
  /* the red margin rule */
  --margin-rule:       var(--accent);
  --margin-rule-x:     14px;                 /* distance from left edge, mobile */
  --content-clear:     38px;                /* content padding-left clears the rule */

  /* status stamps (rubber-stamp treatment) */
  --stamp-border:      2px solid var(--accent);
  --stamp-text:        var(--accent);
  --stamp-tilt:        -1.2deg;
  --stamp-pad:         4px 10px;

  /* CTAs: solid ink primary, ruled ghost secondary */
  --cta-bg:            var(--color-ink);
  --cta-text:          var(--color-paper);
  --cta-ghost-border:  1.5px solid var(--color-ink);
  --cta-min-height:    48px;

  /* photo frame (taped snapshot) */
  --frame-bg:          var(--bg-alt);
  --frame-pad:         12px;
  --frame-tilt:        -1deg;

  /* open-question block ([ASK DAREK] markers) */
  --ask-border:        1.5px dashed var(--text-muted);

  /* ledger rows */
  --entry-rule:        1px solid var(--rule);

  /* desktop page column */
  --page-max:          760px;
}
```

Notes for the builder: six named colors, no more. `--color-signal` is the only hue with a job; `--color-line` and `--color-paper-deep` are warm neutrals that keep the paper feeling physical, not flat. If a new color is needed, it goes in as a primitive with a name and a documented reason, never as a stray hex.

---

## 2. Type: exact faces and fixed roles

Three faces, fixed roles, a fourth face nowhere on the site (main page or resume.html).

| Face | Stack | Role | Where |
|---|---|---|---|
| Display serif | `"Iowan Old Style", "Palatino Linotype", Palatino, "Noto Serif", Georgia, serif` | Thesis and heads | Hero thesis, section heads, entry names, note headlines, philosophy pieces. Sentence case, never caps. |
| Grotesque | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | Body | All body copy at 17px minimum, generous line-height (1.65). Buttons and UI text. |
| Monospace | `ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace` | Labels, statuses, dates | ENTRY Nº labels, status stamps, dates, tags, captions, specimen lines, colophon. The only place caps appear. |

Why these stacks: no render-blocking webfonts (brief-mandated). The serif stack leads with old-style faces (Iowan Old Style on Apple, Palatino on Windows, Noto Serif on Android, which is the phone Darek reviews on) so the page reads bookish and logbook-like on every device without downloading anything. Optional upgrade path (builder note, §7): self-host one OFL serif (e.g. Newsreader or Source Serif 4) as woff2 with `font-display: swap` and a preload, only if Darek wants a more distinctive cut; the stacks above stay as fallback either way.

Type scale rules: thesis `--text-thesis` at line-height 1.15; h2 at 1.2; h3 at 1.3; body at 1.65 with max line length under 80 characters (serif may run slightly longer). Mono labels at 13px minimum. Desktop (min-width 900px): thesis to 3rem, h2 to 2rem; everything else holds.

---

## 3. Layout

### Concept in one sentence

An open engineer's logbook lying on a desk: one ruled page, a red margin rule running the full height at the left, every section a numbered ENTRY with a mono specimen label in the margin, statuses applied as slightly tilted rubber stamps, and hand-drawn dividers between journal entries. Mobile is the full-bleed page; desktop is the same page centered on a slightly darker desk.

### Structural rules

- One column everywhere. No multi-column grids that merely shrink.
- Hard left alignment. Everything (heads, body, stamps, buttons) aligns to the content edge that clears the red margin rule. The only elements allowed to sit askew are the stamps and the taped photo frame. The colophon is the one centered block on the page.
- Sections are ENTRIES, numbered in order (ENTRY Nº 01 through 09, resume as a separate page). The number appears in mono in the margin beside the section head, not as a centered eyebrow above it. This is a real sequence (a log), which is the only justification the frontend-design skill accepts for numbering.
- After the hero, an INDEX block: a mono table of contents ("INDEX, entries on this page") with anchor links to each entry. This is the navigation model. No sticky header, no hamburger, no SaaS nav chrome. A tiny "back to index" mono link closes each entry.
- The Experiments index is a ledger: full-width rows separated by hairline rules, not cards. Each row: mono specimen line (EXP-01, date or date range), entry name in serif h3, status stamp inline, one-line proof in body text, link line in mono. Realms (Workshop / Lab / Study, names provisional) are ruled sub-blocks inside the one Experiments entry, each with a mono realm label.
- Builds are three longer entries inside ENTRY Nº 04: ruled sub-blocks with stamp, date range, 2 to 4 paragraphs, and a "receipts" mono list of links (repo, live URL, write-up). Photos optional, taped-frame treatment.
- Notes are journal entries separated by a hand-drawn wavy divider (inline SVG, decorative, aria-hidden). Each note: mono date plus FIELD NOTE Nº, serif headline, body, mono tags footer. The LinkedIn subsection renders official LinkedIn embed iframes as "pasted clippings": each iframe inside a paper-deep box with a mono caption ("Clipped from LinkedIn, <date>"), link fallback beneath. No X embeds (brief).
- Three Doors is three ruled blocks labeled DOOR 1, DOOR 2, DOOR 3 in mono, each with a serif head, one or two sentences, and exactly one action (a 48px button or a mailto link styled as one). Funders' door carries the "what I'm raising for" copy inside a framed open-question block until Darek writes it.
- Contact + colophon: mono contact block (name, town, email link, X link once the handle is known), then the colophon paragraph in body text naming the palette hexes and the typefaces, then the centered colophon sign-off.

### ASCII wireframes (360px design width)

Mobile hero (ENTRY Nº 01):

```
+----------------------------------+
| (red rule)  ENTRY Nº 01, HERO    |
||                                 |
||  Darek Anderson                 |
||  I turn ideas into things       |
||  that exist.                    |
||  (serif thesis, 36px)           |
||                                 |
||  +---------------------------+  |
||  |  [taped photo, -1deg]     |  |
||  |  FIG. 01, caption in mono |  |
||  +---------------------------+  |
||                                 |
||  I am a 20-year-old builder     |
||  running a real landscaping     |
||  business and shipping real     |
||  software, with AI as the       |
||  leverage. (body 17px)          |
||                                 |
||  [ What I am raising for ]      |
||  [ Follow on X ]                |
||  (48px buttons, full width      |
||   on mobile, stacked)           |
||                                 |
||  INDEX, entries on this page    |
||  02 The Hypothesis ........ #   |
||  03 The Experiments ....... #   |
||  04 Builds ................ #   |
||  05 Philosophy ............ #   |
||  06 Notes ................. #   |
||  07 The Researcher ........ #   |
||  08 Three Doors ........... #   |
||  09 Contact and colophon .. #   |
||  10 Resume ................ html|
+----------------------------------+
```

Experiments index entry (ENTRY Nº 03), one ledger row:

```
||  ENTRY Nº 03, THE EXPERIMENTS   |
||                                 |
||  REALM ONE, THE WORKSHOP        |
||  (mono label; realm names       |
||   provisional)                  |
||  +-------------------------------+
||  | EXP-01 · filed 2025            |  (mono specimen line)
||  | Andola Landscape Services      |  (serif h3)
||  | [OPERATING BUSINESS]           |  (red stamp, tilted)
||  | Commercial and residential     |
||  | landscaping in the Charlotte   |
||  | area. One-line proof here.     |
||  | Site: andolalandscaping.com    |  (mono link line)
||  +-------------------------------+  (hairline rule)
||  | EXP-02 · filed 2026            |
||  | Backseat                       |
||  | [LIVE, OPEN SOURCE]            |
||  | ...                            |
```

Notes feed (ENTRY Nº 06), with divider and LinkedIn clippings subsection:

```
||  ENTRY Nº 06, NOTES             |
||                                 |
||  2026-10-08 · FIELD NOTE Nº 07  |  (mono specimen line)
||  If the daemon can die          |
||  silently, it will.             |  (serif headline)
||  Body text, 17px grotesque,     |
||  the lesson stated plainly.     |
||  #shipping #systems             |  (mono tags)
||                                 |
||  ~~~~~~~~~ wavy divider ~~~~~~~ |  (hand-drawn SVG rule)
||                                 |
||  2026-10-01 · FIELD NOTE Nº 06  |
||  Vercel does not trust my       |
||  AI's commits.                  |
||  ...                            |
||                                 |
||  FROM LINKEDIN, CLIPPED         |  (mono subsection label)
||  +---------------------------+  |
||  | [LinkedIn embed iframe,   |  |
||  |  lazy-loaded]             |  |
||  | Clipped from LinkedIn,    |  |  (mono caption)
||  | <date>. Full post: link   |  |
||  +---------------------------+  |
```

### Alignment guidance

Left edge is law. The red margin rule is the page's spine; content clears it by `--content-clear`. Stamps break the grid on purpose (tilted, inline with entry names). The photo frame and clippings are inset blocks (paper-deep) with padding, still left-aligned. Nothing is centered except the final colophon line. On desktop the page column centers on the desk, and the margin rule lives inside the column at its left edge, so the logbook metaphor survives the adaptation.

---

## 4. Principles: what makes this page unique

1. The page is a logbook, not a landing page. Entries have numbers, statuses are stamps, dates are specimen labels. A visitor reads it the way they would read someone's lab notebook, newest thinking up front, index at the front.
2. The red does work. Signal red marks links, live statuses, stamps, and the margin rule. It never appears as decoration. If a red element does not carry information, it gets cut.
3. Index rows, not cards. The experiments ledger, the builds, the notes, and the doors are ruled rows and blocks. No rounded SaaS cards, no soft shadows, no gradient washes anywhere.
4. The grid is strict so the stamps can misbehave. Everything aligns to one left edge; the only tilted things on the page are the rubber stamps and the taped photo. Restraint everywhere else is what makes those two moments land.
5. Type does the talking. Three faces with fixed jobs and a written scale. Headlines are sentence case serif; caps exist only in mono labels and stamps, which is the logbook's own vernacular, not a design-system eyebrow.
6. Honest vernacular. Statuses use Darek's own words: OPERATING BUSINESS, IN DEVELOPMENT, LIVE PIPELINE, PROOF OF CONCEPT, LIVE. Only Andola carries OPERATING BUSINESS. Nothing is ever relabeled to sound further along.
7. Static is a feature. The page must read beautifully with JavaScript disabled and with `prefers-reduced-motion` on. Motion is limited to reveal-on-enter, transform-only, and it is the garnish, never the meal.

---

## 5. Review against the brief: what I revised from first instinct, and why

Per the frontend-design skill's two-pass process, the first plan was reviewed against the pinned brief and these parts were revised:

1. **Hero composition.** First instinct: centered hero, photo as a banner above the name, thesis underneath, proof chips in a row. Revised: the brief orders name, then the thesis line "I turn ideas into things that exist", and the logbook concept wants artifacts, not banners. The photo becomes a taped snapshot (tilted frame, mono FIG. caption) inside the flow, left-aligned like everything else. It reads as something pasted into a logbook, which is more distinctive and more honest than a hero banner.
2. **Section eyebrows.** First instinct: tracked-out mono ALL-CAPS labels above every section head (e.g. "THE EXPERIMENTS"). Revised: the skill names tracked-out all-caps eyebrows above every heading as one of the commonest AI tells. The logbook already has a labeling system, the red margin rule plus a mono ENTRY Nº in the margin, so the decorative eyebrow was redundant. Hierarchy now comes from the margin rule, the ENTRY Nº, and the serif head itself. Caps survive only where the brief mandates them: stamps and specimen labels.
3. **Numbered sections.** First instinct: drop the 01/02/03 markers as decoration. The skill says numbering is only appropriate for real sequences. Kept, because a logbook's entries genuinely are a sequence, and documented that reasoning here instead of treating numbers as ornament.
4. **Realms as cards.** First instinct: three realm cards with icons (workshop, flask, book). Revised: identical rounded cards with soft shadows are on the skill's tell list, and the brief explicitly bans them. Realms are now ruled sub-blocks inside the single Experiments entry, distinguished by mono labels and hairline rules, in the ledger's own language.
5. **Notes as cards with tag pills.** First instinct: card grid with pill tags. Revised: journal entries separated by a hand-drawn wavy divider, tags as a plain mono footer line. The LinkedIn subsection uses the "pasted clipping" treatment (paper-deep inset box, mono caption, link fallback) instead of bare iframes, which also degrades gracefully if an embed fails.
6. **Three Doors as pricing-style cards.** First instinct: three feature cards with checkmark lists. Revised: three ruled blocks labeled DOOR 1/2/3 with exactly one action each, which matches the brief's "one primary conversion per visitor type" and avoids the pricing-table silhouette entirely.
7. **Headline accent coloring.** First instinct (caught before writing): accenting a word in the thesis in red for punch. Cut. The brief bans single-word accent coloring in headlines, and the thesis reads stronger in solid ink.
8. **Em dashes in sample copy.** Every sample line in this plan was checked: commas, colons, and periods do the work. The [ASK DAREK] sample wording and all wireframe captions follow the same rule.
9. **Palette drift.** First instinct: warm up the ruled lines to a blue-grey like a real notebook. Cut. The brief pins paper, ink, and signal red; the ruled lines stay a warm neutral (`--color-line`) so no second accent color sneaks in. The one permitted desktop addition is `--desk`, which is just `--color-paper-deep` reused, not a new color.

---

## 6. Sections and their build notes (in brief order)

1. **Hero (ENTRY Nº 01):** name, thesis, taped photo frame (FIG. 01), short intro paragraph, two 48px CTAs ("What I am raising for" to #door-1, "Follow on X" to the X URL once the handle is known), then the INDEX block.
2. **The Hypothesis (ENTRY Nº 02):** thesis paragraphs from copy draft v1 §2. Serif pull line allowed for the ratchet sentence, set as a ruled inset block, not as an accent-colored slogan.
3. **The Experiments (ENTRY Nº 03):** ledger rows for all 7 projects in the three realms, stamps per §4 principle 6. Links: live URL or GitHub where public. Statuses confirmed by Darek before publish; copy draft v1 §3 has them.
4. **Builds (ENTRY Nº 04):** two or three deeper stories. Suggested: Andola (the operating business), Backseat (flagship open source), and one pipeline (Bookvera or WildClash, Darek's pick). Each: stamp, date range, 2 to 4 paragraphs, mono "receipts" link list, optional taped photo. Copy does not exist yet (see §7).
5. **Philosophy (ENTRY Nº 05):** one or two short pieces from his thesis (dreamers vs builders; the ratchet). Journal-entry treatment, longer than field notes. Copy does not exist yet (see §7).
6. **Notes (ENTRY Nº 06):** the three seed field notes from copy draft v1 §4, newest first, then the LinkedIn clippings subsection (official embed iframes, lazy-loaded, captioned, link fallback). RSS link in mono.
7. **The Researcher (ENTRY Nº 07):** the maker arc from copy draft v1 §5. Optional second photo, same taped-frame treatment, only if Darek picks one.
8. **Three Doors (ENTRY Nº 08):** DOOR 1 funders (the "what I'm raising for" block ships as a framed open-question until Darek writes it in his words), DOOR 2 employers and partners (resume link plus one mailto), DOOR 3 audience (X follow plus RSS). One action each, no forms.
9. **Contact + colophon (ENTRY Nº 09):** mono contact block, colophon naming the hexes and faces, centered sign-off. X handle pending (open question).
10. **resume.html:** separate page, same token system, print-flattened (see §7).

---

## 7. Notes for the builder

### Photo placeholder treatment

Photos ship as taped snapshots: a `figure.photo-frame` with paper-deep background, 12px padding, the image tilted -1deg, and a `figcaption` in mono ("FIG. 01, Darek, [caption]"). Images get `width` and `height` attributes (no layout shift), `loading="lazy"` below the fold, and real `alt` text. Real photos only, no AI portraits, no stock. If Darek has not picked a photo yet, the frame still ships: a ruled box with a dashed border containing the mono line "[PHOTO: real photo chosen by Darek, not an AI portrait]". It must read as an intentional empty frame in the logbook, never as a broken image. The hero uses FIG. 01; The Researcher optionally uses FIG. 02.

### [ASK DAREK] marker treatment

Never bare "TBD" text in the flow. Every open question ships as a framed block: dashed-border inset (`--ask-border`), a mono label "OPEN QUESTION FOR DAREK", the question in grotesque, and where relevant what is known so far. This makes the placeholder visibly intentional to any visitor, and gives Darek a punch list he can answer in place. On resume.html, unanswered items are omitted entirely instead (no open questions on a resume; the page simply leaves out what is not confirmed).

### LinkedIn iframe embed pattern

Use LinkedIn's official post embeds only (the `https://www.linkedin.com/embed/feed/update/...` iframe form), one per clipping box: `<iframe>` with `width="100%"`, the embed's suggested height, `loading="lazy"`, a descriptive `title`, inside a paper-deep `.clipping` box with a mono caption ("Clipped from LinkedIn, <date>") and a plain link to the post beneath as fallback. Iframes get `sandbox` attributes appropriate to LinkedIn's embed requirements and must not break the no-horizontal-overflow rule (max-width 100%). If an embed fails to load, the caption and link still carry the entry. No X embeds in v1 (brief).

### Print CSS notes for resume.html

Single source of truth: `resume.html` is the resume, and the downloadable PDF is that page printed. The print stylesheet: `@page` with sensible margins; force white background and near-black text in print (paper texture is screen-only); hide stamps' rotation (flatten to 0deg) and any interactive buttons; expand important links with `a[href]:after { content: " (" attr(href) ")" }` scoped to the contact block and key entries; `break-inside: avoid` on each job entry; one screen stylesheet plus one print stylesheet, no separate PDF file to drift. A "Print / save as PDF" button calls `window.print()` and is hidden in print. Draft content is copy draft v1 §8; unanswered items (CPCC program, X handle, funder terms) are omitted, not shown as questions.

### Motion and robustness

Reveal-on-enter only: an IntersectionObserver adds `.in-view`, animating opacity and translateY (transform-only, 300ms, once). `prefers-reduced-motion: reduce` disables all of it, and the page is fully composed without JavaScript. Touch targets minimum 48px. `overflow-x: hidden` on the body as a backstop so tilted stamps can never cause horizontal scroll at 360px. CTA labels must not wrap to two lines on a 360px screen (keep them short; test with the real words).

### Copy gaps the builder should not fill

Copy draft v1 covers the hero, hypothesis, experiments, notes, researcher, doors, contact, and resume, but the pinned brief's section order adds two sections with no copy yet: Builds (2 to 3 deeper project stories) and Philosophy (1 to 2 short pieces). The builder should scaffold those entries with open-question blocks and wait for Darek's words or the copywriter's draft. Do not invent project claims, dates, or numbers to fill them. The funders' "what I'm raising for" paragraph likewise waits on Darek (open question 4 in the copy draft).
