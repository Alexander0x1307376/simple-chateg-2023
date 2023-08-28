/* eslint-disable jsx-a11y/media-has-caption */
import { FC, useEffect, useMemo } from "react";
import { useAuth } from "../../../features/auth/useAuth";
import useStore from "../../../features/store/useStore";
import { useParams } from "react-router-dom";
import { usePeers } from "../../../features/peerConnection/usePeers";
import LocalStream from "./LocalStream";
import { PeerItem } from "../../../features/peerConnection/PeerConnections";
import { User } from "../../../types/entities";

const VideoSection: FC = () => {
  const { channelId } = useParams();

  const { authData } = useAuth();
  const { channels } = useStore();

  const { connections } = usePeers();

  const currentChannel = useMemo(() => {
    if (channelId && channels) return channels.find((channel) => channel.id === channelId);
    else return undefined;
  }, [channels, channelId]);

  const videos: { member: User; peerData: PeerItem }[] = useMemo(() => {
    if (!(connections && currentChannel && authData)) return [];

    const members = currentChannel.members.filter((member) => member.id !== authData.userData.id);
    if (members.length !== Object.keys(connections).length) return [];

    const peerList = Object.values(connections);
    console.log("videos_COUNT", {
      membersCount: members.length,
      peersCount: peerList.length,
    });

    const result = peerList.map((peerData, index) => {
      const member = members[index];
      return { member, peerData };
    });

    console.log("VIDEOS", { connections, members, result });

    return result;
  }, [connections, currentChannel, authData]);

  return (
    <div className="flex rounded-lg flex-wrap justify-center">
      <LocalStream />
      {videos.map((item) => {
        console.log("RENDER_VIDEOS", item);

        return (
          <div
            key={item.member.id}
            className="flex justify-center mx-2 h-40 w-60 my-2 bg-green-900"
          >
            <video
              className="h-full bg-red-950"
              autoPlay
              ref={(element) => {
                if (!element) return;
                console.log("STREAM!!", item);
                element.srcObject = item.peerData.streams[0];
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default VideoSection;
