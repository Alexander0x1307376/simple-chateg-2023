import React, { InputHTMLAttributes, useId } from "react";

export interface InputTextProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id"> {
  label: string;
}

const InputText: React.FC<InputTextProps> = ({ label, ...props }) => {
  const fieldId = useId();

  return (
    <div className="flex flex-col mt-2">
      {label && (
        <label className="mb-2 text-textSecondary" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <input
        id={fieldId}
        className="px-4 py-2 rounded-lg bg-bglighten outline-none bg-black/25"
        {...props}
      />
    </div>
  );
};

export default InputText;
