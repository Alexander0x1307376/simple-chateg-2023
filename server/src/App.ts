import { inject, injectable } from "inversify";
import { TYPES } from "./injectableTypes";
import { IEnvironmentService } from "./features/config/IEnvironmentService";
import { ILogger } from "./features/logger/ILogger";
import express, { Express, urlencoded } from "express";
import { Server } from "https";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { MainController } from "./features/common/MainController";
import { DataSource } from "./features/dataSource/DataSource";
import { AuthController } from "./features/auth/AuthController";
import { ExceptionFilter } from "./features/exceptions/ExceptionFilter";
import { json } from "body-parser";
import { AuthMiddleware } from "./features/auth/AuthMiddleware";
import { UsersController } from "./features/users/UsersController";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;
  corsOptions: CorsOptions;
  corsOrigin: string;

  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.EnvironmentService)
    private environmentService: IEnvironmentService,
    @inject(TYPES.DataSource) private dataSource: DataSource,
    @inject(TYPES.MainController) private mainController: MainController,
    @inject(TYPES.UsersController) private usersController: UsersController,
    @inject(TYPES.AuthController) private authController: AuthController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
    @inject(TYPES.AuthMiddleware) private authMiddleware: AuthMiddleware
  ) {
    this.app = express();
    this.port = parseInt(this.environmentService.get("PORT"));

    this.corsOptions = {
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    };
  }

  private useRoutes() {
    this.app.use("/", this.authController.router);
    this.app.use("/", this.mainController.router);
    this.app.use("/", this.usersController.router);
  }

  private useMiddleware() {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(urlencoded({ extended: true }));

    this.app.use(this.authMiddleware.execute.bind(this.authMiddleware));
  }

  useExeptionFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  async init() {
    this.useMiddleware();
    this.useRoutes();

    this.useExeptionFilters();

    this.app.listen(this.port, () => {
      this.logger.log(
        `[App] API сервер запущен на http://localhost:${this.port}`
      );
    });
  }
}
