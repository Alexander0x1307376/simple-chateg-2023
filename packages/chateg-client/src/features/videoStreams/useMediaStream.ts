import { useContext, useEffect, useState } from "react";
import { MediaStreamContext } from "./mediaStreamContext";

export const useMediaStream = () => {
  const {
    streamData,
    isThisStreamLoading,
    thisStream,
    startStream,
    stopStream,
    toggleVideo,
    toggleVoice,
  } = useContext(MediaStreamContext);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>();

  useEffect(() => {
    if (!(videoElement && thisStream)) return;
    videoElement.srcObject = thisStream;
  }, [videoElement, thisStream]);

  return {
    isThisStreamLoading,
    thisStream,
    streamData,
    setVideoElement,
    startStream,
    stopStream,
    toggleVideo,
    toggleVoice,
  };
};
