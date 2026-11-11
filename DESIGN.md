# FMData Design System

FMData uses [Glaze](https://design.how/systems/glaze): compact black and white for AI products. Ink and paper, greys as ink at alphas, colour only for status, and glass only on the one action a group leads with; its secondaries stay flat.

## Setup

- `src/components/glaze/styles.css` is imported once in `src/app/layout.tsx`; `<body>` carries the `glaze` class and wraps the app in `GlazePortalProvider` (`src/lib/glaze/portal.ts`), so overlays keep the tokens.
- `src/components/glaze/ui/` holds the installed components, `src/components/glaze/icon.tsx` the Phosphor icon set, and `tokens.css`/`base.css` the tokens and the scoped base layer.
- Add a component with `npx shadcn@latest add https://design.how/r/glaze/<name>.json`; read `https://design.how/systems/glaze/components/<name>.md` before using it. Do not hand-build what Glaze ships.
- Dark theme: put `data-theme="dark"` on `.glaze` or an ancestor. It does not follow the system setting on its own.
- Lint: `npx eslint -c glaze.eslint.config.mjs .` must report nothing. The full rules live in `.agents/skills/glaze/SKILL.md`.
- `/design-system` renders the tokens and the components in use, as a specimen page.

## Rules

Use the Glaze roles (`text-text-1`, `bg-paper`, `border-line-faint`, `type-title`, ...); never a raw colour, size or font. No shadows, gradients, blur, capitals, emoji or eyebrows. One primary (glass) button per action group; every other action is a flat secondary. A card is `shell`/`panel`; an overlay is paper with a 1px ring. A missing token or component is a gap: stop and say so instead of inventing one.

Geist is loaded through `next/font` and mapped onto Glaze's `--font-sans`/`--font-mono` in `src/app/globals.css`.
