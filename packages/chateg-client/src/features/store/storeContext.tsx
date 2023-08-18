import { FC, ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { User, ChannelData, ChannelTransfer } from "../../types/entities";
import { Store } from "./MegaStore/Store";

export interface IStoreContext {
  users: User[];
  channels: ChannelData[];
}

export const StoreContext = createContext<IStoreContext>({} as IStoreContext);

export interface UsersOnlineProviderProps {
  usersStore: Store<User>;
  channelsStore: Store<ChannelTransfer>;
  children: ReactNode;
}

const StoreContextProvider: FC<UsersOnlineProviderProps> = ({
  children,
  usersStore,
  channelsStore,
}) => {
  const [users, setUsers] = useState<Record<string, User>>(usersStore.data);
  const [channels, setChannels] = useState<Record<string, ChannelTransfer>>(channelsStore.data);

  useEffect(() => {
    return usersStore.subscribe(setUsers);
  }, [usersStore]);
  useEffect(() => {
    return channelsStore.subscribe(setChannels);
  }, [channelsStore]);

  const usersArray: User[] = useMemo(() => {
    return Object.values(users);
  }, [users]);

  const channelsArray: ChannelData[] = useMemo(() => {
    const channelsList = Object.values(channels);
    const result: ChannelData[] = channelsList.map((item) => ({
      id: item.id,
      name: item.name,
      ownerId: item.ownerId,
      members: item.members.map((memberId) => users[memberId.toString()]),
    }));
    return result;
  }, [users, channels]);

  return (
    <StoreContext.Provider value={{ users: usersArray, channels: channelsArray }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
