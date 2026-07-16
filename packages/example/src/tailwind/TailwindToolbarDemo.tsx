import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { OverflowToolbar } from "react-overflow-toolbar";
import type {
  IRenderItemMeta,
  IRenderOverflowMenuMeta,
  IRenderOverflowTriggerMeta,
  IToolbarItem,
} from "react-overflow-toolbar";
import { buildToolbarItems } from "../toolbarData";
import { variantClasses } from "./variantClasses";

export interface ITailwindOverflowMenuProps {
  overflowItems: IToolbarItem[];
  close: () => void;
}

const TailwindOverflowMenu = ({ overflowItems, close }: ITailwindOverflowMenuProps) => {
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        close();
      }
    };
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [close]);

  const renderMenuItem = (item: IToolbarItem) => {
    if (item.content) {
      return (
        <li key={item.id} role="menuitem" className="px-4 py-2">
          {item.content({ measureRef: () => {} })}
        </li>
      );
    }

    const handleClick = () => {
      item.onClick?.(item);
      close();
    };
    return (
      <li key={item.id} role="menuitem">
        <button
          type="button"
          disabled={item.disabled}
          onClick={handleClick}
          className="block w-full whitespace-nowrap px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          {item.label}
        </button>
      </li>
    );
  };

  return (
    <ul
      ref={menuRef}
      role="menu"
      className="absolute right-0 top-full z-10 mt-1 min-w-[10rem] rounded-md border border-gray-200 bg-white py-1 shadow-lg"
    >
      {overflowItems.map(renderMenuItem)}
    </ul>
  );
};

export interface ITailwindToolbarDemoProps {
  onAction: (label: string) => void;
}

export const TailwindToolbarDemo = ({ onAction }: ITailwindToolbarDemoProps) => {
  const [autoSave, setAutoSave] = useState(false);

  const handleAutoSaveChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAutoSave(event.target.checked);
  };

  const items: IToolbarItem[] = [
    ...buildToolbarItems(onAction),
    {
      id: "auto-save",
      label: "Auto-save",
      priority: 4.5,
      content: ({ measureRef }) => (
        <label
          ref={measureRef}
          className="flex shrink-0 items-center gap-2 whitespace-nowrap px-2 text-sm text-gray-700"
        >
          <input
            type="checkbox"
            checked={autoSave}
            onChange={handleAutoSaveChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          Auto-save
        </label>
      ),
    },
  ];

  const renderItem = (item: IToolbarItem, { measureRef }: IRenderItemMeta) => {
    const handleClick = () => item.onClick?.(item);
    return (
      <button
        key={item.id}
        ref={measureRef as (node: HTMLButtonElement | null) => void}
        type="button"
        disabled={item.disabled}
        onClick={handleClick}
        className={`shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          variantClasses[item.variant ?? "default"]
        }`}
      >
        {item.label}
      </button>
    );
  };

  const renderOverflowTrigger = ({ toggle, overflowCount }: IRenderOverflowTriggerMeta) => (
    <button
      type="button"
      onClick={toggle}
      aria-label={`${overflowCount} more actions`}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
    >
      «
    </button>
  );

  const renderOverflowMenu = ({ overflowItems, close }: IRenderOverflowMenuMeta) => (
    <TailwindOverflowMenu overflowItems={overflowItems} close={close} />
  );

  return (
    <OverflowToolbar
      items={items}
      gap={8}
      renderItem={renderItem}
      renderOverflowTrigger={renderOverflowTrigger}
      renderOverflowMenu={renderOverflowMenu}
    />
  );
};
