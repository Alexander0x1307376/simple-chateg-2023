import { CustomError } from "ts-custom-error";

export class HTTPError extends CustomError {
  statusCode: number;
  context?: string;

  constructor(statusCode: number, message: string, context?: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.context = context;
  }
}
