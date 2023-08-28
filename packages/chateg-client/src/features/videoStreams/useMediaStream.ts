import { useContext, useEffect, useState } from "react";
import { MediaStreamContext } from "./mediaStreamContext";

export const useMediaStream = () => {
  const { mediaStreamService, streamData } = useContext(MediaStreamContext);
  const [thisStream, setThisStream] = useState<MediaStream | null>();
  const [isThisStreamLoading, setIsThisStreamLoading] = useState<boolean>(true);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>();

  useEffect(() => {
    if (!(videoElement && thisStream)) return;
    videoElement.srcObject = thisStream;
  }, [videoElement, thisStream]);

  useEffect(() => {
    setIsThisStreamLoading(true);
    mediaStreamService
      .getMediaStream()
      .then(setThisStream)
      .catch((err: { message?: string }) => {
        console.error(err);
      })
      .finally(() => setIsThisStreamLoading(false));
  }, [mediaStreamService]);

  return {
    isThisStreamLoading,
    thisStream,
    streamData,
    setVideoElement,
  };
};
