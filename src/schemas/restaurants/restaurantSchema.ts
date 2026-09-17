import { z } from "zod";

export const restaurantSchema = z.object({
    id: z.string(),
    restaurant_name: z.string(),
    description: z.string().nullable(),
    country: z.string(),
    city: z.string(),
    created_at: z.string(),
});

export type Restaurant = z.infer<typeof restaurantSchema>;
