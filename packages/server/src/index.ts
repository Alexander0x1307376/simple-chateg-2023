import "reflect-metadata";
import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./App";
import { IEnvironmentService } from "./features/config/IEnvironmentService";
import { TYPES } from "./injectableTypes";
import { EnvironmentService } from "./features/config/EnvironmentService";
import { ILogger } from "./features/logger/ILogger";
import { LoggerService } from "./features/logger/LoggerService";
import { MainController } from "./features/common/MainController";
import { DataSource } from "./features/dataSource/DataSource";
import { AuthController } from "./features/auth/AuthController";
import { AuthService } from "./features/auth/AuthService";
import { ExceptionFilter } from "./features/exceptions/ExceptionFilter";
import { AuthMiddleware } from "./features/auth/AuthMiddleware";
import { UsersController } from "./features/users/UsersController";
import { UsersService } from "./features/users/UsersService";
import { WebSocketSystem } from "./features/webSockets/WebSocketSystem";

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<IEnvironmentService>(TYPES.EnvironmentService)
    .to(EnvironmentService)
    .inSingletonScope();
  bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
  bind<DataSource>(TYPES.DataSource).to(DataSource).inSingletonScope();
  bind<ExceptionFilter>(TYPES.ExceptionFilter)
    .to(ExceptionFilter)
    .inSingletonScope();
  bind<MainController>(TYPES.MainController).to(MainController);

  bind<UsersController>(TYPES.UsersController).to(UsersController);
  bind<UsersService>(TYPES.UsersService).to(UsersService);

  bind<AuthController>(TYPES.AuthController).to(AuthController);
  bind<AuthService>(TYPES.AuthService).to(AuthService);
  bind<AuthMiddleware>(TYPES.AuthMiddleware)
    .to(AuthMiddleware)
    .inSingletonScope();

  bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container({
    skipBaseClassChecks: true,
  });
  appContainer.load(appBindings);
  const app = appContainer.get<App>(TYPES.Application);
  await app.init();
  return { appContainer, app };
}

export const boot = bootstrap();
