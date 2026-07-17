import type { IToolbarItem } from "react-overflow-toolbar";

export const buildToolbarItems = (onAction: (label: string) => void): IToolbarItem[] => {
  const handleItemClick = (item: IToolbarItem) => onAction(item.label);

  return [
    { id: "save", label: "Save", priority: 8, variant: "primary", sticky: true, onClick: handleItemClick },
    { id: "share", label: "Share", priority: 7, onClick: handleItemClick },
    { id: "print", label: "Print", priority: 6, onClick: handleItemClick },
    { id: "export-pdf", label: "Export PDF", priority: 5, onClick: handleItemClick },
    { id: "save-as", label: "Save As", priority: 4, onClick: handleItemClick, sticky: true },
    { id: "duplicate", label: "Duplicate", priority: 3, onClick: handleItemClick },
    { id: "rename", label: "Rename", priority: 2, onClick: handleItemClick },
    { id: "version-history", label: "Version History", priority: 1, onClick: handleItemClick },
    { id: "delete", label: "Delete", priority: 0, variant: "danger", onClick: handleItemClick },
  ];
};
