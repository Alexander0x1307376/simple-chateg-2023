import { useContext } from "react";
import { StoreContext } from "./storeContext";

const useStore = () => useContext(StoreContext);

export default useStore;
