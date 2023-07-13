import { inject, injectable } from "inversify";
import { TYPES } from "./injectableTypes";
import { Logger } from "tslog";
import { IEnvironmentService } from "./features/config/IEnvironmentService";
import { ILogger } from "./features/logger/ILogger";
import express, { Express, json, urlencoded } from "express";
import { Server } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { IMainController } from "./features/common/IMainController";
import { MainController } from "./features/common/MainController";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.EnvironmentService)
    private environmentService: IEnvironmentService,
    @inject(TYPES.MainController) private mainController: MainController
  ) {
    this.app = express();
    this.port = parseInt(this.environmentService.get("PORT"));
  }

  private useRoutes() {
    this.app.use("/", this.mainController.router);
  }

  private useMiddleware() {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(urlencoded({ extended: true }));
  }

  async init() {
    this.useRoutes();
    this.useMiddleware();

    this.app.listen(this.port, () => {
      this.logger.log(`API сервер запущен на http://localhost:${this.port}`);
    });
  }
}
