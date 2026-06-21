# Ecom-OS Design System

## 1. Product Feel

Ecom-OS is a dense ecommerce operating system for daily operational work. The interface should feel calm, native, and immediate: movement clarifies state changes, preserves context, and gives controls tactile feedback without turning the product into a marketing surface.

## 2. Foundations

- Dark mode is the reference aesthetic, with full light-mode parity.
- Surfaces use neutral OKLCH tokens from `app/globals.css`.
- Semantic color communicates status only: success, warning, critical, info, agent, and accent.
- Typography uses Geist Sans and Geist Mono through Next font variables.
- Numeric operational values use tabular figures.
- Radius follows the existing shadcn `new-york` scale: 6-10px for normal controls and panels.

## 3. Layout

- Desktop uses a stable left sidebar and an inset bordered workspace frame.
- The global header remains compact and stable across routes.
- The page workspace owns vertical scrolling.
- Tables and operational workspaces may stay fluid; forms and document-like surfaces may be constrained.
- Mobile navigation and record investigation use sheets rather than shrinking desktop layouts.

## 4. Motion

Motion is a product primitive. It must be tokenized, interruptible where possible, and disabled through `prefers-reduced-motion`.

### Timing

- Instant feedback: `80ms`
- Fast controls: `120ms`
- Overlay enter/exit: `180ms`
- Panel/sheet movement: `240ms`
- Route transitions: `260ms`

### Easing

- Standard/native: `cubic-bezier(0.2, 0, 0, 1)`
- Enter: `cubic-bezier(0.16, 1, 0.3, 1)`
- Exit: `cubic-bezier(0.4, 0, 1, 1)`

### Rules

- Animate `transform`, `opacity`, and `filter` by default.
- Sidebar submenu disclosure may animate height using Radix measured height variables.
- Buttons press to `scale(0.96)`.
- Page transitions use native View Transitions where supported.
- Enter motion may use subtle blur and `translateY`; exit motion must be shorter and quieter.
- Never use `transition: all`.
- Do not animate layout properties except controlled disclosure height.

## 5. Components

- `Button`: tactile press scale, explicit transition properties, no layout shift.
- `DropdownMenu`, `Popover`, `Tooltip`, `Select`: origin-aware fade/scale/side movement using Radix state attributes.
- `Dialog`: soft overlay fade plus centered zoom/blur, short exit.
- `Sheet` and mobile navigation: directional slide with stable overlay fade.
- `Collapsible`: measured height open/close for sidebar subpages and detail disclosures.
- Page workspace: route changes animate through native View Transitions.

## 6. States

Every core surface supports populated, loading, empty, stale, partial, error, and read-only states. Motion must not hide state changes or delay critical feedback. Reduced-motion users keep state changes but receive near-instant transitions.

## 7. Accessibility And Performance

- `prefers-reduced-motion` disables nonessential movement.
- Focus rings remain visible and are never replaced by animation alone.
- Motion cannot be the only signal for status, selection, or error.
- Animations must stay compositor-friendly unless using Radix disclosure height.
- `will-change` is used only on overlay/content elements that animate transform or opacity.
