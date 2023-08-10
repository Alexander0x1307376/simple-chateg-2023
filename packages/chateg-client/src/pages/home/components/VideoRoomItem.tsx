import { FC } from "react";
import { User } from "../../../types/entities";
import UserItem from "./UserItem";
import { Link } from "react-router-dom";
import { IoStarOutline } from "react-icons/io5";

export interface VideoRoomItemProps {
  roomName: string;
  roomId: string;
  ownerId: number;
  members: User[];
}

const VideoRoomItem: FC<VideoRoomItemProps> = ({
  roomName,
  members,
  roomId,
  ownerId,
}) => {
  return (
    <>
      <Link to={roomId} className="px-2 py-1 block hover:bg-black/25 w-full">
        {roomName}
      </Link>
      <ul className="pl-4 pb-2">
        {members.map((item) => (
          <li key={item.id} className="flex items-center">
            <UserItem user={item} avaSize="1.2rem" />
            {ownerId === item.id && <IoStarOutline />}
          </li>
        ))}
      </ul>
    </>
  );
};

export default VideoRoomItem;
