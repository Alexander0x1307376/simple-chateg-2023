import { FC, useState } from "react";
import IconedButton from "../../../components/controls/IconedButton";
import {
  IoExitOutline,
  IoMicOffOutline,
  IoMicOutline,
  IoSettingsOutline,
  IoVideocamOffOutline,
  IoVideocamOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons";
import { useAuth } from "../../../features/auth/useAuth";
import UserItem from "./UserItem";
import { useMediaStream } from "../../../features/videoStreams/useMediaStream";
import { useNavigate, useParams } from "react-router-dom";

const CurrentUserSection: FC = () => {
  const { authData } = useAuth();
  const { toggleVoice, toggleVideo, streamData } = useMediaStream();
  const { channelId } = useParams();
  const navigate = useNavigate();

  const [isVolumeOn, setIsVolumeOn] = useState<boolean>(true);

  const handleToggleMicrophone = () => {
    toggleVoice();
  };
  const handleToggleWebcamera = () => {
    toggleVideo();
  };
  const handleToggleVolume = () => {
    setIsVolumeOn((prev) => !prev);
  };

  const handleQuit = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-stretch bg-slate-700">
      <div className="flex flex-col py-2 space-x-2 items-stretch space-y-2">
        <div className="relative grow flex items-center">
          <div className="grow">{authData?.userData && <UserItem user={authData?.userData} />}</div>
          <div className="pr-2">
            {channelId && (
              <button
                onClick={handleQuit}
                className="p-2 bg-red-400 rounded text-white active:translate-y-[1px] transition-transform duration-75"
              >
                <IoExitOutline size="1.4rem" />
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-end pr-2">
          {/* Кнопа микрофона */}
          <IconedButton
            onClick={handleToggleMicrophone}
            size="1.4rem"
            icon={(streamData?.isVoiceOn ? IoMicOutline : IoMicOffOutline) as IconType}
          />
          {/* Кнопа вебки */}
          <IconedButton
            onClick={handleToggleWebcamera}
            size="1.4rem"
            icon={(streamData?.isVideoOn ? IoVideocamOutline : IoVideocamOffOutline) as IconType}
          />
          {/* Кнопа звука */}
          <IconedButton
            onClick={handleToggleVolume}
            size="1.4rem"
            icon={(isVolumeOn ? IoVolumeHighOutline : IoVolumeMuteOutline) as IconType}
          />
          <IconedButton size="1.4rem" icon={IoSettingsOutline as IconType} />
        </div>
      </div>
    </div>
  );
};

export default CurrentUserSection;
