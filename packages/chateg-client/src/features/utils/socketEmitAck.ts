import { Response } from "@simple-chateg-2023/server/src/features/webSockets/webSocketEvents";
import { Socket } from "socket.io-client";

export const socketEmitWithAck = <Request, ResponseData>(
  socket: Socket,
  eventName: string,
  data: Request,
) =>
  new Promise<Response<ResponseData>>((resolve, reject) => {
    socket.emit(eventName, data, (response: Response<ResponseData>) => {
      const { data, error, status } = response;
      if (status === "ok" && data) {
        resolve(response);
      } else if (status === "error" && error) {
        reject(response);
      } else {
        reject(`Error while emitting "${eventName}" socket event`);
      }
    });
  });
