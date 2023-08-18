/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from "socket.io-client";

export abstract class BaseWebSocketHandler {
  constructor() {
    this.bindHandlers = this.bindHandlers.bind(this);
  }

  abstract init(socket: Socket): void;

  protected bindHandlers<ListenEvents extends Record<string, (...args: any) => void>>(
    socket: Socket,
    handlers: ListenEvents,
  ) {
    for (const key in handlers) {
      const handler = handlers[key];
      if (handler) socket.on(key as string, handler);
    }
  }
}
