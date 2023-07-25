import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { AuthDataStore, AuthSystem } from "./AuthSystem";
import { AuthQueryService } from "./AuthQueryService";
import { LoginInput, RegistrationInput } from "./authTypes";

export interface IAuthContext {
  authData: AuthDataStore;
  register: (data: RegistrationInput) => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export interface AuthProviderProps {
  authSystem: AuthSystem;
  authQueryService: AuthQueryService;
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({
  children,
  authSystem,
  authQueryService,
}) => {
  const [authData, setAuthData] = useState<AuthDataStore>(authSystem.authData);

  useEffect(() => {
    return authSystem.subscribe(setAuthData);
  }, [authSystem]);

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
