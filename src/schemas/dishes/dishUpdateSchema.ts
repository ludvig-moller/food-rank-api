import { z } from "zod";

export const dishUpdateSchema = z.object({
    dish_name: z.string().trim().min(3).max(100).nullable().optional(),
    description: z.string().trim().min(3).max(500).nullable().optional(),
    price: z.string().trim().min(1).max(20).optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" },
);

export type DishUpdateDto = z.infer<typeof dishUpdateSchema>;