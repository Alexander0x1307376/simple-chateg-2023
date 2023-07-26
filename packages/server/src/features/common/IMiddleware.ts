import { NextFunction, Request, Response } from "express";

export interface IMiddleware<T extends Request> {
  execute: (req: T, res: Response, next: NextFunction) => void;
}
