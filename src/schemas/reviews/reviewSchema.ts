import { z } from "zod";

export const reviewSchema = z.object({
    id: z.string(),
    dish_id: z.string(),
    rating: z.string(),
    description: z.string().nullable(),
    created_at: z.string(),
});

export type Review = z.infer<typeof reviewSchema>;
