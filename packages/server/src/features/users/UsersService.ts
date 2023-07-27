import { PrismaClient, User } from "@prisma/client";
import { inject, injectable } from "inversify";
import { TYPES } from "../../injectableTypes";
import { DataSource } from "../dataSource/DataSource";
import { LoggerService } from "../logger/LoggerService";

@injectable()
export class UsersService {
  private db: PrismaClient;

  constructor(
    @inject(TYPES.Logger) private logger: LoggerService,
    @inject(TYPES.DataSource) private dataSource: DataSource
  ) {
    this.db = dataSource.client;
  }

  /**
   * Возвращает true, если пользователя с именем name нет
   * @param name Имя пользователя
   * @returns boolean
   */
  async checkNameUniqueness(name: string): Promise<boolean> {
    const count = await this.db.user.count({ where: { name } });
    return !count;
  }

  async getUserById(id: number) {
    return this.db.user.findUnique({
      select: {
        id: true,
        name: true,
        avaUrl: true,
      },
      where: { id },
    });
  }
}
