import z from "zod";
import { registry } from "./registry";
import { dishSchema } from "../schemas/dishes/dishSchema";
import { dishQuerySchema } from "../schemas/dishes/DTOs/dishQuerySchema";
import { dishCreateSchema } from "../schemas/dishes/DTOs/dishCreateSchema";
import { dishUpdateSchema } from "../schemas/dishes/DTOs/dishUpdateSchema";
import { errorSchema } from "../schemas/errorSchema";

registry.registerPath({
    method: "get",
    path: "/api/dishes",
    summary: "Get dishes",
    tags: ["Dishes"],
    request: {
        query: dishQuerySchema,
    },
    responses: {
        200: {
            description: "Success",
            content: {
                "application/json": {
                    schema: z.array(dishSchema),
                },
            },
        },
    },
});

registry.registerPath({
    method: "get",
    path: "/api/dishes/{id}",
    summary: "Get a dish",
    tags: ["Dishes"],
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
                    schema: dishSchema,
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
    path: "/api/dishes",
    summary: "Create dish",
    tags: ["Dishes"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: dishCreateSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Created",
            content: {
                "application/json": {
                    schema: dishSchema,
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
    path: "/api/dishes/{id}",
    summary: "Update dish",
    tags: ["Dishes"],
    request: {
        params: z.object({
            id: z.string(),
        }),
        body: {
            content: {
                "application/json": {
                    schema: dishUpdateSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Success",
            content: {
                "application/json": {
                    schema: dishSchema,
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
    path: "/api/dishes/{id}",
    summary: "Delete dish",
    tags: ["Dishes"],
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
