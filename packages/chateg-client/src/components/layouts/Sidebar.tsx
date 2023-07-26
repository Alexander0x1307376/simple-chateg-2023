import { FC, ReactNode } from "react";

export interface SidebarProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children, header, footer }) => {
  return (
    <div className="bg-slate-600 rounded-lg h-full flex flex-col items-stretch pb-2 max-w-full">
      {header && <div className="grow-0">{header}</div>}
      <div className="grow overflow-auto">{children}</div>
      {footer && <div className="grow-0">{footer}</div>}
    </div>
  );
};

export default Sidebar;
