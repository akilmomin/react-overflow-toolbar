import { useState } from "react";
import type { ChangeEvent, ReactNode } from "react";

const MIN_WIDTH = 240;
const MAX_WIDTH = 1000;

export interface IResizablePreviewProps {
  children: ReactNode;
}

export const ResizablePreview = ({ children }: IResizablePreviewProps) => {
  const [width, setWidth] = useState(760);

  const handleRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWidth(Number(event.target.value));
  };

  return (
    <div>
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <label style={{ fontSize: 14, color: "#374151" }}>
          Container width: {Math.round(width)}px
        </label>
        <input
          type="range"
          min={MIN_WIDTH}
          max={MAX_WIDTH}
          value={width}
          onChange={handleRangeChange}
          style={{ width: 240 }}
        />
      </div>
      <div
        style={{
          width,
          border: "1px dashed #9ca3af",
          borderRadius: 8,
          padding: 12,
          background: "#ffffff",
          maxWidth: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
