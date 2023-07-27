import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { AuthDataStore, AuthStore } from "./AuthStore";
import { AuthQueryService } from "./AuthQueryService";
import { LoginInput, RegistrationInput } from "./authTypes";

export interface IAuthContext {
  authData: AuthDataStore;
  register: (data: RegistrationInput) => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export interface AuthProviderProps {
  authStore: AuthStore;
  authQueryService: AuthQueryService;
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({
  children,
  authStore,
  authQueryService,
}) => {
  const [authData, setAuthData] = useState<AuthDataStore>(authStore.authData);

  useEffect(() => {
    return authStore.subscribe(setAuthData);
  }, [authStore]);

  return (
    <AuthContext.Provider
      value={{
        authData,
        login: (data) => authQueryService.login(data),
        register: (data) => authQueryService.register(data),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
