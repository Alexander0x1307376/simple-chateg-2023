import { inject, injectable } from "inversify";
import { BaseController } from "./BaseController";
import { TYPES } from "../../injectableTypes";
import { ILogger } from "../logger/ILogger";
import { NextFunction, Request, Response } from "express";
import { AuthGuard } from "../auth/AuthGuard";

@injectable()
export class MainController extends BaseController {
  constructor(@inject(TYPES.Logger) logger: ILogger) {
    super(logger);

    const authGuard = new AuthGuard();

    this.bindRoutes([
      {
        path: "/hello",
        method: "get",
        func: this.hello,
        middlewares: [authGuard],
      },
    ]);
  }

  async hello(req: Request | any, res: Response, next: NextFunction) {
    this.ok(res, { message: "hello world" });
  }
}
