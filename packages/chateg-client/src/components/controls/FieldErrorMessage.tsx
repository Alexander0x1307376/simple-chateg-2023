import { FC } from "react";

export interface FieldErrorMessageProps {
  message: string;
}

const FieldErrorMessage: FC<FieldErrorMessageProps> = ({ message }) => {
  return <span className="text-sm text-red-300 lowercase p-1">{message}</span>;
};

export default FieldErrorMessage;
