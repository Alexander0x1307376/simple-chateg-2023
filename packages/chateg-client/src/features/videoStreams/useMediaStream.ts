import { useContext } from "react";
import { MediaStreamContext } from "./mediaStreamContext";

export const useMediaStream = () => {
  return useContext(MediaStreamContext);
};
