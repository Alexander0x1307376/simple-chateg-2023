import { inject, injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { TYPES } from "../../injectableTypes";
import { ILogger } from "../logger/ILogger";

@injectable()
export class DataSource {
  client: PrismaClient;

  constructor(@inject(TYPES.Logger) private logger: ILogger) {
    this.client = new PrismaClient();
    this.logger.log("[DataSource] соединение с БД установлено");
  }
}
