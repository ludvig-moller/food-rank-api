import { NextFunction, Request, Response } from "express";
import { RestaurantService } from "../services/RestaurantService";
import { parseRestaurantQuery } from "../utils/parseRestaurantQuery";
import { BadRequestError } from "../errors/BadRequestError";

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

    getById = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (typeof id !== "string")
                throw new BadRequestError("Invalid restaurant ID");

            const restaurant = this.restaurantService.getById(id);

            return res.status(200).json(restaurant);
        } catch(err) {
            next(err);
        }
    }
}
