import { FC, useState } from "react";
import IconedButton from "../../../components/controls/IconedButton";
import {
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

const CurrentUserSection: FC = () => {
  const { authData } = useAuth();
  const { toggleVoice, toggleVideo, streamData } = useMediaStream();

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

  return (
    <div className="flex flex-col items-stretch bg-slate-700">
      <div className="flex flex-col py-2 space-x-2 items-stretch">
        <div className="relative grow">
          {authData?.userData && <UserItem user={authData?.userData} />}
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
