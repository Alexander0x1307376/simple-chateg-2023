import { useContext } from "react";
import { SocketEmitterContext } from "./socketEmitterContext";

export const useSocketEmitters = () => {
  return useContext(SocketEmitterContext);
};
