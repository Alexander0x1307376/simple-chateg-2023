/* eslint-disable @typescript-eslint/unbound-method */
import { EventEmitter } from "../../eventEmitter/EventEmitter";
import { IStore } from "../IStore";
import { type Draft, produce } from "immer";

export interface IEntityEmitterBase {
  onEntityCreated: (callback: (id: string, entity: unknown) => void) => void;
  onEntityUpdated: (callback: (id: string, entity: unknown) => void) => void;
  onEntityRemoved: (callback: (id: string, entity: unknown) => void) => void;
}

export interface IEntityEmitter<T> extends IEntityEmitterBase {
  onEntityCreated: (callback: (id: string, entity: T) => void) => void;
  onEntityUpdated: (callback: (id: string, entity: T) => void) => void;
  onEntityRemoved: (callback: (id: string, entity: T) => void) => void;
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
  emitter: IEntityEmitterBase;
  handleCreate?: (id: string, entity: Entity, store: State, methods: StoreMethods<Entity>) => void;
  handleUpdate?: (id: string, entity: Entity, store: State, methods: StoreMethods<Entity>) => void;
  handleRemove?: (id: string, entity: Entity, store: State, methods: StoreMethods<Entity>) => void;
};

export class Store<Entity> implements IEntityEmitterBase, IStore<Record<string, Entity>> {
  protected _store: Record<string, Entity>;
  get data() {
    return this._store;
  }
  private _emitter: EventEmitter<StoreEvents<Entity>>;
  constructor(
    deps?: DependencyHandler<Entity, Record<string, Entity>>[],
    private readonly isImmutable = true,
  ) {
    this._store = {};
    this._emitter = new EventEmitter();

    // IStore
    this.subscriptions = [];
    this.emit = this.emit.bind(this);
    this.subscribe = this.subscribe.bind(this);

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
    if (this.isImmutable) {
      this._store = produce(this._store, (draft) => {
        draft[id] = entity as Draft<Entity>;
      });
    } else {
      this._store[id] = entity;
    }
    this._emitter.emit("entityCreated", id, entity);
    this.emit(this._store);
  }
  updateEntity(id: string, entity: Entity) {
    if (this.isImmutable) {
      this._store = produce(this._store, (draft) => {
        draft[id] = entity as Draft<Entity>;
      });
    } else {
      this._store[id] = entity;
    }
    this._emitter.emit("entityUpdated", id, entity);
    this.emit(this._store);
  }
  removeEntity(id: string) {
    const entity = id in this._store ? this._store[id] : undefined;
    if (!entity) {
      console.warn(`[Store]: no entity with id ${id} in store to remove`);
      return;
    }
    if (this.isImmutable) {
      this._store = produce(this._store, (draft) => {
        delete draft[id];
      });
    } else {
      delete this._store[id];
    }
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
  offEntityCreated(callback: (id: string, entity: Entity) => void) {
    this._emitter.off("entityCreated", callback);
  }
  offEntityUpdated(callback: (id: string, entity: Entity) => void) {
    this._emitter.off("entityUpdated", callback);
  }
  offEntityRemoved(callback: (id: string, entity: Entity) => void) {
    this._emitter.off("entityRemoved", callback);
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
