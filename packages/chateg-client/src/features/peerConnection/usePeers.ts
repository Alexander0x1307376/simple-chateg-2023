/* eslint-disable @typescript-eslint/unbound-method */
import { useCallback, useContext, useEffect, useState } from "react";
import { PeersContext } from "./peersContext";
import { PeerItem } from "./PeerConnections";

// export const usePeers = () => useContext(PeersContext);
export const usePeers = () => {
  const { peerConnections } = useContext(PeersContext);

  const [connections, setConnections] = useState<Record<string, PeerItem>>();

  useEffect(() => {
    const unsubscribeSetConnections = peerConnections.subscribe((store) =>
      setConnections({ ...store }),
    );

    return () => {
      unsubscribeSetConnections();
    };
  }, [peerConnections]);

  const getPeerItemByUserId = useCallback(
    (userId: number) => {
      if (!connections) return;

      for (const key in connections) {
        const peerItem = connections[key];
        if (peerItem.peerData.userId === userId) return peerItem;
      }
      console.warn(`[usePeers]:getPeerItemByUserId: no peerData for user with id: ${userId}`);
    },
    [connections],
  );

  return { connections, getPeerItemByUserId };
};
