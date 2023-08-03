import { FC } from "react";
import useStore from "../../../features/store/useStore";
import VideoRoomItem from "./VideoRoomItem";

const VideoRoomsList: FC = () => {
  const { channels } = useStore();

  return (
    <>
      {channels.length ? (
        <ul>
          {channels.map(({ id, name, members, owner }) => (
            <li key={id}>
              <VideoRoomItem
                roomName={name}
                roomId={id}
                owner={owner}
                members={members}
              />
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
