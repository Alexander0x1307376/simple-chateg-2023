/* eslint-disable jsx-a11y/media-has-caption */
import { FC } from "react";
import { usePeers } from "../../../features/peerConnection/usePeers";
import LocalStream from "./LocalStream";

const VideoSection: FC = () => {
  const { streams } = usePeers();

  return (
    <div className="flex rounded-lg flex-wrap justify-center">
      <LocalStream />
      {streams.map(([peerId, streams]) => {
        return (
          <div key={peerId} className="flex justify-center mx-2 h-40 my-2 rounded-lg overflow-clip">
            <video
              className="h-full"
              autoPlay
              ref={(element) => {
                if (!element) return;
                element.srcObject = streams[0];
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default VideoSection;
