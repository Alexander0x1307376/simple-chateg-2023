import { ButtonHTMLAttributes, FC, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  buttonType?: "default" | "info" | "warning" | "danger";
}

const Button: FC<ButtonProps> = ({
  children,
  buttonType = "default",
  disabled,
  ...props
}) => {
  const styleTypes = {
    default: "bg-violet-600 hover:bg-violet-500 active:scale-95",
    disabled: "bg-gray-500 cursor-not-allowed text-gray-400",
    info: "bg-blue-600 hover:bg-blue-500 active:scale-95",
    warning: "bg-yellow-600 hover:bg-yellow-500 active:scale-95",
    danger: "bg-red-700 hover:bg-red-600 active:scale-95",
  };

  const elementStyles =
    "py-2 px-6 font-semibold rounded-full min-w-[7rem] transition-all duration-100 " +
    styleTypes[disabled ? "disabled" : buttonType];

  return (
    <button className={elementStyles} {...props}>
      {children}
    </button>
  );
};

export default Button;
