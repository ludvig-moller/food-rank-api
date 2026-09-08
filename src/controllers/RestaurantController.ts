import { Request, Response } from "express";
import { RestaurantService } from "../services/RestaurantService";
import { RestaurantQuery } from "../types/RestaurantQuery";
import { parseRestaurantQuery } from "../utils/parseRestaurantQuery";
import { HttpError } from "../errors/HttpError";

export class RestaurantController {
    private readonly restaurantService: RestaurantService;

    constructor(restaurantService: RestaurantService) {
        this.restaurantService = restaurantService;
    }

    get = (req: Request, res: Response) => {
        try {
            const query = parseRestaurantQuery(req);

            const restaurants = this.restaurantService.get(query);

            return res.status(200).json(restaurants);
        } catch(err) {
            if (err instanceof HttpError) {
                return res.status(err.statusCode).json({ "error": err.message });
            }
            return res.status(500);
        }
    }
}
