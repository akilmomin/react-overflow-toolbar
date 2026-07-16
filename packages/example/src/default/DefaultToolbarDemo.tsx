import { useState } from "react";
import type { ChangeEvent } from "react";
import { OverflowToolbar } from "react-overflow-toolbar";
import type { IRenderItemMeta, IToolbarItem } from "react-overflow-toolbar";
import { buildToolbarItems } from "../toolbarData";

export interface IDefaultToolbarDemoProps {
  onAction: (label: string) => void;
}

export const DefaultToolbarDemo = ({ onAction }: IDefaultToolbarDemoProps) => {
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
      <button key={item.id} ref={measureRef} type="button" disabled={item.disabled} onClick={handleClick}>
        {item.label}
      </button>
    );
  };

  return <OverflowToolbar items={items} gap={8} className="toolbar-root" renderItem={renderItem} />;
};
