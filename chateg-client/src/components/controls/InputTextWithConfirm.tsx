import React, { InputHTMLAttributes, useId } from "react";
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";

export interface InputTextProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id"> {
  label?: string;
  marker?: "success" | "error" | "hidden";
}

const InputTextWithConfirm: React.FC<InputTextProps> = ({
  label,
  marker = "hidden",
  ...props
}) => {
  const fieldId = useId();

  return (
    <div className="flex flex-col mt-2 items-stretch">
      {label && (
        <label
          htmlFor={fieldId}
          className="flex relative mb-2 text-textSecondary space-x-2"
        >
          <span>{label}</span>
          {marker === "success" ? (
            <div className="text-green-300 relative top-[0.2rem]">
              <IoCheckmarkSharp size="1.2rem" />
            </div>
          ) : marker === "error" ? (
            <div className="text-red-300 relative top-[0.3rem]">
              <IoCloseSharp size="1.2rem" />
            </div>
          ) : undefined}
        </label>
      )}
      <input
        id={fieldId}
        {...props}
        className="px-4 py-2 rounded-lg bg-bglighten outline-none bg-black/25"
      />
    </div>
  );
};

export default InputTextWithConfirm;
