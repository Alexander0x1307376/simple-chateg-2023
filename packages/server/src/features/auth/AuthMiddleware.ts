import "reflect-metadata";
import { NextFunction, Response } from "express";
import { IMiddleware } from "../common/IMiddleware";
import { AuthService } from "./AuthService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../injectableTypes";
import { getTokenFromHeader } from "../../utils/getTokenFromHeader";
import { RequestWithAuthData } from "./types/requestWithAuthData";

/**
 * AuthMiddleware получает заголовок authorization в реквесте,
 * извлекает из него данные юзера и крепит их к реквесту
 * для дальнейшего использования в AuthGuard
 */
@injectable()
export class AuthMiddleware implements IMiddleware<RequestWithAuthData> {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  execute(req: RequestWithAuthData, res: Response, next: NextFunction): void {
    if (req.headers.authorization) {
      const accessToken = getTokenFromHeader(req.headers.authorization);

      const payload = this.authService.validateToken(accessToken, "access");
      if (!payload) {
        next();
        return;
      }
      req.user = payload;
    }
    next();
  }
}
