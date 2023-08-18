import { User } from "../../types/entities";
import { Store } from "../store/MegaStore/Store";

export class UsersService {
  constructor(private store: Store<User>) {}

  upsertUser(user: User) {
    this.store.updateEntity(user.id.toString(), user);
  }

  removeUser(userId: number) {
    this.store.removeEntity(userId.toString());
  }
}
