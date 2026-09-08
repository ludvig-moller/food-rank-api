import { NextFunction, Request, Response } from "express";
import { RestaurantService } from "../services/RestaurantService";
import { parseRestaurantQuery } from "../utils/parseRestaurantQuery";

export class RestaurantController {
    private readonly restaurantService: RestaurantService;

    constructor(restaurantService: RestaurantService) {
        this.restaurantService = restaurantService;
    }

    get = (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = parseRestaurantQuery(req);

            const restaurants = this.restaurantService.get(query);

            return res.status(200).json(restaurants);
        } catch(err) {
            next(err);
        }
    }
}
