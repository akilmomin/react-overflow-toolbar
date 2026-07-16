import type { ToolbarItemVariant } from "react-overflow-toolbar";

export const variantClasses: Record<ToolbarItemVariant, string> = {
  default: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
