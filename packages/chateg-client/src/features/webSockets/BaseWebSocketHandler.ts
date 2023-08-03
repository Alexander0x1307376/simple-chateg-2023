/* eslint-disable @typescript-eslint/no-explicit-any */
import { Socket } from "socket.io-client";

export abstract class BaseWebSocketHandler {
  constructor(protected socket: Socket) {
    this.bindHandlers = this.bindHandlers.bind(this);
  }

  protected bindHandlers<
    ListenEvents extends Record<string, (...args: any) => void>,
  >(handlers: ListenEvents) {
    for (const key in handlers) {
      const handler = handlers[key];
      if (handler) this.socket.on(key as string, handler);
    }
  }
}
