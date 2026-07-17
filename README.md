# react-overflow-toolbar

A headless React hook + component for toolbars that automatically collapse overflowing items into a "more" menu, based on the available container width.

## Packages

This is a pnpm monorepo:

- [`packages/core`](packages/core) — the `react-overflow-toolbar` library (the published package)
- [`packages/example`](packages/example) — a Vite app demonstrating the toolbar with plain HTML, Tailwind, and MUI styling

## Installation

```bash
pnpm add react-overflow-toolbar
```

## Usage

```tsx
import { OverflowToolbar } from "react-overflow-toolbar";
import type { IToolbarItem } from "react-overflow-toolbar";

const items: IToolbarItem[] = [
  { id: "save", label: "Save", priority: 2, onClick: (item) => console.log(item.label) },
  { id: "share", label: "Share", priority: 1, onClick: (item) => console.log(item.label) },
  { id: "print", label: "Print", priority: 0, onClick: (item) => console.log(item.label) },
];

<OverflowToolbar
  items={items}
  renderItem={(item, meta) => (
    <button ref={meta.measureRef} onClick={() => item.onClick?.(item)} disabled={item.disabled}>
      {item.label}
    </button>
  )}
/>;
```

Items that don't fit the container width are moved into an overflow menu, ordered by ascending `priority` (lowest priority overflows first).

For full control over layout and measurement without any built-in markup, use the underlying hook directly:

```tsx
import { useOverflowToolbar } from "react-overflow-toolbar";

const { containerRef, measureRef, visibleItems, overflowItems, isMeasuring } = useOverflowToolbar({
  items,
});
```

## API

### `<OverflowToolbar />` props

| Prop | Type | Description |
| --- | --- | --- |
| `items` | `IToolbarItem[]` | Items to render |
| `gap` | `number` | Gap between items in px (default `8`) |
| `overflowTriggerWidth` | `number` | Reserved width for the overflow trigger; measured automatically if omitted |
| `className` / `itemsContainerClassName` | `string` | Class names for the root and items container |
| `renderItem` | `(item, meta) => ReactNode` | Renders a visible toolbar item |
| `renderOverflowTrigger` | `(meta) => ReactNode` | Renders the "more" trigger button |
| `renderOverflowMenu` | `(meta) => ReactNode` | Renders the overflow menu (e.g. swap in an MUI `Menu`) |
| `renderOverflowItem` | `(item, meta) => ReactNode` | Renders an item inside the default overflow menu |
| `onOverflowChange` | `(overflowItems) => void` | Called when the set of overflowing items changes |

### `IToolbarItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique item id |
| `label` | `string` | Display label |
| `priority` | `number` | Higher priority items stay visible longer (defaults to array index) |
| `disabled` | `boolean` | Disables the item |
| `variant` | `"default" \| "primary" \| "danger"` | Visual variant, left to `renderItem` to interpret |
| `onClick` | `(item) => void` | Click handler |
| `content` | `(meta) => ReactNode` | Renders a fully custom item (e.g. a `TextField`) instead of `renderItem` |

## Development

```bash
pnpm install
pnpm build            # builds packages/core
pnpm dev:example       # runs the example app
pnpm typecheck         # tsc --noEmit across all packages
```
