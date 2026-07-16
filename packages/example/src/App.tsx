import { useState } from "react";
import { ResizablePreview } from "./ResizablePreview";
import { MuiToolbarDemo } from "./mui/MuiToolbarDemo";
import { TailwindToolbarDemo } from "./tailwind/TailwindToolbarDemo";
import { PlainToolbarDemo } from "./plain/PlainToolbarDemo";
import { DefaultToolbarDemo } from "./default/DefaultToolbarDemo";

type Skin = "mui" | "tailwind" | "plain" | "default";

interface ISkinOption {
  id: Skin;
  label: string;
}

const skins: ISkinOption[] = [
  { id: "mui", label: "Material UI" },
  { id: "tailwind", label: "Tailwind" },
  { id: "plain", label: "Plain HTML" },
  { id: "default", label: "Core Default" },
];

const App = () => {
  const [skin, setSkin] = useState<Skin>("mui");
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleSkinSelect = (id: Skin) => () => setSkin(id);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Resizable Overflow Toolbar</h1>
      <p style={{ color: "#6b7280", marginTop: 0, marginBottom: 20 }}>
        Drag the handle or use the slider to shrink the toolbar's container. Items that no
        longer fit move into the "«" overflow menu — the same headless{" "}
        <code>react-overflow-toolbar</code> package drives all four skins below via render
        props — including "Auto-save," a non-button component the toolbar treats the same
        as any other item.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {skins.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={handleSkinSelect(option.id)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: skin === option.id ? "#111827" : "#ffffff",
              color: skin === option.id ? "#ffffff" : "#111827",
              cursor: "pointer",
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ResizablePreview>
        {skin === "mui" && <MuiToolbarDemo onAction={setLastAction} />}
        {skin === "tailwind" && <TailwindToolbarDemo onAction={setLastAction} />}
        {skin === "plain" && <PlainToolbarDemo onAction={setLastAction} />}
        {skin === "default" && <DefaultToolbarDemo onAction={setLastAction} />}
      </ResizablePreview>

      <p style={{ marginTop: 20, fontSize: 14, color: "#374151" }}>
        Last action: <strong>{lastAction ?? "(none yet)"}</strong>
      </p>
    </div>
  );
};

export default App;
