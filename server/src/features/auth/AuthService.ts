import { inject, injectable } from "inversify";
import { TYPES } from "../../injectableTypes";
import { LoggerService } from "../logger/LoggerService";
import { DataSource } from "../dataSource/DataSource";
import { PrismaClient } from "@prisma/client";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthResponseDto } from "./dto/authResponse.dto";
import ApiError from "../exceptions/ApiError";
import { compare, genSalt, hash } from "bcrypt";
import { EnvironmentService } from "../config/EnvironmentService";
import { sign, verify } from "jsonwebtoken";
import { AuthPayload } from "./dto/authPayload.dto";

@injectable()
export class AuthService {
  private db: PrismaClient;
  private accessSecret: string;
  private refreshSecret: string;
  private accessTokenExpiresIn: string;
  private refreshTokenExpiresIn: string;

  constructor(
    @inject(TYPES.Logger) private logger: LoggerService,
    @inject(TYPES.EnvironmentService)
    private environmentService: EnvironmentService,
    @inject(TYPES.DataSource) private dataSource: DataSource
  ) {
    this.db = dataSource.client;
    this.accessSecret = environmentService.get("JWT_ACCESS_SECRET");
    this.refreshSecret = environmentService.get("JWT_REFRESH_SECRET");
    this.accessTokenExpiresIn = environmentService.get(
      "ACCESS_TOKEN_EXPIRES_IN"
    );
    this.refreshTokenExpiresIn = environmentService.get(
      "REFRESH_TOKEN_EXPIRES_IN"
    );
  }

  async register(registerData: RegisterDto): Promise<AuthResponseDto> {
    const { name, password, passwordConfirm } = registerData;

    if (password !== passwordConfirm)
      throw ApiError.BadRequest("Пароль и подтверждение пароля не совпадают");

    const user = await this.db.user.findUnique({
      select: { id: true },
      where: { name },
    });
    if (user) throw ApiError.Conflict("Такой пользователь уже существует");

    const createdUser = await this.db.user.create({ data: { name } });

    const salt = await genSalt();
    const cryptedPassword = await hash(password, salt);
    const { accessToken, refreshToken } = this.generateTokens({
      id: createdUser.id,
      name: createdUser.name,
    });

    await this.db.auth.create({
      data: {
        password: cryptedPassword,
        userId: createdUser.id,
        refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
      userData: {
        id: createdUser.id,
        name: createdUser.name,
      },
    };
  }

  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    const { login, password } = loginData;

    const user = await this.db.user.findUnique({
      where: { name: login },
      include: {
        auth: {
          select: {
            password: true,
          },
        },
      },
    });

    const errorMessage = `Неверный логин или пароль`;
    if (!user) throw ApiError.BadRequest(errorMessage);
    if (!(await compare(password, user.auth.password))) {
      throw ApiError.BadRequest(errorMessage);
    }

    const userData = {
      id: user.id,
      name: user.name,
    };
    const { accessToken, refreshToken } = this.generateTokens(userData);
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      userData,
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await this.db.auth.update({
        where: { refreshToken },
        data: { refreshToken: null },
      });
    } catch (e) {
      throw ApiError.BadRequest();
    }
  }

  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    if (!refreshToken) throw ApiError.UnauthorizedError();

    const validationResult = this.validateToken(refreshToken, "refresh");
    if (!validationResult) throw ApiError.UnauthorizedError();

    const authData = await this.db.auth.findUnique({
      where: { refreshToken },
      select: {
        refreshToken: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!authData) throw ApiError.UnauthorizedError();

    const userData = {
      id: authData.user.id,
      name: authData.user.name,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      this.generateTokens(userData);
    await this.saveRefreshToken(authData.user.id, newRefreshToken);

    return {
      userData,
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  public validateToken(
    token: string,
    tokenType: "access" | "refresh"
  ): AuthPayload | undefined {
    if (tokenType !== "access" && tokenType !== "refresh")
      throw new Error("unknown token type");

    try {
      return verify(
        token,
        tokenType === "access" ? this.accessSecret : this.refreshSecret
      ) as AuthPayload;
    } catch (error: any) {
      return undefined;
    }
  }

  private generateTokens(payload: any): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = sign(payload, this.accessSecret, {
      expiresIn: this.accessTokenExpiresIn,
    });

    const refreshToken = sign(payload, this.refreshSecret, {
      expiresIn: this.refreshTokenExpiresIn,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveRefreshToken(userId: number, refreshToken: string) {
    console.log("REFPAR", refreshToken);
    const result = await this.db.auth.update({
      where: { userId },
      data: { refreshToken },
    });
    console.log("SAVE", result);
  }
}
