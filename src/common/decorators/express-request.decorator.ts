import { Request } from "express";
import { RequestPayload } from "../dto/request-payload.dto";

export class ExpressRequest extends Request {
    user: {
      [x: string]: any; userInfo: RequestPayload
};
}