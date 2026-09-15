import { z } from "zod";

export const reviewCreateSchema = z.object({
    dish_id: z.string().trim(),
    rating: z.number().int().min(1).max(5).optional(),
    description: z.string().trim().min(3).max(1000).optional(),
});

export type ReviewCreateDto = z.infer<typeof reviewCreateSchema>;
