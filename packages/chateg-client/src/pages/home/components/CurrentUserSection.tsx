import { FC } from "react";
import IconedButton from "../../../components/controls/IconedButton";
import {
  IoMicOutline,
  IoSettingsOutline,
  IoVideocamOffOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons";
import { useAuth } from "../../../features/auth/useAuth";
import UserItem from "./UserItem";

const CurrentUserSection: FC = () => {
  const { authData } = useAuth();

  return (
    <div className="flex flex-col items-stretch bg-slate-700">
      <div className="flex flex-col py-2 space-x-2 items-stretch">
        <div className="relative grow">
          {authData?.userData && <UserItem user={authData?.userData} />}
        </div>
        <div className="flex justify-end pr-2">
          <IconedButton
            size="1.4rem"
            icon={IoMicOutline as IconType}
            // icon={IoMicOffOutline}
          />
          <IconedButton
            size="1.4rem"
            icon={IoVideocamOffOutline as IconType}
            // icon={IoVideocamOutline}
          />
          <IconedButton
            size="1.4rem"
            icon={IoVolumeMuteOutline as IconType}
            // icon={IoVolumeHighOutline}
          />
          <IconedButton size="1.4rem" icon={IoSettingsOutline as IconType} />
        </div>
      </div>
    </div>
  );
};

export default CurrentUserSection;
