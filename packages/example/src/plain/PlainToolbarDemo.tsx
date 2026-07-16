import { useState } from "react";
import type { ChangeEvent } from "react";
import { OverflowToolbar } from "react-overflow-toolbar";
import type {
  IRenderItemMeta,
  IRenderOverflowItemMeta,
  IRenderOverflowTriggerMeta,
  IToolbarItem,
  ToolbarItemVariant,
} from "react-overflow-toolbar";
import { buildToolbarItems } from "../toolbarData";

const variantClass: Record<ToolbarItemVariant, string> = {
  default: "toolbar-btn",
  primary: "toolbar-btn toolbar-btn--primary",
  danger: "toolbar-btn toolbar-btn--danger",
};

export interface IPlainToolbarDemoProps {
  onAction: (label: string) => void;
}

export const PlainToolbarDemo = ({ onAction }: IPlainToolbarDemoProps) => {
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
        <label ref={measureRef} className="toolbar-switch">
          <input type="checkbox" checked={autoSave} onChange={handleAutoSaveChange} />
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
        ref={measureRef}
        type="button"
        disabled={item.disabled}
        onClick={handleClick}
        className={variantClass[item.variant ?? "default"]}
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
      className="toolbar-trigger"
    >
      «
    </button>
  );

  const renderOverflowItem = (item: IToolbarItem, { close }: IRenderOverflowItemMeta) => {
    if (item.content) {
      return item.content({ measureRef: () => {} });
    }

    const handleClick = () => {
      item.onClick?.(item);
      close();
    };
    return (
      <button
        type="button"
        disabled={item.disabled}
        onClick={handleClick}
        className="toolbar-menu-item"
      >
        {item.label}
      </button>
    );
  };

  return (
    <OverflowToolbar
      items={items}
      gap={8}
      className="toolbar-root"
      renderItem={renderItem}
      renderOverflowTrigger={renderOverflowTrigger}
      renderOverflowItem={renderOverflowItem}
    />
  );
};
