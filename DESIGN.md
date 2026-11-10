# FMData Design System

## Direction

An editorial, data-led interface: quiet neutral framing gives way to luminous color only where information needs emphasis. The visual reference contributes its airy composition, strong black typography, violet/blue/coral surfaces, and diffused light. The showcase uses its own layout rather than reproducing the referenced marketing page or device screens.

The reference font is unknown. The implementation uses the project’s existing Geist Sans and Geist Mono files from `next/font`; this is a deliberate, available substitution.

## Color and surfaces

`src/app/globals.css` is the source of truth. Semantic variables change with `[data-theme="dark"]`; component code should use semantic Tailwind utilities or surface classes instead of literal colors.

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#f1f0f0` | `#17161b` |
| Main text | `#19181b` | `#f4f2f5` |
| Card | `#ffffff` | `#222027` |
| Muted text | `#66636a` | `#bbb6c1` |
| Primary | `#6551bd` | `#b4a3ff` |
| Accent | `#ec6686` | `#f18ba2` |

Expressive ramps are violet (`--violet-*`), blue (`--blue-*`), and coral (`--coral-*`). Semantic foreground/background pairs use `--success`, `--warning`, `--error`, `--info` and their `-soft` surfaces. Gradients are reserved for the glass, income, and expense card treatments. Glass uses `--glass-fill`, `--glass-border`, and `--glass-blur`; provide an opaque fallback for reduced transparency and honor high-contrast preferences.

## Type, spacing, and shape

- **Display and interface:** Geist Sans, `--font-role-display` / `--font-role-body`.
- **Measurement:** Geist Mono, `--font-role-data`; tabular numerals are enabled globally.
- **Scale:** `--type-display-xl`, `--type-display-lg`, `--type-heading-*`, `--type-body*`, `--type-label`, `--type-caption`, and `--type-metric*`.
- **Spacing:** `--space-0` through `--space-20`, on a 4px base. Tailwind spacing utilities map to these values where defined.
- **Radii:** `--ds-radius-sm` through `--ds-radius-2xl`, with `--ds-radius-full` for compact controls.
- **Depth:** use the surface border for neutral cards, or `--ds-shadow-soft` / `--ds-shadow-float` for lifted surfaces. Avoid applying both a strong border and shadow to the same card.
- **Motion and layers:** `--duration-*`, `--ease-standard`, and `--z-*` define timing and stacking conventions. Respect reduced motion.

## Tailwind integration

Tailwind CSS 4 is configured in CSS. The `@theme inline` block maps custom properties into utilities such as `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `text-heading-xl`, and `shadow-soft`. Do not add `tailwind.config.*` for these tokens or mirror values in TypeScript.

## Components

Reusable components live in `src/components/ui/`. `cn()` composes classes and resolves Tailwind conflicts; CVA handles meaningful variants.

- `Card` supports `neutral`, `glass`, `income`, and `expense` treatments plus `sm`, `md`, `lg`, and `none` padding. Compose with `CardHeader`, `CardTitle`, `CardDescription`, and `CardContent`.
- `Button` supports `primary`, `secondary`, `outline`, `ghost`, and `dark`; sizes are `sm`, `md`, `lg`, and `icon`.
- `Badge` supports neutral and semantic success, warning, error, and information states.
- Form controls use native input, textarea, select, and checkbox behavior. `Switch` exposes a labeled switch state.
- Tabs provide arrow-key navigation. Tooltip content appears on hover and keyboard focus. Dialog uses the native modal dialog element. Dropdown navigation uses a native disclosure.
- Icons use the installed Solar linear SVG set. Icon-only controls require an accessible name.

## Responsive and accessibility rules

The page uses one document order, a centered fluid container, and content-first grids that collapse to one column on narrow screens. Keep controls at least 44px tall, body copy at least 16px, visible focus, and information independent of color. Maintain readable contrast on gradient surfaces and preserve a solid-surface path when transparency is reduced.

## Showcase

Visit `/design-system` to inspect color, typography, spacing, radii, shadows, gradients, glass, card treatments, and component states. The theme switch is scoped to the showcase; sample values are illustrative and do not imply product behavior.
