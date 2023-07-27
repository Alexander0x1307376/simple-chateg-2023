import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { UsersOnlineStore, type UsersStore } from "./UsersOnlineStore";

export interface IUsersOnlineContext {
  users: UsersStore;
}

export const UsersOnlineContext = createContext<IUsersOnlineContext>({
  users: [],
} as IUsersOnlineContext);

export interface UsersOnlineProviderProps {
  usersOnlineStore: UsersOnlineStore;
  children: ReactNode;
}

const UsersOnlineProvider: FC<UsersOnlineProviderProps> = ({
  children,
  usersOnlineStore,
}) => {
  const [users, setUsers] = useState<UsersStore>([]);
  useEffect(() => {
    const unsubscribe = usersOnlineStore.subscribe(setUsers);
    return () => {
      unsubscribe();
    };
  }, [usersOnlineStore]);

  useEffect(() => {
    console.log({ users });
  }, [users]);

  return (
    <UsersOnlineContext.Provider value={{ users }}>
      {children}
    </UsersOnlineContext.Provider>
  );
};

export default UsersOnlineProvider;
