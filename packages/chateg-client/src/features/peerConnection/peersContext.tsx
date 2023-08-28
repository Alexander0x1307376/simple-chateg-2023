import { FC, ReactNode, createContext } from "react";
import { PeerConnections } from "./PeerConnections";

export interface IPeerContext {
  peerConnections: PeerConnections;
}

export const PeersContext = createContext<IPeerContext>({} as IPeerContext);

export interface PeersProvidersProps {
  children: ReactNode;
  peerConnections: PeerConnections;
}

const PeersProvider: FC<PeersProvidersProps> = ({ children, peerConnections }) => {
  return <PeersContext.Provider value={{ peerConnections }}>{children}</PeersContext.Provider>;
};

export default PeersProvider;
