import { Fragment, useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { useOverflowToolbar } from "./hooks/useOverflowToolbar";
import type {
  IOverflowToolbarProps,
  IRenderOverflowItemMeta,
  IRenderOverflowMenuMeta,
  IRenderOverflowTriggerMeta,
  IToolbarItem,
} from "./OverflowToolbar.model";

const noopMeasureRef = () => {};

const DefaultOverflowTrigger = ({ overflowCount, toggle }: IRenderOverflowTriggerMeta) => (
  <button type="button" onClick={toggle}>
    {overflowCount} more
  </button>
);

const DefaultOverflowItem = (item: IToolbarItem, { close }: IRenderOverflowItemMeta) => {
  if (item.content) {
    return item.content({ measureRef: noopMeasureRef });
  }

  const handleClick = () => {
    item.onClick?.(item);
    close();
  };

  return (
    <button type="button" disabled={item.disabled} onClick={handleClick}>
      {item.label}
    </button>
  );
};

const makeDefaultOverflowMenu = (
  renderOverflowItem: (item: IToolbarItem, meta: IRenderOverflowItemMeta) => ReactNode
) => {
  const DefaultOverflowMenu = ({ overflowItems, close }: IRenderOverflowMenuMeta) => (
    <ul role="menu">
      {overflowItems.map((item) => (
        <li key={item.id} role="menuitem">
          {renderOverflowItem(item, { close })}
        </li>
      ))}
    </ul>
  );

  return DefaultOverflowMenu;
};

export const OverflowToolbar = ({
  items,
  gap = 8,
  overflowTriggerWidth,
  className,
  itemsContainerClassName,
  renderItem,
  renderOverflowTrigger = DefaultOverflowTrigger,
  renderOverflowMenu,
  renderOverflowItem = DefaultOverflowItem,
  onOverflowChange,
}: IOverflowToolbarProps) => {
  const isDefaultMenu = renderOverflowMenu === undefined;
  const resolvedRenderOverflowMenu = renderOverflowMenu ?? makeDefaultOverflowMenu(renderOverflowItem);
  const { containerRef, measureRef, overflowTriggerRef, visibleItems, overflowItems, isMeasuring } =
    useOverflowToolbar({ items, gap, overflowTriggerWidth });

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

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      <div
        ref={containerRef}
        className={itemsContainerClassName}
        style={{
          display: "flex",
          alignItems: "center",
          gap,
          minWidth: 0,
          flex: 1,
          visibility: isMeasuring ? "hidden" : "visible",
        }}
      >
        {visibleItems.map((item) => {
          const meta = { measureRef: measureRef(item.id) };
          return (
            <Fragment key={item.id}>
              {item.content ? item.content(meta) : renderItem(item, meta)}
            </Fragment>
          );
        })}
      </div>
      {overflowItems.length > 0 && (
        <div ref={overflowTriggerRef as RefObject<HTMLDivElement>} style={{ flexShrink: 0 }}>
          {renderOverflowTrigger({
            overflowCount: overflowItems.length,
            triggerRef: overflowTriggerRef,
            open: menuOpen,
            toggle: handleToggleMenu,
          })}
          {menuOpen &&
            resolvedRenderOverflowMenu({
              overflowItems,
              close: handleCloseMenu,
              anchorEl: overflowTriggerRef.current,
            })}
        </div>
      )}
    </div>
  );
};
