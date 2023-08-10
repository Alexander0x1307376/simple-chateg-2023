/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FC, useState } from "react";
import UserItem from "./components/UserItem";
import Sidebar from "../../components/layouts/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import IconedButton from "../../components/controls/IconedButton";
import CurrentUserSection from "./components/CurrentUserSection";
import useStore from "../../features/store/useStore";
import ContextMenu from "../../features/contextMenu/ContextMenu";
import { useContextMenu } from "../../features/contextMenu/useContextMenu";
import CreateChannel from "./components/CreateChannel";
import VideoRoomsList from "./components/VideoRoomsList";
import { useSocketEmitters } from "../../features/webSockets/useSoketEmitters";

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
  const { users: usersOnline } = useStore();
  const { menuPosition, handleContextClick, ref } = useContextMenu();
  const { channelEmitter } = useSocketEmitters();
  const navigate = useNavigate();

  const handleCreateChannel = async (values: { name: string }) => {
    console.log("handleCreateChannel!");
    const result = await channelEmitter.createChannel(values.name);
    console.log("RESULT", result);
    setIsCreateChannelModalVisible(false);
    navigate(result.id);
  };

  const handleUserClick = () => {
    //
  };

  const handleContextMenuItemClick = (key: string) => {
    console.log("clicked", key);
  };

  const [isCreateChannelModalVisible, setIsCreateChannelModalVisible] = useState<boolean>(false);

  return (
    <>
      <ContextMenu
        ref={ref}
        onClick={handleContextMenuItemClick}
        position={menuPosition}
        items={contextItems}
      />
      <CreateChannel
        isVisible={isCreateChannelModalVisible}
        onClose={() => setIsCreateChannelModalVisible(false)}
        onCreateClick={handleCreateChannel}
      />
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
                  <IconedButton
                    size="1.4rem"
                    icon={IoAddOutline}
                    onClick={() => setIsCreateChannelModalVisible(true)}
                  />
                </div>
              </div>
            }
          >
            <VideoRoomsList />
          </Sidebar>
        </div>
        {/* main Content */}
        <div className="relative grow flex flex-col">
          <div className="absolute inset-0 overflow-auto">
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
                  <button className="hover:bg-black/25 w-full" onClick={handleUserClick}>
                    <UserItem user={item} />
                  </button>
                </li>
              ))}
            </ul>
          </Sidebar>
        </div>
      </div>
    </>
  );
};

export default Home;
