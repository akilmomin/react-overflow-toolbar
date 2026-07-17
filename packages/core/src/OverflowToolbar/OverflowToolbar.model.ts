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
  /** Never moves into the overflow menu, regardless of available width. */
  sticky?: boolean;
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

export interface IOverflowToolbarProps {
  items: IToolbarItem[];
  gap?: number;
  overflowTriggerWidth?: number;
  className?: string;
  itemsContainerClassName?: string;
  renderItem: (item: IToolbarItem, meta: IRenderItemMeta) => ReactNode;
  renderOverflowTrigger?: (meta: IRenderOverflowTriggerMeta) => ReactNode;
  renderOverflowMenu?: (meta: IRenderOverflowMenuMeta) => ReactNode;
  renderOverflowItem?: (item: IToolbarItem, meta: IRenderOverflowItemMeta) => ReactNode;
  onOverflowChange?: (overflowItems: IToolbarItem[]) => void;
}

export interface IUseOverflowToolbarOptions {
  items: IToolbarItem[];
  gap?: number;
  overflowTriggerWidth?: number;
}

export interface IUseOverflowToolbarResult {
  containerRef: RefObject<HTMLDivElement>;
  measureRef: (id: string) => (node: HTMLElement | null) => void;
  overflowTriggerRef: RefObject<HTMLElement>;
  visibleItems: IToolbarItem[];
  overflowItems: IToolbarItem[];
  isMeasuring: boolean;
}
