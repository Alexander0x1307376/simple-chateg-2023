import { NextFunction, Request, Response } from "express";
import { IMiddleware } from "../common/IMiddleware";
import ApiError from "../exceptions/ApiError";
import { RequestWithAuthData } from "./types/requestWithAuthData";

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
