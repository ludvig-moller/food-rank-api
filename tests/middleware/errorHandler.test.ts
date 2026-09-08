import { describe, it, expect, vi } from "vitest";
import { errorHandler } from "../../src/middleware/errorHandler";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../src/errors/BadRequestError";

describe("errorHandler", () => {
    it("returns 500 for an unexpected error", () => {
        const err = new Error("Unexpected error");

        const req = {} as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        const next = vi.fn() as unknown as NextFunction;

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Internal server error",
        });
    });

    it("returns the status code from an HttpError", () => {
        const err = new BadRequestError("Bad request");

        const req = {} as Request;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response;

        const next = vi.fn() as unknown as NextFunction;

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Bad request",
        });
    });
});
