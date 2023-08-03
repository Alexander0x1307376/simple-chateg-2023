import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UsersOnlineStore, UsersData } from "../users/UsersOnlineStore";
import { User, Channel, ChannelData } from "../../types/entities";
import { ChannelsData, ChannelsStore } from "../channels/ChannelsStore";

export interface IStoreContext {
  users: User[];
  channels: ChannelData[];
}

export const StoreContext = createContext<IStoreContext>({} as IStoreContext);

export interface UsersOnlineProviderProps {
  usersOnlineStore: UsersOnlineStore;
  channelsStore: ChannelsStore;
  children: ReactNode;
}

const StoreContextProvider: FC<UsersOnlineProviderProps> = ({
  children,
  usersOnlineStore,
  channelsStore,
}) => {
  const [users, setUsers] = useState<UsersData>();
  const [channels, setChannels] = useState<ChannelsData>();

  const usersArray = useMemo(() => {
    return users ? Array.from(users, (item) => item[1]) : [];
  }, [users]);

  const channelsArray = useMemo(() => {
    return users && channels
      ? Array.from(channels, ([_, channel]) => {
          const owner = users.get(channel.ownerId);
          if (!owner) throw new Error(`No user with ${channel.ownerId} found`);
          const members = Array.from(channel.members).map((memberId) => {
            const user = users.get(memberId);
            if (!user) throw new Error(`No user with ${memberId} found`);
            return user;
          });
          return {
            id: channel.id,
            name: channel.name,
            owner,
            members,
          };
        })
      : [];
  }, [channels, users]);

  useEffect(() => {
    return usersOnlineStore.subscribe(setUsers);
  }, [usersOnlineStore]);

  useEffect(() => {
    return channelsStore.subscribe(setChannels);
  }, [channelsStore]);

  return (
    <StoreContext.Provider
      value={{ users: usersArray, channels: channelsArray }}
    >
      {children}
    </StoreContext.Provider>
  );
};
// const StoreContextProvider: FC<UsersOnlineProviderProps> = ({
//   children,
//   usersOnlineStore,
//   channelsStore,
// }) => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [channels, setChannels] = useState<Channel[]>([]);
//   const [channelsData, setChannelsData] = useState<ChannelData[]>([]);

//   useEffect(() => {
//     const unsubscribe = usersOnlineStore.subscribe((store) => {
//       const result = Array.from(store, (item) => item[1]);
//       setUsers(result);
//     });
//     return () => {
//       unsubscribe();
//     };
//   }, [usersOnlineStore]);

//   useEffect(() => {
//     const unsubscribe = channelsStore.subscribe((store) => {
//       const result = Array.from(store, (item) => {
//         const value = item[1];
//         return {
//           ...value,
//           members: Array.from(value.members),
//         };
//       });
//       setChannels(result);
//     });
//     return () => {
//       unsubscribe();
//     };
//   }, [channelsStore]);

//   return (
//     <StoreContext.Provider value={{ users, channels }}>
//       {children}
//     </StoreContext.Provider>
//   );
// };

export default StoreContextProvider;
