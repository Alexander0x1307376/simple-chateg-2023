export type AuthResponse = {
  userData: {
    id: number;
    name: string;
    avaUrl?: string;
  };
  accessToken: string;
  refreshToken: string;
};

export type RegistrationResponse = AuthResponse;

export type RegistrationInput = {
  name: string;
  password: string;
  passwordConfirm: string;
};

export type LoginInput = {
  login: string;
  password: string;
};
