import { Request, Response, NextFunction } from "express";
import { dishQuerySchema } from "../schemas/dishes/dishQuerySchema";
import { DishService } from "../services/DishService";
import { parseDto } from "../utils/parseDto";
import { BadRequestError } from "../errors/BadRequestError";
import { dishCreateSchema } from "../schemas/dishes/dishCreateSchema";

export class DishController {
    private readonly dishService: DishService;

    constructor(dishService: DishService) {
        this.dishService = dishService;
    }

    get = (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = parseDto(dishQuerySchema, req.query);

            const restaurants = this.dishService.get(query);

            return res.status(200).json(restaurants);
        } catch(err) {
            next(err);
        }
    }

    getById = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (typeof id !== "string")
                throw new BadRequestError("Invalid dish ID");

            const restaurant = this.dishService.getById(id);

            return res.status(200).json(restaurant);
        } catch(err) {
            next(err);
        }
    }

    create = (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = parseDto(dishCreateSchema, req.body);

            const dish = this.dishService.create(data);

            return res.status(201).json(dish);
        } catch(err) {
            next(err);
        }
    }

    delete = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (typeof id !== "string")
                throw new BadRequestError("Invalid restaurant ID");
            
            this.dishService.delete(id);

            return res.status(204).send();
        } catch(err) {
            next(err);
        }
    }
}
