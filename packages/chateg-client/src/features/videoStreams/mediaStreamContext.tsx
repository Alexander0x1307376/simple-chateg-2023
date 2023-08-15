import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { MediaStreamService, StreamData } from "./MediaStreamService";

export interface IMediastreamContext {
  mediaStreamService: MediaStreamService;
  streamData: StreamData;
}

export const MediaStreamContext = createContext<IMediastreamContext>({} as IMediastreamContext);

export interface MediaStreamProviderProps {
  mediaStreamService: MediaStreamService;
  children: ReactNode;
}

const MediaStreamProvider: FC<MediaStreamProviderProps> = ({ children, mediaStreamService }) => {
  const [streamData, setStreamData] = useState<StreamData>(mediaStreamService.store);

  useEffect(() => {
    return mediaStreamService.subscribe(setStreamData);
  }, [mediaStreamService]);

  return (
    <MediaStreamContext.Provider value={{ mediaStreamService, streamData }}>
      {children}
    </MediaStreamContext.Provider>
  );
};

export default MediaStreamProvider;
