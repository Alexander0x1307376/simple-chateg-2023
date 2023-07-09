import { FC, ReactNode } from "react";

export interface BlockInCentreProps {
  children: ReactNode;
}

const BlockInCentre: FC<BlockInCentreProps> = ({ children }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {children}
    </div>
  );
};

export default BlockInCentre;
