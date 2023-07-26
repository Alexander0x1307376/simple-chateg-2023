import { User } from "@prisma/client";

export class UsersOnlineStore {
  private users: Map<number, Pick<User, "id" | "name" | "avaUrl">>;

  constructor() {
    this.users = new Map();
  }

  getList() {
    return this.users;
  }

  addUser(user: User) {
    this.users.set(user.id, user);
  }

  removeUser(id: number) {
    this.users.delete(id);
  }
}
