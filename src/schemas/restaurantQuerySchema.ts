import { z } from "zod";

export const restaurantQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.enum(["restaurant_name", "created_at"]).default("created_at"),
    order: z.enum(["asc", "desc"]).default("desc"),
    country: z.string().optional(),
    city: z.string().optional(),
});

export type RestaurantQueryDto = z.infer<typeof restaurantQuerySchema>;
