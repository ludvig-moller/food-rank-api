import { z } from "zod";

export const restaurantCreateSchema = z.object({
    restaurant_name: z.string().trim().min(3).max(100),
    description: z.string().trim().min(3).max(1000).optional(),
    country: z.string().trim().min(3).max(100),
    city: z.string().trim().min(3).max(100),
});

export type RestaurantCreateDto = z.infer<typeof restaurantCreateSchema>;
