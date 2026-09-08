import { Request } from "express";
import { RestaurantQuery } from "../types/RestaurantQuery";
import { BadRequestError } from "../errors/BadRequestError";

export function parseRestaurantQuery(req: Request): RestaurantQuery {
    const invalidParams: string[] = [];

    let page = 1;
    if (req.query.page !== undefined) {
        page = Number(req.query.page);

        if (!Number.isInteger(page) || page < 1)
            invalidParams.push("page");
    }

    let limit = 20;
    if (req.query.limit !== undefined) {
        limit = Number(req.query.limit);

        if (!Number.isInteger(limit) || limit < 1 || limit > 100)
            invalidParams.push("limit");
    }

    let sort = req.query.sort ?? "created_at";
    if (sort !== "restaurant_name" && sort !== "created_at")
        invalidParams.push("sort");

    let order = req.query.order ?? "desc";
    if (order !== "asc" && order !== "desc")
        invalidParams.push("order");

    if (invalidParams.length > 0)
        throw new BadRequestError(`Invalid query params: ${invalidParams.join(", ")}`);

    const query: RestaurantQuery = {
        page,
        limit,
        sort: sort as RestaurantQuery["sort"],
        order: order as RestaurantQuery["order"],
        country: req.query.country as string | undefined,
        city: req.query.city as string | undefined,
    };

    return query;
}
