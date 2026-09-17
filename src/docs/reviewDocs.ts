import z from "zod";
import { registry } from "./registry";
import { reviewSchema } from "../schemas/reviews/reviewSchema";
import { reviewQuerySchema } from "../schemas/reviews/DTOs/reviewQuerySchema";
import { reviewCreateSchema } from "../schemas/reviews/DTOs/reviewCreateSchema";
import { errorSchema } from "../schemas/errorSchema";

registry.registerPath({
    method: "get",
    path: "/api/reviews",
    summary: "Get reviews",
    tags: ["Reviews"],
    request: {
        query: reviewQuerySchema,
    },
    responses: {
        200: {
            description: "Success",
            content: {
                "application/json": {
                    schema: z.array(reviewSchema),
                },
            },
        },
    },
});

registry.registerPath({
    method: "get",
    path: "/api/reviews/{id}",
    summary: "Get a review",
    tags: ["Reviews"],
    request: {
        params: z.object({
            id: z.string(),
        }),
    },
    responses: {
        200: {
            description: "Success",
            content: {
                "application/json": {
                    schema: reviewSchema,
                },
            },
        },
        400: {
            description: "Bad request",
            content: {
                "application/json": {
                    schema: errorSchema,
                },
            },
        },
        404: {
            description: "Not found",
            content: {
                "application/json": {
                    schema: errorSchema,
                },
            },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/api/reviews",
    summary: "Create review",
    tags: ["Reviews"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: reviewCreateSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Created",
            content: {
                "application/json": {
                    schema: reviewSchema,
                },
            },
        },
        400: {
            description: "Bad request",
            content: {
                "application/json": {
                    schema: errorSchema,
                },
            },
        },
    },
});
