/* eslint-disable @typescript-eslint/unbound-method */
import { EventEmitter } from "../../eventEmitter/EventEmitter";
import { IStore } from "../IStore";
import { type Draft, produce } from "immer";

export interface IEntityEmitter {
  onEntityCreated: (callback: (id: string, entity: unknown) => void) => void;
  onEntityUpdated: (callback: (id: string, entity: unknown) => void) => void;
  onEntityRemoved: (callback: (id: string, entity: unknown) => void) => void;
}

export type StoreEvents<Entity> = {
  entityCreated: (id: string, entity: Entity) => void;
  entityUpdated: (id: string, entity: Entity) => void;
  entityRemoved: (id: string, entity: Entity) => void;
};

export type StoreMethods<Entity> = {
  add: (id: string, entity: Entity) => void;
  update: (id: string, entity: Entity) => void;
  remove: (id: string) => void;
};

export type DependencyHandler<Entity, State> = {
  emitter: IEntityEmitter;
  handleCreate?: (id: string, entity: Entity, store: State, methods: StoreMethods<Entity>) => void;
  handleUpdate?: (id: string, entity: Entity, store: State, methods: StoreMethods<Entity>) => void;
  handleRemove?: (id: string, entity: Entity, store: State, methods: StoreMethods<Entity>) => void;
};

export class Store<Entity> implements IEntityEmitter, IStore<Record<string, Entity>> {
  private _store: Record<string, Entity>;
  get data() {
    return this._store;
  }
  private _emitter: EventEmitter<StoreEvents<Entity>>;
  constructor(deps?: DependencyHandler<Entity, Record<string, Entity>>[]) {
    this._store = {};
    this._emitter = new EventEmitter();

    // IStore
    this.subscriptions = [];
    this.emit = this.emit.bind(this);
    this.subscribe = this.subscribe.bind(this);
    // this.set = this.set.bind(this);

    this.addEntity = this.addEntity.bind(this);
    this.updateEntity = this.updateEntity.bind(this);
    this.removeEntity = this.removeEntity.bind(this);

    // устанавливаем обработчики событий для зависимостей
    if (!Array.isArray(deps)) return;

    const methods = {
      add: this.addEntity,
      update: this.updateEntity,
      remove: this.removeEntity,
    };

    deps.forEach(({ emitter, handleCreate, handleRemove, handleUpdate }) => {
      handleCreate &&
        emitter.onEntityCreated((id, entity) =>
          handleCreate(id, entity as Entity, this._store, methods),
        );
      handleUpdate &&
        emitter.onEntityUpdated((id, entity) =>
          handleUpdate(id, entity as Entity, this._store, methods),
        );
      handleRemove &&
        emitter.onEntityRemoved((id, entity) =>
          handleRemove(id, entity as Entity, this._store, methods),
        );
    });
  }

  setList(data: Record<string, Entity>) {
    this._store = data;
    this.emit(this._store);
  }

  addEntity(id: string, entity: Entity) {
    this._store = produce(this._store, (draft) => {
      draft[id] = entity as Draft<Entity>;
    });
    this._emitter.emit("entityCreated", id, entity);
    this.emit(this._store);
  }
  updateEntity(id: string, entity: Entity) {
    this._store = produce(this._store, (draft) => {
      draft[id] = entity as Draft<Entity>;
    });
    this._emitter.emit("entityUpdated", id, entity);
    this.emit(this._store);
    console.log("[STORE]:", this._store);
  }
  removeEntity(id: string) {
    const entity = id in this._store ? this._store[id] : undefined;
    if (!entity) {
      console.warn(`[Store]: no entity with id ${id} in store to remove`);
      return;
    }
    this._store = produce(this._store, (draft) => {
      delete draft[id];
    });
    console.log("[STORE]:REMOVE", this._store);
    this._emitter.emit("entityRemoved", id, entity);
    this.emit(this._store);
  }

  onEntityCreated(callback: (id: string, entity: Entity) => void) {
    this._emitter.on("entityCreated", callback);
  }
  onEntityUpdated(callback: (id: string, entity: Entity) => void) {
    this._emitter.on("entityUpdated", callback);
  }
  onEntityRemoved(callback: (id: string, entity: Entity) => void) {
    this._emitter.on("entityRemoved", callback);
  }

  // IStore implementation
  private subscriptions: ((data: Record<string, Entity>) => void)[];

  protected emit(value: Record<string, Entity>) {
    this.subscriptions.forEach((subscription) => subscription.call(this, value));
  }

  subscribe(subscription: (value: Record<string, Entity>) => void) {
    this.subscriptions.push(subscription);
    subscription(this._store);
    return () => {
      this.subscriptions.splice(this.subscriptions.indexOf(subscription), 1);
    };
  }
}
