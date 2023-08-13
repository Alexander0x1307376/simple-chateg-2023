import { FC } from "react";
import useStore from "../../../features/store/useStore";
import VideoRoomItem from "./VideoRoomItem";

const VideoRoomsList: FC = () => {
  const { channels } = useStore();

  return (
    <>
      {channels.length ? (
        <ul>
          {channels.map(({ id, name, members, ownerId }) => (
            <li key={id}>
              <VideoRoomItem roomName={name} roomId={id} ownerId={ownerId} members={members} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-2">пока что нет</div>
      )}
    </>
  );
};

export default VideoRoomsList;
