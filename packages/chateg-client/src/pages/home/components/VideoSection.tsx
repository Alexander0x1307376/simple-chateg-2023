import { FC, useEffect, useState } from "react";
import { useMediaStream } from "../../../features/videoStreams/useMediaStream";
import Ava from "../../../components/common/Ava";
import { useAuth } from "../../../features/auth/useAuth";

const videoCalls = Array.from({ length: 13 }, (_, index) => ({ id: index }));

const VideoSection: FC = () => {
  const { authData } = useAuth();

  const { mediaStreamService } = useMediaStream();
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>();
  const [thisStream, setThisStream] = useState<MediaStream | null>();

  const [isThisStreamLoading, setIsThisStreamLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsThisStreamLoading(true);
    mediaStreamService
      .getMediaStream()
      .then(setThisStream)
      .catch((err: { message?: string }) => {
        console.error(err);
      })
      .finally(() => setIsThisStreamLoading(false));
  }, [mediaStreamService]);

  useEffect(() => {
    if (!(videoElement && thisStream)) return;
    videoElement.srcObject = thisStream;
  }, [videoElement, thisStream]);

  return (
    <div className="flex rounded-lg flex-wrap justify-center">
      <div className="mx-2 h-40 w-60 flex items-center justify-center my-2 space-x-2 bg-slate-600">
        {!isThisStreamLoading && thisStream ? (
          <video className="h-full" autoPlay muted ref={setVideoElement} />
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Ava
              label={authData?.userData.name || "un"}
              url={authData?.userData.avaUrl}
              size="3rem"
            />
            <span>{authData?.userData.name || "undefined!"}</span>
          </div>
        )}
      </div>
      {videoCalls.map((item) => (
        <div key={item.id} className="mx-2 h-40 w-60 my-2 bg-green-900">
          {item.id}
        </div>
      ))}
    </div>
  );
};

export default VideoSection;
