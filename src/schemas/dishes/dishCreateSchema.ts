import { z } from "zod";

export const dishCreateSchema = z.object({
    restaurant_id: z.string().trim(),
    dish_name: z.string().trim().min(3).max(100),
    description: z.string().trim().min(3).max(500).optional(),
    price: z.string().trim().min(1).max(20),
});

export type DishCreateDto = z.infer<typeof dishCreateSchema>;
