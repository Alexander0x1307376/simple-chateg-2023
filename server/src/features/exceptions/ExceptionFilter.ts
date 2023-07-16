import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/ILogger";
import { HTTPError } from "./HttpError";
import { TYPES } from "../../injectableTypes";

@injectable()
export class ExceptionFilter {
  constructor(@inject(TYPES.Logger) private logger: ILogger) {}

  catch(
    err: Error | HTTPError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (err instanceof HTTPError) {
      this.logger.error(
        `[${err.context}] Ошибка ${err.statusCode}: ${err.message}`
      );
      res.status(err.statusCode).send({ err: err.message });
    } else {
      this.logger.error(`${err.message}`);
      res.status(500).send({ err: err.message });
    }
  }
}
