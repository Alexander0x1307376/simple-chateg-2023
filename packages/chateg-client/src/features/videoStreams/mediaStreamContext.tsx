import { FC, ReactNode, createContext } from "react";
import { MediaStreamService } from "./MediaStreamService";

export interface IMediastreamContext {
  mediaStreamService: MediaStreamService;
}

export const MediaStreamContext = createContext<IMediastreamContext>({} as IMediastreamContext);

export interface MediaStreamProviderProps {
  mediaStreamService: MediaStreamService;
  children: ReactNode;
}

const MediaStreamProvider: FC<MediaStreamProviderProps> = ({ children, mediaStreamService }) => {
  return (
    <MediaStreamContext.Provider value={{ mediaStreamService }}>
      {children}
    </MediaStreamContext.Provider>
  );
};

export default MediaStreamProvider;
