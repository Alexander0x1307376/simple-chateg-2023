import { FC, MouseEvent, ReactNode } from "react";

export interface ButtonProps {
  children?: ReactNode;
  onClick?: (e: MouseEvent) => void;
  type?: "default" | "info" | "warning" | "danger";
  htmlType?: "button" | "submit";
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  type = "default",
  htmlType = "button",
}) => {
  const styleTypes = {
    default: "bg-violet-600 hover:bg-violet-500",
    info: "bg-blue-600 hover:bg-blue-500",
    warning: "bg-yellow-600 hover:bg-yellow-500",
    danger: "bg-red-700 hover:bg-red-600",
  };
  const elementStyles =
    "py-2 px-6 font-semibold rounded-full min-w-[7rem] transition-all active:scale-95 duration-100 " +
    styleTypes[type];

  return (
    <button type={htmlType} className={elementStyles} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
