import { forwardRef, ReactNode } from "react";

export interface ContextMenuProps {
  items: { key: string; label: ReactNode }[];
  position: { x: number; y: number } | null;
  onClick: (key: string) => void;
}

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ items, position, onClick }, ref) => {
    return (
      <div
        ref={ref}
        style={
          position
            ? { left: position.x, top: position.y }
            : { visibility: "hidden" }
        }
        className="absolute z-10 bg-black/60 backdrop-blur-sm py-2 rounded-lg flex flex-col items-stretch w-52 shadow-black/50 shadow-lg"
      >
        {items.map(({ key, label }) => (
          <button
            className="hover:bg-slate-500 text-left px-2 py-1 "
            key={key}
            onClick={() => onClick(key)}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }
);

ContextMenu.displayName = "ContextMenu";

export default ContextMenu;
