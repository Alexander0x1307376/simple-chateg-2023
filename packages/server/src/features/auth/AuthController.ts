import { inject, injectable } from "inversify";
import { BaseController } from "../common/BaseController";
import { TYPES } from "../../injectableTypes";
import { NextFunction, Request, Response } from "express";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./AuthService";
import { LoggerService } from "../logger/LoggerService";
import { AuthResponseDto } from "./dto/authResponse.dto";
import { getTokenFromHeader } from "../../utils/getTokenFromHeader";

@injectable()
export class AuthController extends BaseController {
  constructor(
    @inject(TYPES.Logger) private loggerService: LoggerService,
    @inject(TYPES.AuthService) private authService: AuthService
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: "/register",
        method: "post",
        func: this.register,
      },
      {
        path: "/login",
        method: "post",
        func: this.login,
      },
      {
        path: "/logout",
        method: "post",
        func: this.logout,
      },
      {
        path: "/refresh",
        method: "get",
        func: this.refresh,
      },
    ]);
  }

  async register(
    req: Request<{}, AuthResponseDto, RegisterDto>,
    res: Response,
    next: NextFunction
  ) {
    const result = await this.authService.register(req.body);
    this.ok(res, result);
  }

  async login(
    req: Request<{}, AuthResponseDto, LoginDto>,
    res: Response,
    next: NextFunction
  ) {
    const result = await this.authService.login(req.body);
    this.ok(res, result);
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const refreshToken = getTokenFromHeader(authHeader);
    await this.authService.logout(refreshToken);
    this.ok(res);
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const refreshToken = getTokenFromHeader(authHeader);
    const result = await this.authService.refresh(refreshToken);
    this.ok(res, result);
  }
}
