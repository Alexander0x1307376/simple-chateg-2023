import "reflect-metadata";
import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/ILogger";
import { TYPES } from "../../injectableTypes";

@injectable()
export class EnvironmentService {
  private config: DotenvParseOutput;
  constructor(@inject(TYPES.Logger) private logger: ILogger) {
    const result: DotenvConfigOutput = config();
    if (result.error) {
      this.logger.error(
        "[EnvironmentService] Не удалось прочитать файл .env или он отсутствует"
      );
    } else {
      this.logger.log("[EnvironmentService] Конфигурация .env загружена");
      this.config = result.parsed as DotenvParseOutput;
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
