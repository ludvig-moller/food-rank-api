import { NextFunction, Request, Response } from "express";
import { RestaurantService } from "../services/RestaurantService";
import { parseDto } from "../utils/parseDto";
import { restaurantQuerySchema } from "../schemas/restaurantQuerySchema";
import { BadRequestError } from "../errors/BadRequestError";
import { restaurantCreateSchema } from "../schemas/restaurantCreateSchema";
import { restaurantUpdateSchema } from "../schemas/restaurantUpdateSchema";

export class RestaurantController {
    private readonly restaurantService: RestaurantService;

    constructor(restaurantService: RestaurantService) {
        this.restaurantService = restaurantService;
    }

    get = (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = parseDto(restaurantQuerySchema, req.query);

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

    create = (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = parseDto(restaurantCreateSchema, req.body);

            const restaurant = this.restaurantService.create(data);

            return res.status(201).json(restaurant);
        } catch(err) {
            next(err);
        }
    }

    update = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (typeof id !== "string")
                throw new BadRequestError("Invalid restaurant ID");

            const data = parseDto(restaurantUpdateSchema, req.body);

            const restaurant = this.restaurantService.update(id, data);

            return res.status(200).json(restaurant);
        } catch(err) {
            next(err);
        }
    }

    delete = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (typeof id !== "string")
                throw new BadRequestError("Invalid restaurant ID");
            
            this.restaurantService.delete(id);

            return res.status(204).send();
        } catch(err) {
            next(err);
        }
    }
}
