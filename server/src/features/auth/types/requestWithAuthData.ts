import { Request } from "express";
import { AuthPayload } from "../dto/authPayload.dto";

export type RequestWithAuthData = Request & { user?: AuthPayload };
