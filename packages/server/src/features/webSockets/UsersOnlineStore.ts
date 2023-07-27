import { UserDto } from "../users/dto/user.dto";

export class UsersOnlineStore {
  private _users: Map<number, UserDto>;
  get users() {
    return this._users;
  }

  constructor() {
    this._users = new Map();
  }

  getArray() {
    return Array.from(this._users, ([_, value]) => value);
  }

  addUser(user: UserDto) {
    this._users.set(user.id, user);
  }

  removeUser(id: number) {
    this._users.delete(id);
  }
}
