import { z } from "zod";

export const restaurantUpdateSchema = z.object({
    restaurant_name: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().min(3).max(1000).nullable().optional(),
    country: z.string().trim().min(3).max(100).optional(),
    city: z.string().trim().min(3).max(100).optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" },
);

export type RestaurantUpdateDto = z.infer<typeof restaurantUpdateSchema>;
