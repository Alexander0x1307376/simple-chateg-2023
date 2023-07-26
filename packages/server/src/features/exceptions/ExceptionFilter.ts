import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/ILogger";
import { TYPES } from "../../injectableTypes";
import ApiError from "./ApiError";

@injectable()
export class ExceptionFilter {
  constructor(@inject(TYPES.Logger) private logger: ILogger) {}

  catch(
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (err instanceof ApiError) {
      this.logger.error(`ApiError: ${err.message}`);
      res.status(err.status).send({ err: err.message });
    } else {
      this.logger.error(`${err.message}`);
      res.status(500).send({ err: err.message });
    }
  }
}
