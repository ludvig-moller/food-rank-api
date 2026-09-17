import { z } from "zod";

export const dishSchema = z.object({
    id: z.string(),
    restaurant_id: z.string(),
    dish_name: z.string(),
    description: z.string().nullable(),
    price: z.string(),
    created_at: z.string(),
});

export type Dish = z.infer<typeof dishSchema>;
