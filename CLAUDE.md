# Portfolio Guidelines

**Stack:** Next.js 16 App Router · Payload CMS · PostgreSQL · GSAP 3 · Framer Motion · Tailwind CSS · Three.js

### Styling
- All CSS → `src/app/(frontend)/styles.css`; no SCSS modules
- Tailwind for layout/spacing/flex/grid; `.km-*` classes for pseudo-elements, keyframes, hover chains
- Tokens only: `--accent --bg --bg-1 --bg-2 --surface --border --text --text-dim --text-mute --accent-glow --shadow-deep`; no hardcoded colors; light+dark must both work

## Animation
- GSAP `gsap.to()` + `onUpdate` for tweened values (color shifts, staggered timelines)
- Vanilla RAF for scroll-driven per-frame math — no `setInterval`, no GSAP ScrollTrigger
- Always `cancelAnimationFrame` + remove listeners in `useEffect` return

## Components
- `'use client'` on interactive/animated components
- `next/dynamic(() => import(...), { ssr: false })` for anything touching `window`, canvas, or 3D
- Server components: fetch only, pass props to `*Client.tsx` sibling; no GSAP/browser imports at top level

## Naming
- Custom classes: `km-` prefix (e.g. `km-skill-pill`); variants: `km-block--variant`

## Projects deck
- Scroll effect: `position: sticky` + RAF — keep as-is, no ScrollTrigger
- Active card: last pin whose next sibling `.getBoundingClientRect().top > 1`
- Jump: `window.scrollTo({ top: deckTop + idx * innerHeight })`
- BG tint: GSAP-tween `{r,g,b}` proxy → `rgba(r,g,b,0.06)` via `onUpdate`
- Entrance glow: set `--card-glow-color`, remove → reflow → add `km-card-glow-in`

## Skills section
- Grouping: keyword-based `assignGroup` — edit `SKILL_GROUPS` in `Component.tsx`, not CMS
- SkillSphere: Fibonacci sphere + manual Z-rotation for depth (opacity/font-size/z-index) — no library swap
- Category colors: `--cat-hue: r, g, b` pattern with one `rgba()` rule covering all states

## Do / Don't
| Do | Don't |
|---|---|
| Tailwind for layout | Tailwind for complex hover/pseudo states |
| GSAP for tweened values | GSAP ScrollTrigger |
| RAF loop for scroll math | `setInterval` for animation |
| `next/dynamic ssr:false` for browser-only | SSR a canvas or window-dependent component |
| CSS vars for theming | Hardcoded hex colors in CSS |
| One `styles.css` | New SCSS modules |
| Clean up RAF + listeners in useEffect | Leak scroll listeners |
