import { z } from "zod";

export const dishQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.enum(["dish_name", "price", "created_at"]).default("created_at"),
    order: z.enum(["asc", "desc"]).default("desc"),
    restaurant_id: z.string().optional(),
});

export type DishQueryDto = z.infer<typeof dishQuerySchema>;