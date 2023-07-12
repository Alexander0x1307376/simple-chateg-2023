import { FC } from "react";
import { User } from "../../../types/entities";
import Ava from "../../../components/common/Ava";

export interface UserItemProps {
  user: User;
  avaSize?: string;
}

const UserItem: FC<UserItemProps> = ({
  avaSize = "2rem",
  user: { name, avaUrl },
}) => {
  return (
    <div className="relative flex items-center px-2 py-1 space-x-1">
      <div className="max-h-10 max-w-10">
        <Ava size={avaSize} url={avaUrl} label={name} />
      </div>
      <div className="truncate">
        <span>{name}</span>
      </div>
    </div>
  );
};

export default UserItem;
