import { useState } from "react";
import type { ChangeEvent } from "react";
import { Button, FormControlLabel, IconButton, Menu, MenuItem, Switch } from "@mui/material";
import { OverflowToolbar } from "react-overflow-toolbar";
import type {
  IRenderItemMeta,
  IRenderOverflowMenuMeta,
  IRenderOverflowTriggerMeta,
  IToolbarItem,
  ToolbarItemVariant,
} from "react-overflow-toolbar";
import { buildToolbarItems } from "../toolbarData";

const variantToMui: Record<
  ToolbarItemVariant,
  { variant: "outlined" | "contained"; color: "inherit" | "primary" | "error" }
> = {
  default: { variant: "outlined", color: "inherit" },
  primary: { variant: "contained", color: "primary" },
  danger: { variant: "contained", color: "error" },
};

export interface IMuiToolbarDemoProps {
  onAction: (label: string) => void;
}

export const MuiToolbarDemo = ({ onAction }: IMuiToolbarDemoProps) => {
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
        <FormControlLabel
          ref={measureRef}
          sx={{ flexShrink: 0, mr: 0, whiteSpace: "nowrap" }}
          control={<Switch checked={autoSave} onChange={handleAutoSaveChange} size="small" />}
          label="Auto-save"
        />
      ),
    },
  ];

  const renderItem = (item: IToolbarItem, { measureRef }: IRenderItemMeta) => {
    const { variant, color } = variantToMui[item.variant ?? "default"];
    const handleClick = () => item.onClick?.(item);

    return (
      <Button
        key={item.id}
        ref={measureRef}
        variant={variant}
        color={color}
        disabled={item.disabled}
        onClick={handleClick}
        sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
      >
        {item.label}
      </Button>
    );
  };

  const renderOverflowTrigger = ({ toggle, overflowCount }: IRenderOverflowTriggerMeta) => (
    <IconButton onClick={toggle} aria-label={`${overflowCount} more actions`} size="small">
      «
    </IconButton>
  );

  const renderOverflowMenu = ({ overflowItems, close, anchorEl }: IRenderOverflowMenuMeta) => {
    const renderMenuItem = (item: IToolbarItem) => {
      if (item.content) {
        return (
          <MenuItem key={item.id} disableRipple sx={{ cursor: "default" }}>
            {item.content({ measureRef: () => {} })}
          </MenuItem>
        );
      }

      const handleClick = () => {
        item.onClick?.(item);
        close();
      };
      return (
        <MenuItem key={item.id} disabled={item.disabled} onClick={handleClick}>
          {item.label}
        </MenuItem>
      );
    };

    return (
      <Menu open anchorEl={anchorEl} onClose={close}>
        {overflowItems.map(renderMenuItem)}
      </Menu>
    );
  };

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
