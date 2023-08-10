/* eslint-disable @typescript-eslint/no-explicit-any */
type EventCallback<TArgs extends any[]> = (...args: TArgs) => void;

export class EventEmitter<TEvents extends Record<string, EventCallback<any>> = any> {
  private events: {
    [K in keyof TEvents]?: EventCallback<Parameters<TEvents[K]>>[];
  } = {};

  constructor() {
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.emit = this.emit.bind(this);
  }

  on<K extends keyof TEvents>(eventName: K, callback: EventCallback<Parameters<TEvents[K]>>) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName]!.push(callback);
    return () => {
      this.off(eventName, callback);
    };
  }

  off<K extends keyof TEvents>(eventName: K, callback: EventCallback<Parameters<TEvents[K]>>) {
    if (!this.events[eventName]) return;

    const index = this.events[eventName]!.indexOf(callback);
    if (index !== -1) {
      this.events[eventName]!.splice(index, 1);
    }
  }

  emit<K extends keyof TEvents>(eventName: K, ...args: Parameters<TEvents[K]>) {
    if (!this.events[eventName]) return;

    for (const event of this.events[eventName]!) {
      event(...args);
    }
  }
}
