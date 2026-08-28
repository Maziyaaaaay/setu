# Frontend — implemented design system (overrides MASTER.md)

This is what actually shipped in `site/`. Two deliberate deviations from MASTER.md,
both to serve the brief ("premium, calm, trustworthy") while keeping Setu's identity.

## Deviation 1 — colour: keep the teal-green brand, not navy

MASTER recommends high-contrast navy/blue. We keep Setu's teal-green ("setu" = bridge;
calmer, more distinct than generic gov navy) and apply the *discipline* of the
recommendation — every foreground/background pair meets AA, most meet AAA; all colour
is semantic tokens, never raw hex in markup.

| Token | Hex | Use |
|---|---|---|
| `--teal-700` #0a5f57 | primary action, links |
| `--teal-800` #084b46 | action hover, deep gradient stop |
| `--teal-900` #06373c | darkest surface (`.objective`), wordmark |
| `--ink` #0e211f | headings, strong text |
| `--body` #26403c | paragraphs |
| `--muted` #4b5e5b | secondary text (AA on `--bg`) |
| `--faint` #69807c | least important, ≥13px only |
| `--bg` #f5f8f6 / `--surface` #fff / `--surface-2` #eef4f1 | grounds |
| `--gold-700` #9c5c0b / `--gold-050` #fdf3e3 | "next step" / attention |
| `--red-700` #b3372f / `--red-050` #fdeeec | alerts only |
| `--ring` #0d7a86 | focus |

## Deviation 2 — type: Fraunces + Lexend

MASTER recommends Lexend + Source Sans 3. We keep **Lexend** for all UI/body (it is
purpose-built for reading proficiency — ideal for the audience) and add **Fraunces**
(variable, optical sizing) for display headings only — the serif gives premium
editorial warmth a single sans lacks. Google Fonts, `display=swap`, full system
fallback stacks. `--font-display` / `--font-ui`.

## Kept from MASTER

- Style: **Accessible & Ethical**. WCAG-first.
- Motion 5/10: staggered screen-in (`rise`), checkbox spring, pulsing "now" step,
  header shadow on scroll — all inside `@media (prefers-reduced-motion: no-preference)`.
- Density 4/10: spacing scale `--s1..--s9` (4→56px). Cards `padding: --s5`.
- Icons: inline SVG only (stroke 1.8–2.2, `currentColor`), defined in `ICONS` in
  `app.js`. No unicode/emoji glyphs anywhere.
- Radii `--r1..--r4` (10→26), 3-tier elevation `--e1..--e3`.
- Touch targets ≥44px; visible `:focus-visible` rings; `<label for>`/`id` pairs;
  heading focus + scroll-reset on every screen via a MutationObserver.

## Layout

- Single column, `--page-max: 440px`.
- Mobile: full-bleed, sticky bottom nav, `env(safe-area-inset-*)` padding.
- ≥600px: rounded app frame (`--r4`, `--e3`, 1px border) on an ambient radial-gradient
  background (`.bg`).
- Bottom nav only on Home / My plan / About; the task flow uses back links + a
  5-segment progress bar (`.steps`).
