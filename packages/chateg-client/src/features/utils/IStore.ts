export interface IStore<Type> {
  subscribe: (subscription: (value: Type) => void) => () => void;
  set?: (value: Type) => void;
  update?: (callback: (prev: Type) => Type) => void;
}
