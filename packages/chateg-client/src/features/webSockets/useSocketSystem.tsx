import { ReactNode, createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const socket = io();

export interface IWebsocketContext {
  socket?: Socket;
}

export const WebsocketContext = createContext<IWebsocketContext | undefined>(
  undefined
);

const WebsocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | undefined>();

  useEffect(() => {
    //
  }, []);

  return (
    <WebsocketContext.Provider value={{ socket }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export default WebsocketProvider;
