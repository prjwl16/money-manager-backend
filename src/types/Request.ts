import {Request as expressRequest} from "express";

export interface Request extends expressRequest {
    user: Object;
}
