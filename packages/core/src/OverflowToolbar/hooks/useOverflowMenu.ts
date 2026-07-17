import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import type { IRenderOverflowMenuMeta, IToolbarItem } from "../OverflowToolbar.model";

export interface IUseOverflowMenuOptions {
  renderOverflowMenu?: (meta: IRenderOverflowMenuMeta) => ReactNode;
  overflowItems: IToolbarItem[];
  onOverflowChange?: (overflowItems: IToolbarItem[]) => void;
}

export interface IUseOverflowMenuResult {
  rootRef: RefObject<HTMLDivElement>;
  isDefaultMenu: boolean;
  menuOpen: boolean;
  handleToggleMenu: () => void;
  handleCloseMenu: () => void;
}

export const useOverflowMenu = ({
  renderOverflowMenu,
  overflowItems,
  onOverflowChange,
}: IUseOverflowMenuOptions): IUseOverflowMenuResult => {
  const isDefaultMenu = renderOverflowMenu === undefined;
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = () => setMenuOpen((open) => !open);
  const handleCloseMenu = () => setMenuOpen(false);

  useEffect(() => {
    onOverflowChange?.(overflowItems);
  }, [overflowItems, onOverflowChange]);

  useEffect(() => {
    // Custom renderOverflowMenu implementations (e.g. MUI Menu, which portals
    // outside rootRef) own their own outside-click/Escape handling via `close`.
    if (!isDefaultMenu) return;
    if (!menuOpen) return;

    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [menuOpen, isDefaultMenu]);

  return { rootRef, isDefaultMenu, menuOpen, handleToggleMenu, handleCloseMenu };
};
