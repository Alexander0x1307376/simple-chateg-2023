import { inject, injectable } from "inversify";
import { BaseController } from "./BaseController";
import { TYPES } from "../../injectableTypes";
import { ILogger } from "../logger/ILogger";
import { NextFunction, Request, Response } from "express";

@injectable()
export class MainController extends BaseController {
  constructor(@inject(TYPES.Logger) logger: ILogger) {
    super(logger);

    this.bindRoutes([
      {
        path: "/hello",
        method: "get",
        func: this.hello,
      },
    ]);
  }

  async hello(req: Request | any, res: Response, next: NextFunction) {
    this.ok(res, { message: "hello world" });
  }
}
