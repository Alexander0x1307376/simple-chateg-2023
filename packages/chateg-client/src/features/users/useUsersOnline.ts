import { useContext } from "react";
import { UsersOnlineContext } from "./usersOnlineContext";

const useUsersOnline = () => useContext(UsersOnlineContext);

export default useUsersOnline;
