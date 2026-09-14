import { NotFoundError } from "../errors/NotFoundError";
import { NotImplementedError } from "../errors/NotImplementedError";
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

    getById(id: string): Dish {
        const dish = this.dishRepository.getById(id);

        if (!dish)
            throw new NotFoundError("Dish not found");

        return dish;
    }

    create(data: string): Dish {
        throw new NotImplementedError("This has not been implemented");
    }
}
