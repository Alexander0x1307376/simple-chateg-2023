import { FC, useEffect } from "react";
import VideoSection from "../components/VideoSection";
import { useMediaStream } from "../../../features/videoStreams/useMediaStream";
import { useSocketEmitters } from "../../../features/webSockets/useSoketEmitters";

const MeetingSection: FC = () => {
  const { startStream, stopStream } = useMediaStream();
  const { channelEmitter } = useSocketEmitters();

  useEffect(() => {
    startStream();
    return () => {
      stopStream();
      channelEmitter.leaveChannel();
    };
  }, [channelEmitter, startStream, stopStream]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="grow-0 py-4 px-2">Общий чятег</h2>
      <div className="flex-1 p-2 overflow-auto">
        <VideoSection />
      </div>
      <div className="flex-1 p-2">Текстовый чат</div>
    </div>
  );
};

export default MeetingSection;
