/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FC } from "react";
import VideoRoomItem from "./components/VideoRoomItem";
import UserItem from "./components/UserItem";
import { User } from "../../types/entities";
import Sidebar from "../../components/layouts/Sidebar";
import { Outlet } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import IconedButton from "../../components/controls/IconedButton";
import CurrentUserSection from "./components/CurrentUserSection";
import useUsersOnline from "../../features/users/useUsersOnline";
import ContextMenu from "../../features/contextMenu/ContextMenu";
import { useContextMenu } from "../../features/contextMenu/useContextMenu";

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

const contextItems = [
  {
    key: "callUser",
    label: "Позвонить",
  },
  {
    key: "testBtn1",
    label: "Вторая кнопа",
  },
  {
    key: "testBtn2",
    label: "Третья кнопа",
  },
];

const Home: FC = () => {
  const { users: usersOnline } = useUsersOnline();

  const { menuPosition, handleContextClick, ref } = useContextMenu();

  const handleUserClick = () => {
    //
  };

  const handleContextMenuItemClick = (key: string) => {
    console.log("clicked", key);
  };

  return (
    <div className="flex h-full items-stretch">
      <ContextMenu
        ref={ref}
        onClick={handleContextMenuItemClick}
        position={menuPosition}
        items={contextItems}
      />

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
          {meetings.length ? (
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
          ) : (
            <div className="p-2">пока что нет</div>
          )}
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
              <h2>Пользователи онлайн: {usersOnline.length}</h2>
            </div>
          }
          footer={<CurrentUserSection />}
        >
          <ul onContextMenu={handleContextClick}>
            {usersOnline.map((item) => (
              <li key={item.id}>
                <button
                  className="hover:bg-black/25 w-full"
                  onClick={handleUserClick}
                >
                  <UserItem user={item} />
                </button>
              </li>
            ))}
          </ul>
        </Sidebar>
      </div>
    </div>
  );
};

export default Home;
