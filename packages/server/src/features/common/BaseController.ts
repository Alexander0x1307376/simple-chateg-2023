import "reflect-metadata";
import { NextFunction, Request, Response, Router } from "express";
import { injectable } from "inversify";
import { ExpressReturnType, IControllerRoute } from "./IControllerRoute";
export { Router } from "express";
import { ILogger } from "../logger/ILogger";

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: ILogger) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T): ExpressReturnType {
    res.type("application/json");
    return res.status(code).json(message);
  }

  public ok<T>(res: Response, message?: T): ExpressReturnType {
    return this.send<T>(res, 200, message);
  }

  public created(res: Response): ExpressReturnType {
    return res.sendStatus(201);
  }

  protected bindRoutes(routes: IControllerRoute[]): void {
    for (const route of routes) {
      // this.logger.log(`[${route.method}] ${route.path}`);
      const middleware = route.middlewares?.map((m) => m.execute.bind(m));

      const bindedMethod = route.func.bind(this);
      const handler = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          await bindedMethod(req, res, next);
        } catch (e) {
          next(e);
        }
      };

      const pipeline = middleware ? [...middleware, handler] : handler;
      this.router[route.method](route.path, pipeline);
    }
  }
}