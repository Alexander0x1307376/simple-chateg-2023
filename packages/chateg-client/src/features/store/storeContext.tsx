import {
  FC,
  ReactNode,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User, ChannelData } from "../../types/entities";
import { GeneralStore, State } from "./GeneralStore";

export interface IStoreContext {
  users: User[];
  channels: ChannelData[];
}

export const StoreContext = createContext<IStoreContext>({} as IStoreContext);

export interface UsersOnlineProviderProps {
  generalStore: GeneralStore;
  children: ReactNode;
}

const StoreContextProvider: FC<UsersOnlineProviderProps> = ({
  children,
  generalStore,
}) => {
  const [store, setStore] = useState<State>(generalStore.store);

  useEffect(() => {
    return generalStore.subscribe(setStore);
  }, [generalStore]);

  const usersArray = useMemo(() => {
    return store.users.ids.map((userId) => store.users.list[userId]);
  }, [store]);

  const channelsArray: ChannelData[] = useMemo(() => {
    const users = store.users.list;
    const channels = store.channels.list;
    const channelIds = store.channels.ids;

    return channelIds.map((channelId) => {
      const channel = channels[channelId];
      const members = channel.members.map((userId) => users[userId]);
      return {
        id: channel.id,
        name: channel.name,
        ownerId: channel.ownerId,
        members,
      } as ChannelData;
    });
  }, [store]);

  return (
    <StoreContext.Provider
      value={{ users: usersArray, channels: channelsArray }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
