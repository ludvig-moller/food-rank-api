import z from "zod";
import { registry } from "./registry";
import { restaurantSchema } from "../schemas/restaurants/restaurantSchema";
import { restaurantQuerySchema } from "../schemas/restaurants/DTOs/restaurantQuerySchema";
import { restaurantCreateSchema } from "../schemas/restaurants/DTOs/restaurantCreateSchema";
import { restaurantUpdateSchema } from "../schemas/restaurants/DTOs/restaurantUpdateSchema";
import { errorSchema } from "../schemas/errorSchema";

registry.registerPath({
    method: "get",
    path: "/api/restaurants",
    summary: "Get restaurants",
    tags: ["Restaurants"],
    request: {
        query: restaurantQuerySchema,
    },
    responses: {
        200: {
            description: "Success",
            content: {
                "application/json": {
                    schema: z.array(restaurantSchema),
                },
            },
        },
    },
});

registry.registerPath({
    method: "get",
    path: "/api/restaurants/{id}",
    summary: "Get a restaurant",
    tags: ["Restaurants"],
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
                    schema: restaurantSchema,
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
    path: "/api/restaurants",
    summary: "Create restaurant",
    tags: ["Restaurants"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: restaurantCreateSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Created",
            content: {
                "application/json": {
                    schema: restaurantSchema,
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

registry.registerPath({
    method: "patch",
    path: "/api/restaurants/{id}",
    summary: "Update restaurant",
    tags: ["Restaurants"],
    request: {
        params: z.object({
            id: z.string(),
        }),
        body: {
            content: {
                "application/json": {
                    schema: restaurantUpdateSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Success",
            content: {
                "application/json": {
                    schema: restaurantSchema,
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
    method: "delete",
    path: "/api/restaurants/{id}",
    summary: "Delete restaurant",
    tags: ["Restaurants"],
    request: {
        params: z.object({
            id: z.string(),
        }),
    },
    responses: {
        204: {
            description: "No content",
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
