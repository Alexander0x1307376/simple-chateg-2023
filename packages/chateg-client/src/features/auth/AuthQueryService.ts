import axios from "axios";
import type { AuthResponse, LoginInput, RegistrationInput } from "./authTypes";
import { AuthStore } from "./AuthStore";
import { HttpClient } from "./HttpClient";

export class AuthQueryService {
  constructor(
    private httpClient: HttpClient,
    private authSystem: AuthStore,
    private storage: Storage,
    private readonly storageRefreshTokenKey: string
  ) {
    this.login = this.login.bind(this);
    this.refresh = this.refresh.bind(this);
    this.register = this.register.bind(this);
  }

  async register(data: RegistrationInput) {
    const response = await this.httpClient.post<
      AuthResponse,
      RegistrationInput
    >("/register", data);
    this.authSystem.set(response.data);
  }

  async login(data: LoginInput) {
    const response = await this.httpClient.post<AuthResponse, LoginInput>(
      "/login",
      data
    );
    this.authSystem.set(response.data);
  }

  async refresh() {
    const refreshToken =
      this.storage.getItem(this.storageRefreshTokenKey) || "";
    console.log("[AuthQueryService]: refreshing...");
    if (!refreshToken) {
      console.log(
        "[AuthQueryService]: No refresh token. Refetch won't be executed"
      );
      this.authSystem.clear();
      return false;
    }
    try {
      const refreshResponse = await axios.get<AuthResponse>("/api/refresh", {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      console.log(
        "[AuthQueryService]: refreshing sucsess. new refreshToken",
        refreshResponse.data.refreshToken
      );
      this.authSystem.set(refreshResponse.data);
      return true;
    } catch (e) {
      this.authSystem.clear();
      console.error("[AuthQueryService]: Unauthorized");
      return false;
    }
  }
}
