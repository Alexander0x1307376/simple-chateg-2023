/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FC } from "react";
import VideoRoomItem from "./components/VideoRoomItem";
import UserItem from "./components/UserItem";
import { User } from "../../types/entities";
import Sidebar from "../../components/layouts/Sidebar";
import { Outlet } from "react-router-dom";
import {
  IoAddOutline,
  IoMicOutline,
  IoSettingsOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";
import IconedButton from "../../components/controls/IconedButton";
import { useAuth } from "../../features/auth/useAuth";

const meetings = [
  {
    id: 1,
    name: "Конфа 1",
  },
  {
    id: 2,
    name: "Конфа 2",
  },
  {
    id: 3,
    name: "Конфа 3",
  },
  {
    id: 4,
    name: "Конфа 4",
  },
];

const users: User[] = [
  {
    id: 1,
    name: "Vasya",
    avaUrl: "https://i.pravatar.cc/150?img=38",
  },
  {
    id: 2,
    name: "Abraham Habul Ibn Hassan de El Savlvador",
    avaUrl: "https://i.pravatar.cc/150?img=37",
  },
  {
    id: 3,
    name: "Николай иванович",
  },
  {
    id: 4,
    name: "Pussy Destroyeer",
    avaUrl: "https://i.pravatar.cc/150?img=35",
  },
];

const usersOnline = [
  {
    id: 1,
    name: "Vasya",
    avaUrl: "https://i.pravatar.cc/150?img=38",
  },
  {
    id: 2,
    name: "Abraham Habul Ibn Hassan de El Savlvador",
    avaUrl: "https://i.pravatar.cc/150?img=37",
  },
  {
    id: 3,
    name: "Николай иванович",
  },
  {
    id: 4,
    name: "Pussy Destroyeer",
    avaUrl: "https://i.pravatar.cc/150?img=35",
  },
];

const Home: FC = () => {
  const { authData } = useAuth();

  return (
    <div className="flex h-full items-stretch">
      {/* left sidebar */}
      <div className="w-60 p-2">
        <Sidebar
          header={
            <div className="flex items-center">
              <div className="p-2 grow">
                <h2>Видеоконференции</h2>
              </div>
              <div className="pr-1">
                <IconedButton size="1.4rem" icon={IoAddOutline} />
              </div>
            </div>
          }
        >
          <div className="p-2">пока что нет </div>
          <ul>
            {meetings.map((item) => (
              <li key={item.id}>
                <VideoRoomItem
                  roomName={item.name}
                  roomId={item.id.toString()}
                  users={users}
                />
              </li>
            ))}
          </ul>
        </Sidebar>
      </div>
      {/* main Content */}
      <div className="grow flex flex-col">
        <div className="h-full">
          <Outlet />
        </div>
      </div>
      {/* right sidebar */}
      <div className="w-60 p-2">
        <Sidebar
          header={
            <div className="p-2">
              <h2>Пользователи онлайн: 4</h2>
            </div>
          }
          footer={
            <div className="flex flex-col items-stretch bg-slate-700">
              <div className="flex flex-col py-2 space-x-2 items-stretch">
                <div className="relative grow">
                  {authData?.userData && <UserItem user={authData?.userData} />}
                </div>
                <div className="flex justify-end pr-2">
                  <IconedButton
                    size="1.4rem"
                    icon={IoMicOutline}
                    // icon={IoMicOffOutline}
                  />
                  <IconedButton
                    size="1.4rem"
                    icon={IoVolumeMuteOutline}
                    // icon={IoVolumeHighOutline}
                  />
                  <IconedButton size="1.4rem" icon={IoSettingsOutline} />
                </div>
              </div>
            </div>
          }
        >
          <ul>
            {usersOnline.map((item) => (
              <li key={item.id}>
                <UserItem user={item} />
              </li>
            ))}
          </ul>
        </Sidebar>
      </div>
    </div>
  );
};

export default Home;
