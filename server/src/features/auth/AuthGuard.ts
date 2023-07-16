import { NextFunction, Request, Response } from "express";
import { IMiddleware } from "../common/IMiddleware";
import { RequestWithAuthData } from "./types/RequestWithAuthData";
import ApiError from "../exceptions/ApiError";

/**
 * AuthGuard проверяет наличие данных пользователя, которые получают из токена в AuthMiddleware
 * и если их нет - возвращает ошибку авторизации
 */
export class AuthGuard implements IMiddleware<RequestWithAuthData> {
  execute(req: RequestWithAuthData, res: Response, next: NextFunction): void {
    if (!req.user) {
      throw ApiError.UnauthorizedError();
    }
    next();
  }
  // execute(req: RequestWithAuthData, res: Response, next: NextFunction): void {
  //   if (req.user) {
  //     return next();
  //   }
  //   res.status(401).send({ error: "Не авторизован" });
  // }
}
