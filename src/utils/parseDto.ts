import { z } from "zod";
import { BadRequestError } from "../errors/BadRequestError";

export function parseDto<T>(
    schema: z.ZodType<T>,
    data: unknown,
) {
    const result = schema.safeParse(data);

    if (!result.success) {
        throw new BadRequestError(
            result.error.issues
                .map(issue => `${issue.path.join(".")}: ${issue.message}`)
                .join(", ")
        );
    }

    return result.data;
}
