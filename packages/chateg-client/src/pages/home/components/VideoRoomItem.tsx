import { FC } from "react";
import { User } from "../../../types/entities";
import UserItem from "./UserItem";
import { Link } from "react-router-dom";

export interface VideoRoomItemProps {
  roomName: string;
  roomId: string;
  owner: User;
  members: User[];
}

const VideoRoomItem: FC<VideoRoomItemProps> = ({
  roomName,
  owner,
  members,
  roomId,
}) => {
  return (
    <>
      <Link to={roomId} className="px-2 py-1 block hover:bg-black/25 w-full">
        {roomName}
      </Link>
      <ul className="pl-4 pb-2">
        <li key={owner.id}>
          <UserItem user={owner} avaSize="1.2rem" />
        </li>
        {members.map((item) => (
          <li key={item.id}>
            <UserItem user={item} avaSize="1.2rem" />
          </li>
        ))}
      </ul>
    </>
  );
};

export default VideoRoomItem;
