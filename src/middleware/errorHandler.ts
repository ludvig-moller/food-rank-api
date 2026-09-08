import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/HttpError";

export function errorHandler(
    err: Error, 
    _req: Request, 
    res: Response, 
    _next: NextFunction,
) {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }

    return res.status(500).json({
        error: "Internal server error"
    });
}
