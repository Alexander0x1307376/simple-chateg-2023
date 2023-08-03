import { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import BlockInCentre from "./BlockInCentre";

export interface ModalProps {
  children: ReactNode;
  isVisible: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ isVisible, onClose, children }) => {
  return (
    isVisible &&
    createPortal(
      <div
        role="button"
        onClick={onClose}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="text-slate-300 absolute inset-0 z-10 flex items-center justify-center bg-black/50 cursor-default"
      >
        <BlockInCentre>
          <div
            onClick={(e) => e.stopPropagation()}
            tabIndex={0}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Escape") onClose();
            }}
            role="button"
          >
            {children}
          </div>
        </BlockInCentre>
      </div>,
      document.body
    )
  );
};

export default Modal;
