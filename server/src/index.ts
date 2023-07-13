import "reflect-metadata";
import express from "express";
import { Container, ContainerModule, interfaces } from "inversify";
import { App } from "./App";
import { IEnvironmentService } from "./features/config/IEnvironmentService";
import { TYPES } from "./injectableTypes";
import { EnvironmentService } from "./features/config/EnvironmentService";
import { ILogger } from "./features/logger/ILogger";
import { LoggerService } from "./features/logger/LoggerService";
import { IMainController } from "./features/common/IMainController";
import { MainController } from "./features/common/MainController";

export interface IBootstrapReturn {
  appContainer: Container;
  app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<IEnvironmentService>(TYPES.EnvironmentService)
    .to(EnvironmentService)
    .inSingletonScope();
  bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
  bind<IMainController>(TYPES.MainController).to(MainController);

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
