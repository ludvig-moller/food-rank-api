import { NotFoundError } from "../errors/NotFoundError";
import { Dish } from "../models/Dish";
import { DishRepository } from "../repositories/DishRepository";
import { RestaurantRepository } from "../repositories/RestaurantRepository";
import { DishCreateDto } from "../schemas/dishes/dishCreateSchema";
import { DishQueryDto } from "../schemas/dishes/dishQuerySchema";
import { DishUpdateDto } from "../schemas/dishes/dishUpdateSchema";

export class DishService {
    private readonly dishRepository: DishRepository;
    private readonly restaurantRepository: RestaurantRepository;

    constructor(
        dishRepository: DishRepository, 
        restaurantRepository: RestaurantRepository,
    ) {
        this.dishRepository = dishRepository;
        this.restaurantRepository = restaurantRepository;
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

    create(data: DishCreateDto): Dish {
        const restaurant = this.restaurantRepository.getById(data.restaurant_id);

        if (!restaurant)
            throw new NotFoundError("Restaurant not found");

        return this.dishRepository.create(data);
    }

    update(id: string, data: DishUpdateDto): Dish {
        const dish = this.dishRepository.update(id, data);

        if (!dish)
            throw new NotFoundError("Dish not found");

        return dish;
    }

    delete(id: string): void {
        const deleted = this.dishRepository.delete(id);

        if (!deleted)
            throw new NotFoundError("Dish not found");
    }
}
