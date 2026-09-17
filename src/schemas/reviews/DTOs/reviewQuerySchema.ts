import { z } from "zod";

export const reviewQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sort: z.enum(["rating", "created_at"]).default("created_at"),
    order: z.enum(["asc", "desc"]).default("desc"),
    dish_id: z.string().optional(),
});

export type ReviewQueryDto = z.infer<typeof reviewQuerySchema>;
