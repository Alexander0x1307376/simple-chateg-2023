import React, { MouseEvent } from "react";
import { IconType } from "react-icons";

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
      className="flex flex-col items-center justify-center rounded-full transition-all duration-100 hover:bg-black/50 p-1"
    >
      <Icon size={size} />
      {title && <span>{title}</span>}
    </button>
  );
};

export default IconedButton;
