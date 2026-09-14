import { Dish } from "../models/Dish";
import { DishRepository } from "../repositories/DishRepository";
import { DishQueryDto } from "../schemas/dishes/dishQuerySchema";

export class DishService {
    private readonly dishRepository: DishRepository;

    constructor(dishRepository: DishRepository) {
        this.dishRepository = dishRepository;
    }

    get(query: DishQueryDto): Dish[] {
        return this.dishRepository.get(query);
    }
}
