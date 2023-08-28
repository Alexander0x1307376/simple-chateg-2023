import { FC } from "react";
import { useMediaStream } from "../../../features/videoStreams/useMediaStream";
import { IoMicOffOutline, IoVideocamOffOutline } from "react-icons/io5";
import Ava from "../../../components/common/Ava";
import { useAuth } from "../../../features/auth/useAuth";

const LocalStream: FC = () => {
  const { isThisStreamLoading, thisStream, streamData, setVideoElement } = useMediaStream();
  const { authData } = useAuth();

  return (
    <div className="mx-2 h-40 w-60 my-2 flex items-center justify-center space-x-2 bg-slate-600">
      {!isThisStreamLoading && thisStream && streamData.isVideoOn ? (
        <div className="relative flex items-center justify-center h-full w-full">
          <video className="h-full" autoPlay muted ref={setVideoElement} />
          <div className="absolute right-2 bottom-2">
            {!streamData.isVoiceOn && <IoMicOffOutline size="1.5rem" />}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <Ava
            label={authData?.userData.name || "un"}
            url={authData?.userData.avaUrl}
            size="3rem"
          />
          <div className="flex items-center space-x-2">
            <span>{authData?.userData.name || "undefined!"}</span>
            {!streamData.isVideoOn && (
              <span>
                <IoVideocamOffOutline size="1.5rem" />
              </span>
            )}
            {!streamData.isVoiceOn && (
              <span>
                <IoMicOffOutline size="1.5rem" />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalStream;
