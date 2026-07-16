import type { ReactNode, RefObject } from "react";

export type ToolbarItemVariant = "default" | "primary" | "danger";

export interface IRenderItemMeta {
  measureRef: (node: HTMLElement | null) => void;
}

export interface IToolbarItem {
  id: string;
  label: string;
  priority?: number;
  disabled?: boolean;
  variant?: ToolbarItemVariant;
  icon?: unknown;
  onClick?: (item: IToolbarItem) => void;
  /**
   * Renders this item as any component (TextField, Switch, custom widget, ...)
   * instead of the toolbar's default button. Still measured/overflowed like
   * any other item; falls back to the toolbar's renderItem when omitted.
   */
  content?: (meta: IRenderItemMeta) => ReactNode;
}

export interface IRenderOverflowTriggerMeta {
  overflowCount: number;
  triggerRef: RefObject<HTMLElement>;
  open: boolean;
  toggle: () => void;
}

export interface IRenderOverflowMenuMeta {
  overflowItems: IToolbarItem[];
  close: () => void;
  anchorEl: HTMLElement | null;
}

export interface IRenderOverflowItemMeta {
  close: () => void;
}
