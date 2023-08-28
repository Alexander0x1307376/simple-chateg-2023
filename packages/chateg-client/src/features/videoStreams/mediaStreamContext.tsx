import { FC, ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { MediaStreamService, StreamData } from "./MediaStreamService";

export interface IMediastreamContext {
  mediaStreamService: MediaStreamService;
  streamData: StreamData;
  thisStream: MediaStream | null | undefined;
  startStream: () => void;
  stopStream: () => void;
  isThisStreamLoading: boolean;
  toggleVideo: () => void;
  toggleVoice: () => void;
}

export const MediaStreamContext = createContext<IMediastreamContext>({} as IMediastreamContext);

export interface MediaStreamProviderProps {
  mediaStreamService: MediaStreamService;
  children: ReactNode;
}

const MediaStreamProvider: FC<MediaStreamProviderProps> = ({ children, mediaStreamService }) => {
  const [streamData, setStreamData] = useState<StreamData>(mediaStreamService.store);

  const [thisStream, setThisStream] = useState<MediaStream | null>();
  const [isThisStreamLoading, setIsThisStreamLoading] = useState<boolean>(true);

  const methods = useMemo(() => {
    const startStream = () => {
      setIsThisStreamLoading(true);
      mediaStreamService
        .getMediaStream()
        .then(setThisStream)
        .catch((err: { message?: string }) => {
          console.error(err);
        })
        .finally(() => setIsThisStreamLoading(false));
    };
    const stopStream = () => {
      mediaStreamService.turnOffMediaStream();
    };

    const toggleVideo = () => {
      mediaStreamService.toggleVideo();
    };
    const toggleVoice = () => {
      mediaStreamService.toggleVoice();
    };

    return {
      startStream,
      stopStream,
      toggleVideo,
      toggleVoice,
    };
  }, [mediaStreamService]);

  useEffect(() => {
    return mediaStreamService.subscribe(setStreamData);
  }, [mediaStreamService]);

  return (
    <MediaStreamContext.Provider
      value={{ mediaStreamService, streamData, thisStream, isThisStreamLoading, ...methods }}
    >
      {children}
    </MediaStreamContext.Provider>
  );
};

export default MediaStreamProvider;
