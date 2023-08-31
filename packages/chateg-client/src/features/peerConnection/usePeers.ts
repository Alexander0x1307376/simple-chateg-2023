/* eslint-disable @typescript-eslint/unbound-method */
import { useContext, useEffect, useState } from "react";
import { PeersContext } from "./peersContext";

export const usePeers = () => {
  const { peerConnections } = useContext(PeersContext);

  const [streams, setStreams] = useState<[string, MediaStream[]][]>([]);

  useEffect(() => {
    const handlePeersRemoved = () => {
      console.log(`[usePeers]: handlePeersRemoved`);
      setStreams([]);
    };

    const handleAddStreams = (peerId: string, streams: MediaStream[]) => {
      console.log(`[usePeers]: handleAddStreams`, { peerId, streams });
      setStreams((prev) => {
        // проверяем, что не добавляем второй стрим
        const streamIndex = prev.findIndex(([key]) => key === peerId);
        if (streamIndex !== -1) {
          prev[streamIndex] = [peerId, streams];
          return [...prev];
        } else return [...prev, [peerId, streams]];
      });
    };

    const handlePeerRemoved = (peerId: string) => {
      setStreams((prev) => prev.filter(([key]) => key !== peerId));
    };

    peerConnections.onAllPeersRemoved(handlePeersRemoved);
    peerConnections.onStreamsAdded(handleAddStreams);
    peerConnections.onPeerRemoved(handlePeerRemoved);

    return () => {
      peerConnections.offAllPeersRemoved(handlePeersRemoved);
      peerConnections.offStreamsAdded(handleAddStreams);
    };
  }, [peerConnections]);

  return { streams };
};
