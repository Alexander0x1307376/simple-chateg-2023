import React, { MouseEvent } from "react";
import type { IconType } from "react-icons";

export interface IconedButtonProps {
  title?: string;
  size?: string | number;
  icon: IconType;
  onClick?: (e: MouseEvent) => void;
}

const IconedButton: React.FC<IconedButtonProps> = ({
  title,
  onClick,
  icon: Icon,
  size = "2rem",
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center rounded-full hover:bg-black/50 p-1 active:translate-y-[1px] transition-transform  duration-75"
    >
      <div style={{ height: size, width: size }}>
        <Icon size={size} />
      </div>
      {title && <span>{title}</span>}
    </button>
  );
};

export default IconedButton;
