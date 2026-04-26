# Portfolio — Claude Guidelines

## Stack
Next.js 16 App Router · Payload CMS · PostgreSQL · GSAP 3 · Framer Motion · Tailwind CSS · Three.js

## Styling rules
- **DO** put all portfolio CSS in `src/app/(frontend)/styles.css` — no separate SCSS modules
- **DO** use Tailwind classes for layout/spacing/flex/grid in JSX; reserve custom `.km-*` classes for complex selectors (pseudo-elements, keyframes, CSS vars, hover chains)
- **DO** use the design token CSS vars: `--accent`, `--bg`, `--bg-1`, `--bg-2`, `--surface`, `--border`, `--text`, `--text-dim`, `--text-mute`, `--accent-glow`, `--shadow-deep`
- **DON'T** hardcode colors — always use the tokens above; both light (espresso) and dark themes must work
- **DON'T** create new SCSS module files for portfolio components

## Animation rules
- **DO** use GSAP for complex tweening (color shifts, staggered timelines); use `gsap.to()` with an `onUpdate` callback to drive CSS vars or inline styles
- **DO** use vanilla `requestAnimationFrame` loops for scroll-driven per-frame math (the projects deck already does this — keep it that way)
- **DON'T** use GSAP ScrollTrigger — the project deliberately uses sticky + RAF instead
- **DON'T** add `prefers-reduced-motion` overrides unless the animation is purely decorative with no information value
- **DO** `cancelAnimationFrame` and clean up all event listeners in `useEffect` return

## Component rules
- **DO** mark interactive/animated components `'use client'`
- **DO** use `next/dynamic(() => import(...), { ssr: false })` for any component that touches `window`, canvas, or 3D (SkillSphere, particle canvas, etc.)
- **DON'T** import GSAP or browser APIs at the top level of a server component
- **DO** keep server components thin — fetch data, pass as props to the `*Client.tsx` sibling

## Class naming
- Prefix all custom CSS classes with `km-` (e.g. `km-skill-pill`, `km-projects-nav-dot`)
- Block modifier pattern: `km-block--variant` for color/state variants

## Projects deck specifics
- The stacked card scroll effect uses `position: sticky` + RAF — don't replace with GSAP ScrollTrigger
- Active card = last pin whose next sibling has `getBoundingClientRect().top > 1`
- Jump to card: `window.scrollTo({ top: deckTop + idx * window.innerHeight })`
- Background tint: GSAP-tween a `{ r, g, b }` proxy, write `rgba(r,g,b,0.06)` via `onUpdate`
- Entrance glow: set `--card-glow-color` CSS var on the card, toggle `km-card-glow-in` class (remove → reflow → add)

## Skills section specifics
- Skill grouping is keyword-based (`assignGroup`) — add keywords to `SKILL_GROUPS` array in `Component.tsx`, not a CMS field
- SkillSphere uses Fibonacci sphere distribution + manual Z-rotation math for depth (opacity, font-size, z-index) — don't swap for a library
- Category color variants use `--cat-hue: r, g, b` CSS variable pattern so one `rgba()` rule covers all states

## Do / Don't summary
| Do | Don't |
|---|---|
| Tailwind for layout | Tailwind for complex hover/pseudo states |
| GSAP for tweened values | GSAP ScrollTrigger |
| RAF loop for scroll math | `setInterval` for animation |
| `next/dynamic ssr:false` for browser-only | SSR a canvas or window-dependent component |
| CSS vars for theming | Hardcoded hex colors in CSS |
| One `styles.css` | New SCSS modules |
| Clean up RAF + listeners in useEffect | Leak scroll listeners |
