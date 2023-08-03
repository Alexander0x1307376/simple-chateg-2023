/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { SocketQuerySystem } from "./SocketQuerySystem";
import { ChannelsSocketEmitter } from "../channels/ChannelsSocketEmitter";

export interface ISocketEmittersContext {
  channelEmitter: ChannelsSocketEmitter;
}

export const SocketEmitterContext = createContext<ISocketEmittersContext>(
  {} as ISocketEmittersContext
);

export interface SocketEmitterProviderProps {
  socketQuerySystem: SocketQuerySystem;
  children: ReactNode;
}

const SocketEmitterProvider: FC<SocketEmitterProviderProps> = ({
  children,
  socketQuerySystem,
}) => {
  const [emitters, setEmitters] = useState<ISocketEmittersContext>();

  useEffect(() => {
    return socketQuerySystem.subscribe(setEmitters);
  }, [socketQuerySystem]);

  return emitters ? (
    <SocketEmitterContext.Provider value={emitters}>
      {children}
    </SocketEmitterContext.Provider>
  ) : (
    <>{children}</>
  );
};

export default SocketEmitterProvider;
